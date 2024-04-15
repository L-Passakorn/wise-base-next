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
import { Book, bookQueryScheme } from 'modules/book'

export type BooksPageProps = {
  user: User | null
  bookId: string
  book: Book | null
  baseURL: string
}

export async function getBooksPageProps(
  env: Env,
  trpcClient: TRPCClient,
  query: NodeJS.Dict<string | string[]>,
  user: User | null,
): Promise<Result<BooksPageProps, Error>> {
  const baseURL = env.WEB_BASE_URL
  const { bookId } = bookQueryScheme.parse(query)
  const book = (await trpcClient.book.findOne.query({ bookId: bookId })).val
  return ok({
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    book,
    bookId,
    baseURL,
  })
}

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<BooksPageProps>> {
  const env = getEnvLive()
  // const trpcClient = getTRPCClientLive(env.WEB_BASE_URL)
  const apiClient = getAPIClientLive(env.SERVICE_BASE_URL)
  const session = await getServerAuthSession(context)
  const trpcClient = await getTRPCServerLive({
    apiClient,
    env,
    session,
  })
  const result = await getBooksPageProps(
    env,
    trpcClient,
    context.query,
    session?.user ?? null,
  )
  return result.val
    ? {
        props: result.val,
      }
    : { notFound: true }
}

export type BooksProps = {
  user: User | null
  book: Book | null
  bookId: string
  trpcClient: TRPCClient
  time: Time
}

export function Books({
  user,
  book,
  trpcClient,
  bookId,
  time,
}: BooksProps): React.ReactElement | null {
  const findOneBookQuery = useQuery({
    queryKey: ['findOneBook', bookId],
    queryFn: () => trpcClient.book.findOne.query({ bookId: bookId }),
    initialData: book ? ok(book) : undefined,
  })

  return (
    <div className="space-y-4">
      <h1>Books</h1>
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
        <h2 className="font-medium">Books</h2>
        <div>{findOneBookQuery.isLoading && <span>Loading</span>}</div>
        <div className="flex flex-col">
          {findOneBookQuery.data?.val && (
            <div>
              <Book book={findOneBookQuery.data.val} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type BookProps = { book: Book }

function Book(props: BookProps): JSX.Element {
  const { book } = props
  return (
    <div className="my-4 mx-auto w-96 space-y-3 rounded bg-white p-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-2">
          <span className="space-x-2 text-sm text-gray-500">
            <span className="font-bold text-gray-900">{book.author?.name}</span>
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
      <div className="flex aspect-square h-full w-full flex-col rounded-md border-2 bg-gray-100">
        <div className="m-auto w-full justify-center text-center">
          <div className="text-2xl font-extrabold ">{book.title}</div>
          <div className="mt-3 flex flex-row justify-center gap-2">
            {book.category &&
              book.category.map((e) => (
                <div
                  className="h-6 rounded-full bg-gray-200 px-4 font-light"
                  key={e}
                >
                  {e}
                </div>
              ))}
          </div>
        </div>
      </div>
      {/* <img className="aspect-square w-full object-cover" src={photo.url} /> */}
      <div className="space-y-1">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center space-x-2">
            <LikeButton />
            <LikeButton />
            <LikeButton />
          </div>

          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
        <div>
          <span className="text-xs font-bold">10,459 likes</span>
        </div>
        <div className="text-gray-500">
          <p className="text-xs font-normal">{book.detail}</p>
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

const BooksPage: NextPage<BooksPageProps> = ({
  user,
  baseURL,
  bookId,
  book,
}): React.ReactElement | null => {
  const trpcClient = getTRPCClientLive(baseURL)
  const time = getTimeLive()
  return (
    <Books
      user={user}
      book={book}
      bookId={bookId}
      trpcClient={trpcClient}
      time={time}
    />
  )
}

export default BooksPage
