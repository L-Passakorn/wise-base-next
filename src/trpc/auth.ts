import type { GetServerSidePropsContext } from 'next'
import { Session, getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext['req']
  res: GetServerSidePropsContext['res']
}): Promise<Session | null> => {
  return getServerSession(ctx.req, ctx.res, authOptions)
}
