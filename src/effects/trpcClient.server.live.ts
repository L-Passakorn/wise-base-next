import memoize from 'fast-memoize'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import { appRouter, AppRouter } from 'trpc/routers'
import superjson from 'superjson'
import { TRPCClient } from './trpcClient'
import {
  createContext,
  createContextInner,
  CreateInnerContextOptions,
} from 'trpc/context'

export const getTRPCServerLive: (
  opt: CreateInnerContextOptions,
) => Promise<TRPCClient> = memoize(async (opt) => {
  const context = await createContextInner(opt)
  const tprc = appRouter.createCaller(context)
  return {
    ping: { query: tprc.ping },
    webURL: { query: tprc.webURL },
    photo: {
      list: { query: tprc.photo.list },
    },
    book: {
      list: { query: tprc.book.list },
      findOne: { query: tprc.book.findOne },
      manage: {
        create: { mutate: tprc.book.manage.create },
        update: { mutate: tprc.book.manage.update },
        delete: { mutate: tprc.book.manage.delete },
      },
    },
    tag: {
      list: { query: tprc.tag.list },
      get: { query: tprc.tag.get },
      manage: {
        create: { mutate: tprc.tag.manage.create },
        delete: { mutate: tprc.tag.manage.delete },
      },
    },
  }
})
