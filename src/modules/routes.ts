export const Route = {
  signIn: '/sign-in',
  dashboard: '/dashboard',
  book: {
    bookList: "/book",
    aboutBook: (bookId: string) => ({
      detail: `/book/${bookId}`,
    })
  }
}