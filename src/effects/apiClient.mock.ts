import memoize from 'fast-memoize'
import { err, ok } from 'libs/result'
import { APIClient, ListPhotoResponse, ListTagResponse } from './apiClient'
import { Author, Book } from 'modules/book'

export const getAPIClientMock = (): APIClient => ({
  listTags: jest.fn(),
  createTag: jest.fn(),
  deleteTag: jest.fn(),
  listPhotos: jest.fn(),
  listBooks: jest.fn(),
  findOneBook: jest.fn(),
  createBook: jest.fn(),
  updateBook: jest.fn(),
  deleteBook: jest.fn(),
})

export const getAPIClientInMemory = memoize((): APIClient => {
  let latestId = 0
  const tags: ListTagResponse[] = [
    { id: ++latestId, name: 'History' },
    { id: ++latestId, name: 'Science' },
    { id: ++latestId, name: 'Gaming' },
    { id: ++latestId, name: 'Phones' },
  ]

  const authors: Author[] = [
    { name: 'J. K. Rowling', age: 45, retired: false },
    { name: 'Emily Brown', age: 50, retired: true },
    { name: 'Michael Johnson', age: 55, retired: false },
    { name: 'Sophia Lee', age: 40, retired: false },
    { name: 'Daniel Taylor', age: 48, retired: true },
  ];

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
  let latestBookId = 0

  const books: Book[] = [
    {
      id: ++latestBookId,
      title: "Harry Potter and the Philosopher's Stone",
      thumbnailUrl: 'https://bci.kinokuniya.com/th/jsp/images/book-img/97814/97814088/9781408855652.JPG',
      numberPage: 300,
      detail: 'A thrilling adventure novel set in the Amazon rainforest.',
      category: ['Adventure', 'Fiction'],
      author: authors[0],
    },
    {
      id: ++latestBookId,
      title: 'Harry Potter and the Cursed Child',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/en/8/87/Cursed_Child_new_poster.jpg',
      numberPage: 250,
      detail: 'A classic tale of a girl who discovers a magical garden.',
      category: ['Children', 'Fiction'],
      author: authors[0],
    },
    {
      id: ++latestBookId,
      title: 'Kimi no Na wa',
      thumbnailUrl: 'https://m.media-amazon.com/images/I/81WKiK7TK2L._AC_UF1000,1000_QL80_.jpg',
      numberPage: 400,
      detail: 'A non-fiction book about the journey of Christopher McCandless.',
      category: ['Biography', 'Adventure'],
      author: authors[2],
    },
    {
      id: ++latestBookId,
      title: 'Tokyo Ghoul',
      thumbnailUrl: 'https://upload.wikimedia.org/wikipedia/en/e/e5/Tokyo_Ghoul_volume_1_cover.jpg',
      numberPage: 350,
      detail: 'Jane Austen\'s masterpiece novel depicting the societal issues of the 19th century.',
      category: ['Classic', 'Romance'],
      author: authors[3],
    },
    {
      id: ++latestBookId,
      title: 'Attack on Titan',
      thumbnailUrl: 'https://images.justwatch.com/poster/306747132/s718/attack-on-titan.jpg',
      numberPage: 500,
      detail: 'A captivating thriller uncovering mysteries of art and history.',
      category: ['Thriller', 'Mystery'],
      author: authors[4],
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

    listBooks: () => {
      return Promise.resolve(ok(books))
    },
    findOneBook: ({ bookId }) => {
      const book = books.find((book) => book.id === Number(bookId));
      if (!book) {
        return Promise.resolve(err(Error(`Book not found`)));
      }
      return Promise.resolve(ok(book));
    },
    createBook: ( book ) => {
      books.push({ ...book, id: ++latestBookId })
      console.log("apiClient.mock.ts")
      return Promise.resolve(ok(undefined))
    },
    updateBook: ({ bookId }, updatedBook) => {
      const index = books.findIndex((book) => book.id === Number(bookId));
      if (index < 0) {
        return Promise.resolve(
          err(Error(`Specified book not found with id: ${bookId}`))
        );
      }
      books[index] = { ...updatedBook, id: Number(bookId) };
      return Promise.resolve(ok(undefined));
    },
    deleteBook: ({ bookId }) => {
      const index = books.findIndex((book) => book.id === Number(bookId));
      if (index < 0)
        return Promise.resolve(
          err(Error(`Specified book not found with id: ${bookId}`))
        );
      books.splice(index, 1);
      return Promise.resolve(ok(undefined));
    }
  }
})
