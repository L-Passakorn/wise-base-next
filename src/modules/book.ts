import { z } from 'zod'

export const AuthorScheme = z.object({
    name: z.string(),
    age: z.number(),
    retired: z.boolean(),

});

export type Author = z.infer<typeof AuthorScheme>

export const BookScheme = z.object({
    id: z.number(),
    title: z.string(),
    thumbnailUrl: z.string(),
    numberPage: z.number(),
    detail: z.string(),
    category: z.string().array(),
    author: AuthorScheme,
});

export type Book = z.infer<typeof BookScheme>

export const bookFormSchema = z.object({
    title: z.string(),
    thumbnailUrl: z.string(),
    numberPage: z.number(),
    detail: z.string(),
    category: z.string().array(),
    author: z.object({
      name: z.string(),
      age: z.number(),
      retired: z.boolean(),
    }),
  })
  
export type BookForm = z.infer<typeof bookFormSchema>

export const bookQueryScheme = z.object({
    bookId: z.number(),
});

export type BookQuery = z.infer<typeof bookQueryScheme>
