import { ok, Result } from 'libs/result'
import { publicProcedure, router } from 'trpc/index'
import { z } from 'zod'
import { photoRouter } from './photos'
import { tagRouter } from './tags'
import { bookRouter } from './books'

export const appRouter = router({
  ping: publicProcedure.query((): string => {
    return 'pong'
  }),
  webURL: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }): Promise<Result<string, Error>> => {
      return Promise.resolve(ok(ctx.env.WEB_BASE_URL))
    }),
  tag: tagRouter,
  photo: photoRouter,
  book: bookRouter,
})

export type AppRouter = typeof appRouter
