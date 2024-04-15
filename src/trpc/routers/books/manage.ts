import { BookScheme, bookFormSchema, bookQueryScheme } from 'modules/book'
import { protectedProcedure, publicProcedure, router } from 'trpc'
import { z } from 'zod'


export const manageBookRouter = router({
  create: publicProcedure
    .input(
      bookFormSchema,
    )
    .mutation(({ ctx, input }) => {
      return ctx.apiClient.createBook(input)
    }),
  update: publicProcedure
    .input(
      z.object({
        bookId: bookQueryScheme,
        data: bookFormSchema, // Assuming bookFormSchema represents the schema for updating a book
      }),
    )
    .mutation(({ ctx, input }) => {
      const { bookId, data } = input;
      return ctx.apiClient.updateBook(bookId, data);
    }),
    delete: publicProcedure
      .input(bookQueryScheme
      )
      .mutation(async ({ ctx, input }) => {
        const foundBook = await ctx.apiClient.findOneBook(input)
      if (!foundBook) throw new Error("Book Not found")
      return ctx.apiClient.deleteBook(input);
      }),
})
