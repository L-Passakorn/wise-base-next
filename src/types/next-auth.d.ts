import { DefaultSession } from 'next-auth'
import { User } from 'modules/user'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: User & DefaultSession['user']
  }
}
