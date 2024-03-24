import memoize from 'fast-memoize'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from 'trpc/routers'
import superjson from 'superjson'
import { TRPCClient } from './trpcClient'

function getBaseUrl(baseURL: string): string {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return ''

  // return baseURL
  return 'http://localhost:3000'
}

export const getTRPCClientLive: (baseURL: string) => TRPCClient = memoize(
  (baseURL) => {
    return createTRPCProxyClient<AppRouter>({
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl(baseURL)}/api/trpc`,
        }),
      ],
    })
  },
)
