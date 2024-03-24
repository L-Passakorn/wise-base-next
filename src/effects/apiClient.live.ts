import memoize from 'fast-memoize'
import { Result, safe } from 'libs/result'
import {
  APIClient,
  ListPhotoResponse,
  listPhotoResponseScheme,
  ListTagResponse,
  listTagResponseScheme,
} from './apiClient'

export const getAPIClientLive: (baseURL: string) => APIClient = memoize(
  (baseURL) => {
    return {
      listTags: async function ({
        keyword,
      }): Promise<Result<ListTagResponse[], Error>> {
        return safe(
          fetch(`${baseURL}/api/tags${keyword ? `?keyword=${keyword}` : ''}`, {
            headers: {
              authorization: 'Bearer',
              'content-type': 'application/json',
            },
            method: 'GET',
          }).then(async (response) => {
            if (!response.ok) throw new Error(await response.text())
            return listTagResponseScheme.array().parse(await response.json())
          }),
        )
      },
      createTag: async function ({ name }): Promise<Result<void, Error>> {
        return safe(
          fetch(`${baseURL}/api/tags`, {
            headers: {
              authorization: 'Bearer',
              'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ name }),
          }).then(async (response): Promise<void> => {
            if (!response.ok) throw new Error(await response.text())
          }),
        )
      },
      deleteTag: async function ({ id }): Promise<Result<void, Error>> {
        return safe(
          fetch(`${baseURL}/api/tags/${String(id)}`, {
            headers: {
              authorization: 'Bearer',
              'content-type': 'application/json',
            },
            method: 'DELETE',
          }).then(async (response): Promise<void> => {
            if (!response.ok) throw new Error(await response.text())
          }),
        )
      },
      listPhotos: async function (): Promise<
        Result<ListPhotoResponse[], Error>
      > {
        return safe(
          fetch(`${baseURL}/api/photos`, {
            headers: {
              authorization: 'Bearer',
              'content-type': 'application/json',
            },
            method: 'GET',
          }).then(async (response) => {
            if (!response.ok) throw new Error(await response.text())
            return listPhotoResponseScheme.array().parse(await response.json())
          }),
        )
      },
    }
  },
)
