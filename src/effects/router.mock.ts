import { Router } from './router'

export const getRouterMock = (): Router => ({
  push: jest.fn(),
})
