import memoize from 'fast-memoize'
import { err, ok } from 'libs/result'
import { APIClient, ListPhotoResponse, ListTagResponse } from './apiClient'

export const getAPIClientMock = (): APIClient => ({
  listTags: jest.fn(),
  createTag: jest.fn(),
  deleteTag: jest.fn(),
  listPhotos: jest.fn(),
})

export const getAPIClientInMemory = memoize((): APIClient => {
  let latestId = 0
  const tags: ListTagResponse[] = [
    { id: ++latestId, name: 'History' },
    { id: ++latestId, name: 'Science' },
    { id: ++latestId, name: 'Gaming' },
    { id: ++latestId, name: 'Phones' },
  ]

  const photos: ListPhotoResponse[] = [
    {
      albumId: 1,
      id: 1,
      title: 'accusamus beatae ad facilis cum similique qui sunt',
      url: 'https://via.placeholder.com/600/92c952',
      thumbnailUrl: 'https://via.placeholder.com/150/92c952',
    },
    {
      albumId: 1,
      id: 2,
      title: 'reprehenderit est deserunt velit ipsam',
      url: 'https://via.placeholder.com/600/771796',
      thumbnailUrl: 'https://via.placeholder.com/150/771796',
    },
    {
      albumId: 1,
      id: 3,
      title: 'officia porro iure quia iusto qui ipsa ut modi',
      url: 'https://via.placeholder.com/600/24f355',
      thumbnailUrl: 'https://via.placeholder.com/150/24f355',
    },
    {
      albumId: 1,
      id: 4,
      title: 'culpa odio esse rerum omnis laboriosam voluptate repudiandae',
      url: 'https://via.placeholder.com/600/d32776',
      thumbnailUrl: 'https://via.placeholder.com/150/d32776',
    },
    {
      albumId: 1,
      id: 5,
      title: 'natus nisi omnis corporis facere molestiae rerum in',
      url: 'https://via.placeholder.com/600/f66b97',
      thumbnailUrl: 'https://via.placeholder.com/150/f66b97',
    },
  ]
  return {
    listTags: ({ keyword }) => {
      return Promise.resolve(
        ok(
          keyword
            ? tags.filter((tag) =>
                tag.name.toLowerCase().includes(keyword.toLowerCase()),
              )
            : tags,
        ),
      )
    },
    createTag: ({ name }) => {
      tags.push({ id: ++latestId, name })
      return Promise.resolve(ok(undefined))
    },
    deleteTag: ({ id }) => {
      const index = tags.findIndex((tag) => tag.id === id)
      if (index < 0)
        return Promise.resolve(
          err(Error(`Specified tag not found with id: ${id}`)),
        )
      tags.splice(index, 1)
      return Promise.resolve(ok(undefined))
    },

    listPhotos: () => {
      return Promise.resolve(ok(photos))
    },
  }
})
