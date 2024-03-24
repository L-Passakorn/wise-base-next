import React, { useEffect, useState } from 'react'
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { getServerAuthSession } from 'trpc/auth'
import { getTRPCClientLive } from 'effects/trpcClient.live'
import { getEnvLive } from 'effects/env.list'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { err, ok, type Result } from 'libs/result'
import { Route } from 'modules/routes'
import { type Env } from 'effects/env'
import { type TRPCClient } from 'effects/trpcClient'
import { type User } from 'modules/user'
import { type ListPhoto } from 'trpc/routers/photos'
import { Time } from 'effects/time'
import { getTimeLive } from 'effects/time.live'
import { getTRPCServerLive } from 'effects/trpcClient.server.live'
import { getAPIClientLive } from 'effects/apiClient.live'

export type PhotosPageProps = {
  user: User | null
  photos: ListPhoto[] | null
  baseURL: string
}

export async function getPhotosPageProps(
  env: Env,
  trpcClient: TRPCClient,
  user: User | null,
): Promise<Result<PhotosPageProps, Error>> {
  const baseURL = env.WEB_BASE_URL
  const photos = (await trpcClient.photo.list.query()).val
  return ok({
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    photos,
    baseURL,
  })
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<PhotosPageProps>> {
  const env = getEnvLive()
  // const trpcClient = getTRPCClientLive(env.WEB_BASE_URL)
  const apiClient = getAPIClientLive(env.SERVICE_BASE_URL)
  const session = await getServerAuthSession(context)
  const trpcClient = await getTRPCServerLive({
    apiClient,
    env,
    session,
  })
  const result = await getPhotosPageProps(
    env,
    trpcClient,
    session?.user ?? null,
  )
  return result.val
    ? {
        props: result.val,
      }
    : { notFound: true }
}

export type PhotosProps = {
  user: User | null
  photos: ListPhoto[] | null
  trpcClient: TRPCClient
  time: Time
}

export function Photos({
  user,
  photos,
  trpcClient,
  time,
}: PhotosProps): React.ReactElement | null {
  const listPhotosQuery = useQuery({
    queryKey: ['listPhotos'],
    queryFn: () => trpcClient.photo.list.query(),
    initialData: photos ? ok(photos) : undefined,
  })

  return (
    <div className="space-y-4">
      <h1>Photos</h1>
      {user ? (
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div>
              Hi {user.name}@{user.email}
            </div>
            <button
              className="rounded bg-indigo-100 px-4 py-2"
              onClick={() => void signOut()}
            >
              Log out
            </button>
          </div>
        </div>
      ) : (
        <div>
          <Link href={Route.signIn}>
            <button className="rounded bg-indigo-100 px-4 py-2">Sign In</button>
          </Link>
        </div>
      )}
      <div className="space-y-4">
        <h2 className="font-medium">Photos</h2>
        <div>{listPhotosQuery.isLoading && <span>Loading</span>}</div>
        <div className="flex flex-col">
          {listPhotosQuery.data?.val &&
            listPhotosQuery.data.val.map((photo) => (
              <div key={photo.id}>
                <Photo photo={photo} />
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

type PhotoProps = { photo: ListPhoto }

function Photo(props: PhotoProps): JSX.Element {
  const { photo } = props
  return (
    <div className="my-4 mx-auto w-96 space-y-3 rounded bg-white p-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={photo.thumbnailUrl}
          />
          <span className="space-x-2 text-sm text-gray-500">
            <span className="font-bold text-gray-900">{photo.title}</span>
            <span>&middot;</span>
            <span>2 d</span>
          </span>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </div>
      <img className="aspect-square w-full object-cover" src={photo.url} />
      <div className="space-y-1">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-2">
            <LikeButton />
            <LikeButton />
            <LikeButton />
          </div>

          <LikeButton />
        </div>
        <div>
          <span className="text-xs font-bold">10,459 likes</span>
        </div>
      </div>
    </div>
  )
}

function LikeButton(): React.ReactElement {
  return (
    <button className="rounded p-1 hover:bg-gray-200">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  )
}

const PhotosPage: NextPage<PhotosPageProps> = ({
  user,
  baseURL,
  photos,
}): React.ReactElement | null => {
  const trpcClient = getTRPCClientLive(baseURL)
  const time = getTimeLive()
  return (
    <Photos user={user} photos={photos} trpcClient={trpcClient} time={time} />
  )
}

export default PhotosPage
