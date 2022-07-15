import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createRouter } from './context'

export const teamRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next()
  })
  .query('getAll', {
    async resolve({ ctx }) {
      if (!ctx.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const user = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      if (!user.profileId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' })
      }

      const teamsFromDb = await ctx.prisma.team.findMany({
        where: {
          members: {
            some: {
              profileId: user.profileId,
            },
          },
        },
        include: {
          _count: {
            select: { members: true },
          },
          members: {
            where: {
              profileId: user.profileId,
            },
            select: {
              role: true,
            },
          },
        },
      })

      return teamsFromDb.map(team => ({
        id: team.id,
        name: team.name,
        memberCount: team._count.members,
        profileRole: team.members.map(member => member.role),
      }))
    },
  })
  .mutation('create', {
    input: z.object({
      name: z.string().min(1).max(100),
    }),
    async resolve({ ctx, input }) {
      if (!ctx.session) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
      }

      const user = await ctx.prisma.user.findFirst({
        where: { id: ctx.session.user.id },
      })

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
      }

      if (!user.profileId) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Profile not found' })
      }

      const team = await ctx.prisma.profileInTeam.create({
        data: {
          role: 'admin',
          profile: {
            connect: {
              id: user.profileId,
            },
          },
          team: {
            create: {
              name: input.name,
              updatedAt: new Date(),
            },
          },
        },
      })

      return team
    },
  })
