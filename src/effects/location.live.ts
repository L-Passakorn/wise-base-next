import memoize from 'fast-memoize'
import { Location } from './location'

export const getLocationLive: () => Location = memoize(
  (): Location => ({
    getPathname: (): string => location.pathname,
    getSearch: (): string => location.search,
  }),
)
