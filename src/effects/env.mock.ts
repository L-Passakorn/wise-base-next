import { Env } from './env'

export const getEnvLive = (): Env => ({
  WEB_BASE_URL: 'WEB_BASE_URL',
  SERVICE_BASE_URL: 'SERVICE_BASE_URL',
  NEXTAUTH_URL: 'NEXTAUTH_URL',
  NEXTAUTH_SECRET: 'NEXTAUTH_SECRET',
})
