import React from 'react'
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextPage,
} from 'next'
import { signIn } from 'next-auth/react'
import { getServerAuthSession } from 'trpc/auth'
import { Route } from 'modules/routes'

export type SignInServerSideProps = Record<never, never>

export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<SignInServerSideProps>> {
  const session = await getServerAuthSession(context)
  if (session) {
    return {
      redirect: {
        destination: Route.dashboard,
        permanent: true,
      },
    }
  }
  return {
    props: {},
  }
}

const SignInPage: NextPage<SignInServerSideProps> = (
  props,
): React.ReactElement | null => {
  return (
    <div>
      <h1>Sign In</h1>
      <button
        className="rounded bg-indigo-100 px-4 py-2"
        onClick={() =>
          void signIn('credentials', {
            redirect: true,
            callbackUrl: Route.dashboard,
            email: 'abc',
            password: '123',
          })
        }
      >
        Sign In
      </button>
    </div>
  )
}

export default SignInPage
