import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from './context'

export const profileRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next()
  })
  .query('get', {
    async resolve({ ctx }) {
      if (!ctx.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const userEmail = ctx.session.user.email

      if (!userEmail) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }

      const user = await ctx.prisma.user.findFirstOrThrow({
        where: { email: userEmail },
      })

      const profileId = user.profileId

      if (profileId) {
        return ctx.prisma.profile.findUniqueOrThrow({
          where: { id: profileId },
        })
      }

      const profile = await ctx.prisma.profile.create({
        data: {
          displayName: user.name,
        },
      })

      await ctx.prisma.user.update({
        where: { email: userEmail },
        data: {
          profileId: profile.id,
        },
      })

      return profile
    },
  })
  .mutation('updateDisplayName', {
    input: z.object({
      id: z.string(),
      displayName: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const profile = await ctx.prisma.profile.findUniqueOrThrow({
        where: { id: input.id },
      })

      if (profile.displayName !== input.displayName) {
        await ctx.prisma.profile.update({
          where: { id: input.id },
          data: {
            displayName: input.displayName,
          },
        })
      }

      return profile
    },
  })
