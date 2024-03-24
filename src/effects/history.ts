export type History = {
  replaceState: (
    data: unknown,
    unused: string,
    url?: string | URL | null,
  ) => void
}
