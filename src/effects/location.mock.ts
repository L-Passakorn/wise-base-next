import { Location } from './location'

export const getLocationMock = (): Location => ({
  getPathname: jest.fn(),
  getSearch: jest.fn(),
})
