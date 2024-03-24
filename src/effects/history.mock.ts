import { History } from './history'

export const getHistoryMock = (): History => ({
  replaceState: jest.fn(),
})
