import { TRPCClient } from './trpcClient'

export const getTRPCClientMock = (): TRPCClient => ({
  ping: { query: jest.fn() },
  webURL: { query: jest.fn() },
  photo: {
    list: { query: jest.fn() },
  },
  tag: {
    list: { query: jest.fn() },
    get: { query: jest.fn() },
    manage: {
      create: { mutate: jest.fn() },
      delete: { mutate: jest.fn() },
    },
  },
})
