import memoize from 'fast-memoize'
import { Result, safe } from 'libs/result'
import {
  APIClient,
  ListPhotoResponse,
  listPhotoResponseScheme,
  ListTagResponse,
  listTagResponseScheme,
} from './apiClient'
import { Book, BookScheme } from 'modules/book'

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
      listBooks: async function (): Promise<
        Result<Book[], Error>
      > {
        return safe(
          fetch(`${baseURL}/api/books`, {
            headers: {
              authorization: 'Bearer',
              'content-type': 'application/json',
            },
            method: 'GET',
          }).then(async (response) => {
            if (!response.ok) throw new Error(await response.text())
            return BookScheme.array().parse(await response.json())
          }),
        )
      },
      findOneBook: async function ({ bookId }): Promise<Result<Book, Error>> {
        return safe(
          fetch(`${baseURL}/api/books/${bookId}`, {
            headers: {
              authorization: 'Bearer',
              'content-type': 'application/json',
            },
            method: 'GET',
          }).then(async (response) => {
            if (!response.ok) throw new Error(await response.text())
            return BookScheme.parse(await response.json())
          }),
        )
      },
      createBook: async function (book): Promise<Result<void, Error>> {
        console.log("apiClient.live.ts")
        return safe(
          fetch(`${baseURL}/api/books`, {
            headers: {
              authorization: 'Bearer',
              'content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(book),
          }).then(async (response): Promise<void> => {
            if (!response.ok) throw new Error(await response.text())
          }),
        )
      },
      updateBook: async function ({ bookId }, updatedBook): Promise<Result<void, Error>> {
        return safe(
          fetch(`${baseURL}/api/books/${String(bookId)}`, {
            headers: {
              authorization: 'Bearer',
              'content-type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(updatedBook),
          }).then(async (response): Promise<void> => {
            if (!response.ok) throw new Error(await response.text())
          }),
        )
      },
      deleteBook: async function ({ bookId }): Promise<Result<void, Error>> {
        return safe(
          fetch(`${baseURL}/api/books/${String(bookId)}`, {
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
    }
  },
)
