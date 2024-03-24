import { DateTime } from 'luxon'

export type Time = {
  now: () => DateTime
  startTimeout: (ms: number | undefined) => [Promise<void>, NodeJS.Timeout]
  clearTimeout: (id: NodeJS.Timeout) => void
}
