import React from 'react'
import type {
  NextPage,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { getEnvLive } from 'effects/env.list'
import { getRouterLive } from 'effects/router.live'
import { getTimeLive } from 'effects/time.live'
import type { Router } from 'effects/router'
import type { History } from 'effects/history'
import type { Location } from 'effects/location'
import { getHistoryLive } from 'effects/history.live'
import { getLocationLive } from 'effects/location.live'
import { getTRPCClientLive } from 'effects/trpcClient.live'
import { useQuery } from '@tanstack/react-query'
import { map, ok, Result } from 'libs/result'
import Head from 'next/head'
import { TRPCClient } from 'effects/trpcClient'
import { Env } from 'effects/env'
import { Time } from 'effects/time'
import { getTRPCServerLive } from 'effects/trpcClient.server.live'
import { getAPIClientLive } from 'effects/apiClient.live'
import { getServerAuthSession } from 'trpc/auth'

const CurrentTime = dynamic(() => import('components/CurrentTime'), {
  ssr: false,
})

export type IndexPageProps = {
  title: string
  baseURL: string
  currentTime: string
}

export async function getIndexProps(
  trpcClient: TRPCClient,
  time: Time,
  env: Env,
): Promise<Result<IndexPageProps, Error>> {
  return map(await trpcClient.webURL.query({ id: 123 }), (title) => ({
    title,
    baseURL: env.WEB_BASE_URL,
    currentTime: time.now().toISO(),
  }))
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<IndexPageProps>> {
  const env = getEnvLive()
  const time = getTimeLive()
  const apiClient = getAPIClientLive(env.SERVICE_BASE_URL)
  const session = await getServerAuthSession(context)
  const trpcClient = await getTRPCServerLive({
    apiClient,
    env,
    session,
  })
  const { val: props, err: error } = await getIndexProps(trpcClient, time, env)
  if (props) return { props }
  else {
    console.error(
      'getServerSideProps failed for',
      context.resolvedUrl,
      'error:',
      error,
    )
    return { notFound: true }
  }
}

export type IndexProps = {
  title: string
  currentTime: string
  history: History
  location: Location
  router: Router
  time: Time
  trpcClient: TRPCClient
}

function Index({
  time,
  trpcClient,
  currentTime,
  title,
}: IndexProps): React.ReactElement | null {
  const query = useQuery({
    queryKey: ['webURL'],
    queryFn: () => trpcClient.webURL.query({ id: 123 }),
    initialData: ok(title),
  })
  if (query.isLoading || !query.data || !query.data.ok) return null

  const webURL = query.data.val
  return (
    <div>
      <Head>
        <title>{webURL}</title>
        <meta name="title" content={webURL} />
        <meta name="description" content={webURL} />
      </Head>
      <h1 className="text-3xl font-bold underline">Hello {title}</h1>
      <div>{webURL}</div>
      <div>Time from server: [ISO {currentTime}]</div>
      <div>
        <CurrentTime time={time} />
      </div>
    </div>
  )
}

const IndexPage: NextPage<IndexPageProps> = (
  props,
): React.ReactElement | null => {
  const router = useRouter()
  return (
    <Index
      currentTime={props.currentTime}
      title={props.title}
      history={getHistoryLive()}
      location={getLocationLive()}
      router={getRouterLive(router)}
      time={getTimeLive()}
      trpcClient={getTRPCClientLive(props.baseURL)}
    />
  )
}

export default IndexPage
