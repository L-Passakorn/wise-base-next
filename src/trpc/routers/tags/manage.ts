import { protectedProcedure, router } from 'trpc'
import { z } from 'zod'

export const manageTagRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.apiClient.createTag(input)
    }),
  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.apiClient.deleteTag(input)
    }),
})
