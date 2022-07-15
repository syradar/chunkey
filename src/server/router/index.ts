// src/server/router/index.ts
import { createRouter } from './context'
import superjson from 'superjson'

import { exampleRouter } from './example'
import { authRouter } from './auth'
import { profileRouter } from './profile'
import { teamRouter } from './team'

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('example.', exampleRouter)
  .merge('auth.', authRouter)
  .merge('profile.', profileRouter)
  .merge('team.', teamRouter)

// export type definition of API
export type AppRouter = typeof appRouter
