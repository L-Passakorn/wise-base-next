import NextAuth, { type NextAuthOptions, type User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getEnvLive } from 'effects/env.list'
import { Route } from 'modules/routes'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'jsmith@abc.com' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials): Promise<User> {
        // TODO: Authorize with KeyCloak Provider
        const env = getEnvLive()
        return Promise.resolve({
          id: 'abc',
          name: 'Cater',
          email: credentials?.email,
        })
      },
    }),
  ],
  // TODO: Subjects to be deleted
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.sub = user.id
        token.email = user.email
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.name = token.name ?? null
      }
      return session
    },
  },
  events: {},
  pages: {
    signIn: Route.signIn,
  },
}

export default NextAuth(authOptions)
