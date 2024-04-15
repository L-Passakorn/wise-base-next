import { ok, Result } from 'libs/result'
import { Book, bookQueryScheme } from 'modules/book'
import { publicProcedure, router } from 'trpc'
import { manageBookRouter } from './manage'

export const bookRouter = router({
  list: publicProcedure.query(
    ({ ctx }): Promise<Result<Book[], Error>> => {
      return ctx.apiClient.listBooks()
    },
  ),
  findOne: publicProcedure.input(bookQueryScheme
  ).query(({ ctx, input }): Promise<Result<Book, Error>> => {                              
    return ctx.apiClient.findOneBook(input)
  }),
  manage: manageBookRouter,
})

