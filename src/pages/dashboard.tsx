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
import { type ListTag } from 'trpc/routers/tags'
import { Time } from 'effects/time'
import { getTimeLive } from 'effects/time.live'
import { z } from 'zod'
import { getTRPCClientMock } from 'effects/trpcClient.mock'

export type DashboardPageProps = {
  user: User | null
  tags: ListTag[] | null
  baseURL: string
}

export async function getDashboardPageProps(
  env: Env,
  trpcClient: TRPCClient,
  user: User | null,
): Promise<Result<DashboardPageProps, Error>> {
  const baseURL = env.WEB_BASE_URL
  const tags = (await trpcClient.tag.list.query({})).val
  return ok({
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    tags,
    baseURL,
  })
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<DashboardPageProps>> {
  const env = getEnvLive()
  const trpcClient = getTRPCClientLive(env.WEB_BASE_URL)
  const session = await getServerAuthSession(context)
  const result = await getDashboardPageProps(
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

export type DashboardProps = {
  user: User | null
  tags: ListTag[] | null
  trpcClient: TRPCClient
  time: Time
}

export function Dashboard({
  user,
  tags,
  trpcClient,
  time,
}: DashboardProps): React.ReactElement | null {
  const queryClient = useQueryClient()
  const [tagSearchKeyword, setTagSearchKeyword] = useState('')
  const [debouncedTagSearchKeyword, setDebouncedTagSearchKeyword] = useState('')
  const [tagName, setTagName] = useState('')

  const listTagsQuery = useQuery({
    queryKey: ['listTags', debouncedTagSearchKeyword],
    queryFn: () =>
      trpcClient.tag.list.query({
        keyword: tagSearchKeyword.length > 0 ? tagSearchKeyword : undefined,
      }),
    initialData: tags ? ok(tags) : undefined,
  })
  const createTagMutation = useMutation(trpcClient.tag.manage.create.mutate, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['listTags'])
    },
  })
  const deleteTagMutation = useMutation(trpcClient.tag.manage.delete.mutate, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['listTags'])
    },
  })

  useEffect(() => {
    const [timeout, id] = time.startTimeout(500)
    void timeout.then(() => {
      setDebouncedTagSearchKeyword(tagSearchKeyword)
    })
    return () => {
      time.clearTimeout(id)
    }
  }, [tagSearchKeyword, setDebouncedTagSearchKeyword, time])

  return (
    <div className="space-y-4">
      <h1>Dashboard</h1>
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
          <div className="flex space-x-4">
            <input
              className="h-10 rounded border border-gray-200"
              value={tagName}
              onChange={(e) => {
                setTagName(e.target.value)
              }}
            />
            <button
              className="rounded bg-indigo-100 px-4 py-2"
              onClick={() => {
                if (tagName.length > 0) {
                  createTagMutation.mutate({ name: tagName })
                  setTagName('')
                }
              }}
            >
              Add tag
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
        <h2 className="font-medium">Tags</h2>
        <div>
          <input
            className="h-10 rounded border border-gray-200"
            placeholder="Search tags"
            value={tagSearchKeyword}
            onChange={(e) => {
              setTagSearchKeyword(e.target.value)
            }}
          />
        </div>
        {listTagsQuery.isLoading ||
        !listTagsQuery.data ||
        !listTagsQuery.data.val ? (
          <span>Loading</span>
        ) : (
          <div className="flex flex-wrap">
            {listTagsQuery.data.val.map(({ id, name }) => (
              <span key={id} className="flex items-center space-x-1 p-2">
                <span>{name}</span>
                <button
                  className="rounded-full bg-gray-200 p-1 hover:bg-gray-300"
                  onClick={() => {
                    deleteTagMutation.mutate({ id })
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const DashboardPage: NextPage<DashboardPageProps> = ({
  user,
  baseURL,
  tags,
}): React.ReactElement | null => {
  const trpcClient = getTRPCClientLive(baseURL)
  const time = getTimeLive()
  return (
    <Dashboard user={user} tags={tags} trpcClient={trpcClient} time={time} />
  )
}

export default DashboardPage
