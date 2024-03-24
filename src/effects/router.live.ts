import memoize from 'fast-memoize'
import { NextRouter } from 'next/router'
import { Router } from './router'

export const getRouterLive: (router: NextRouter) => Router = memoize(
  (router): Router => {
    return {
      push: router.push,
    }
  },
)
