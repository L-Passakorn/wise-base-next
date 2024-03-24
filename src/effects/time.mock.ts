import { Time } from './time'

export const getTimeMock = (): Time => ({
  now: jest.fn(),
  startTimeout: jest.fn(),
  clearTimeout: jest.fn(),
})
