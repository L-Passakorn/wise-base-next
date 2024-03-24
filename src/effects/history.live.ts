import memoize from 'fast-memoize'
import { History } from './history'

export const getHistoryLive: () => History = memoize(
  (): History => ({
    replaceState: (
      data: unknown,
      unused: string,
      url?: string | URL | null,
    ): void => {
      window.history.replaceState(data, unused, url)
    },
  }),
)
