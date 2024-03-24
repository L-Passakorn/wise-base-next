import { ok, Result } from 'libs/result'
import { publicProcedure, router } from 'trpc'

export type ListPhoto = {
  albumId: number
  id: number
  title: string
  url: string
  thumbnailUrl: string
}

export const photoRouter = router({
  list: publicProcedure.query(
    ({ ctx }): Promise<Result<ListPhoto[], Error>> => {
      return ctx.apiClient.listPhotos()
    },
  ),
})
