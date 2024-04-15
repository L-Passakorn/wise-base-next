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
import { Book } from 'modules/book'
import Image from 'next/image'
import CreateBookForm from 'components/CreateBookModal'

export type BooksPageProps = {
  user: User | null
  books: Book[] | null
  baseURL: string
}

export async function getBooksPageProps(
  env: Env,
  trpcClient: TRPCClient,
  user: User | null,
): Promise<Result<BooksPageProps, Error>> {
  const baseURL = env.WEB_BASE_URL
  const books = (await trpcClient.book.list.query()).val

  return ok({
    user: user ? { id: user.id, name: user.name, email: user.email } : null,
    books,
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
  const result = await getBooksPageProps(env, trpcClient, session?.user ?? null)
  return result.val
    ? {
        props: result.val,
      }
    : { notFound: true }
}

export type BooksProps = {
  user: User | null
  books: Book[] | null
  trpcClient: TRPCClient
  time: Time
}

export function Books({
  user,
  books,
  trpcClient,
  time,
}: BooksProps): Promise<React.ReactElement | null> {
  const listBooksQuery = useQuery({
    queryKey: ['listBooks'],
    queryFn: () => trpcClient.book.list.query(),
    initialData: books ? ok(books) : undefined,
  })
  const [openDropdownBookId, setOpenDropdownBookId] = useState<string | null>(null);
  const [toggleCreateModal, settoggleCreateModal] = useState(false);

  const handleBookDropdownToggle = (bookId: string) => {
    setOpenDropdownBookId(openDropdownBookId === bookId ? null : bookId);
  };

  useEffect(() => {
    const handleClickOutsideDropdown = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('.dropdown-container') === null) {
        setOpenDropdownBookId(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutsideDropdown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
    };
  }, []);

  return (
    <div>
      {toggleCreateModal ? (
        <CreateBookForm/>
        // <>
        //   <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        //     <div className="relative my-6 mx-auto w-auto max-w-3xl">
        //       {/*content*/}
        //       <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
        //         {/*header*/}
        //         <div className="flex items-start justify-between rounded-t border-b border-solid border-gray-200 p-5">
        //           <h3 className="text-3xl font-semibold">Create a book</h3>
        //           <button
        //             className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
        //             onClick={() => {
        //               settoggleCreateModal(false)
        //             }}
        //           >
        //             <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-30 outline-none focus:outline-none">
        //               ×
        //             </span>
        //           </button>
        //         </div>
        //         {/*body*/}
        //         <div className="relative flex-auto p-6">
        //           <CreateBookForm/>
        //           {/* <p className="text-blueGray-500 my-4 text-lg leading-relaxed">
        //             Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        //             Reiciendis, temporibus? Autem voluptatibus, exercitationem
        //             velit ipsum aliquid a voluptatum minus beatae, atque est
        //             delectus quos illo ab tempore quia vero reiciendis?
        //           </p> */}
        //         </div>
        //         {/*footer*/}
        //         <div className="flex items-center justify-end rounded-b border-t border-solid border-gray-200 p-6">
        //           <button
        //             className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
        //             type="button"
        //             onClick={() => {
        //               settoggleCreateModal(false)
        //             }}
        //           >
        //             Cancel
        //           </button>
        //           <button
        //             className="mr-1 mb-1 rounded bg-emerald-500 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-emerald-600"
        //             type="button"
        //             onClick={() => {
        //               settoggleCreateModal(false)
        //             }}
        //           >
        //             Create
        //           </button>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        //   <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        // </>
      ) : null}
      <div className="space-y-4 bg-gradient-to-br from-gray-200 via-white to-gray-300">
        <div className="sticky top-0 z-10 mx-auto flex h-14 w-full flex-row items-center justify-between bg-white md:h-16 xl:h-20">
          <span className="ml-4 text-xl font-bold text-black md:text-2xl lg:text-3xl xl:text-4xl">
            Pupa shop
          </span>
          <div>
            {true ? (
              <div className="mr-4 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-md font-semibold md:text-lg lg:text-xl xl:text-2xl">
                    {/* Hi {user.name}@{user.email} */}
                    Hi! John@example.com
                  </div>
                  <button
                    className="text-md rounded-full border border-orange-700 bg-orange-700 px-6 py-2 font-semibold text-white hover:bg-white hover:text-black md:text-lg lg:text-xl xl:text-2xl"
                    onClick={() => {
                      settoggleCreateModal(true)
                    }}
                  >
                    Create
                  </button>
                  <button
                    className="text-md rounded-full bg-gray-800 px-4 py-2 font-semibold text-white hover:bg-gray-200 hover:text-black md:text-lg lg:text-xl xl:text-2xl"
                    onClick={() => void signOut()}
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <Link href={Route.signIn}>
                  <button className="text-md mr-4 rounded-full border border-orange-700 bg-orange-700 px-6 py-2 font-semibold text-white hover:bg-white hover:text-black md:text-lg lg:text-xl xl:text-2xl">
                    Sign In
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>{listBooksQuery.isLoading && <span>Loading</span>}</div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {listBooksQuery.data?.val &&
              listBooksQuery.data.val.map((e) => (
                <div key={e.id}>
                  <Book
                    book={e}
                    trpcClient={trpcClient}
                    isOpen={openDropdownBookId === e.id}
                    onToggle={() => handleBookDropdownToggle(e.id)}
                  />
                </div>
              ))}
          </div>
        </div>
        {/* <div className="space-y-4">
          <div>{listBooksQuery.isLoading && <span>Loading</span>}</div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {listBooksQuery.data?.val &&
              listBooksQuery.data.val.map((e) => (
                <div key={e.id}>
                  <Book book={e} trpcClient={trpcClient} />
                </div>
              ))}
          </div>
        </div> */}
      </div>
    </div>
  )
}

// type BookProps = { book: Book; trpcClient: TRPCClient }
type BookProps = { 
  book: Book; 
  trpcClient: TRPCClient;
  isOpen: boolean;
  onToggle: () => void;
}

function Book(props: BookProps): JSX.Element {
  const { book, trpcClient, isOpen, onToggle } = props;
  const queryClient = useQueryClient();
  const deleteBookMutation = useMutation(trpcClient.book.manage.delete.mutate, {
    onSuccess: () => {
      void queryClient.invalidateQueries(['listBooks']);
    },
  });

  const handleDropdownButtonClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation(); // Stop event propagation to prevent the click from reaching document
    onToggle();
  }

  return (
    <div className="my-4 mx-auto w-full space-y-3 rounded bg-white p-6 shadow-2xl">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center space-x-2">
          <span className="space-x-2 text-sm text-gray-500">
            <span className="text-md font-bold text-gray-900 md:text-lg lg:text-xl xl:text-2xl">
              {book.author?.name}
            </span>
          </span>
        </div>
        <div className="relative inline-block ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
            onClick={handleDropdownButtonClick}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          {/* <button
            onClick={() => setToggleDropdown(!toggleDropdown)}
            className="relative z-10 block rounded-md border border-transparent bg-white p-2 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-400 dark:focus:ring-opacity-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button> */}
          {isOpen ? (
            <>
              <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-2 shadow-xl dark:bg-gray-800">
                <a className="flex transform items-center px-3 py-3 text-xl capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="mx-1 h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>

                  <span className="mx-1">Edit</span>
                </a>

                <a
                  onClick={() => {
                    deleteBookMutation.mutate({ bookId: book.id })
                  }}
                  className="flex transform items-center p-3 text-xl capitalize text-gray-600 transition-colors duration-300 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <svg
                    className="mx-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>

                  <span className="mx-1">Delete</span>
                </a>
              </div>
            </>
          ) : null}
        </div>
        {/* <svg
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
        </svg> */}
      </div>
      <div>
        {book.thumbnailUrl && (
          <div
            className="aspect-[2/3] w-full rounded-md bg-cover bg-center"
            style={{ backgroundImage: `url(${book.thumbnailUrl})` }}
          />
        )}
      </div>
      {/* <img className="aspect-square w-full object-cover" src={photo.url} /> */}
    </div>

    // <div className="my-4 mx-auto w-96 space-y-3 rounded bg-white p-6 shadow-xl">
    //   <div className="flex flex-row items-center justify-between">
    //     <div className="flex flex-row items-center space-x-2">
    //       <span className="space-x-2 text-sm text-gray-500">
    //         <span className="font-bold text-gray-900">{book.author?.name}</span>
    //         <span>&middot;</span>
    //         <span>2 d</span>
    //       </span>
    //     </div>

    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       fill="none"
    //       viewBox="0 0 24 24"
    //       strokeWidth={1.5}
    //       stroke="currentColor"
    //       className="h-6 w-6"
    //     {'>'}
    //       <path
    //         strokeLinecap="round"
    //         strokeLinejoin="round"
    //         d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    //       /{'>'}
    //     </svg>
    //   </div>
    //   <div className="flex aspect-square h-full w-full flex-col rounded-md border-2 bg-gray-100">
    //     <div className="m-auto w-full justify-center text-center">
    //       <div className="text-2xl font-extrabold ">{book.title}</div>
    //       <div className="mt-3 flex flex-row justify-center gap-2">
    //         {book.category &&
    //           book.category.map((e) ={'>'} (
    //             <div
    //               className="h-6 rounded-full bg-gray-200 px-4 font-light"
    //               key={e}
    //             {'>'}
    //               {e}
    //             </div>
    //           )){'}'}
    //       </div>
    //     </div>
    //   </div>
    //   {/* <img className="aspect-square w-full object-cover" src={photo.url} /> */}
    //   <div className="space-y-1">
    //     <div className="flex flex-row items-center justify-between">
    //       <div className="flex flex-row items-center space-x-2">
    //         <LikeButton />
    //         <LikeButton />
    //         <LikeButton />
    //       </div>

    //       <button>
    //         <svg
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //           strokeWidth={1.5}
    //           stroke="currentColor"
    //           className="h-6 w-6"
    //         >
    //           <path
    //             stroke-linecap="round"
    //             stroke-linejoin="round"
    //             d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    //           />
    //         </svg>
    //       </button>
    //     </div>
    //     <div>
    //       <span className="text-xs font-bold">10,459 likes</span>
    //     </div>
    //     <div className="text-gray-500">
    //       <p className="text-xs font-normal">{book.detail}</p>
    //     </div>
    //   </div>
    // </div>
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
  books,
}): React.ReactElement | null => {
  const trpcClient = getTRPCClientLive(baseURL)
  const time = getTimeLive()
  return <Books user={user} books={books} trpcClient={trpcClient} time={time} />
}

export default BooksPage
