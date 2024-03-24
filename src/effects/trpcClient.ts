import { createTRPCProxyClient } from '@trpc/client'
import type { AppRouter } from 'trpc/routers'

export type TRPCClient = ReturnType<typeof createTRPCProxyClient<AppRouter>>
