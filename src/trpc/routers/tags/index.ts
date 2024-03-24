import { ok, Result } from 'libs/result'
import { publicProcedure, router } from 'trpc'
import { z } from 'zod'
import { manageTagRouter } from './manage'

export type ListTag = {
  id: number
  name: string
}

export type GetTag = {
  id: number
  fullName: string
  creator: string
}

export const tagRouter = router({
  list: publicProcedure
    .input(
      z.object({
        keyword: z.string().optional(),
      }),
    )
    .query(({ ctx, input }): Promise<Result<ListTag[], Error>> => {
      return ctx.apiClient.listTags(input)
    }),
  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }): Promise<Result<GetTag, Error>> => {
      return Promise.resolve(
        ok({ id: input.id, fullName: 'Books', creator: 'Beer' }),
      )
    }),
  manage: manageTagRouter,
})
