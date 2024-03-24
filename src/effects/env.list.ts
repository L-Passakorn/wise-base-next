import memoize from 'fast-memoize'
import { Env, envScheme } from './env'

export const getEnvLive: () => Env = memoize(
  (): Env => envScheme.parse(process.env),
)
