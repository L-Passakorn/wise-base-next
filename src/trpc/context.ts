import { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { Session } from 'next-auth'
import { getServerAuthSession } from './auth'
import { APIClient } from 'effects/apiClient'
import { getAPIClientLive } from 'effects/apiClient.live'
import { Env } from 'effects/env'
import { getEnvLive } from 'effects/env.list'

import { getAPIClientInMemory } from 'effects/apiClient.mock'

export type CreateInnerContextOptions = {
  session: Session | null
  apiClient: APIClient
  env: Env
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export function createContextInner(
  opts: CreateInnerContextOptions,
): Promise<Context> {
  return Promise.resolve({
    session: opts.session,
    // TODO: Only for testing
    // apiClient: opts.apiClient,
    apiClient: getAPIClientInMemory(),
    env: opts.env,
  })
}

export type Context = {
  session: Session | null
  apiClient: APIClient
  env: Env
}

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: CreateNextContextOptions,
): Promise<Context> {
  const { req, res } = opts
  const session = await getServerAuthSession({ req, res })
  const env = getEnvLive()
  const apiClient = getAPIClientLive(env.SERVICE_BASE_URL)
  return await createContextInner({
    session,
    apiClient,
    env,
  })
}
