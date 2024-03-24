import memoize from 'fast-memoize'
import { DateTime } from 'luxon'
import { Time } from './time'

export const getTimeLive: () => Time = memoize((): Time => {
  return {
    now: (): DateTime => DateTime.now(),
    startTimeout: (ms) => {
      let id: NodeJS.Timeout | undefined
      const promise = new Promise<void>((resolve) => {
        id = setTimeout(resolve, ms)
      })
      if (!id) throw new Error('Timeout id is not created')
      return [promise, id]
    },
    clearTimeout: (id) => {
      clearTimeout(id)
    },
  }
})
