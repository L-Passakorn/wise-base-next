import z from 'zod'

export const envScheme = z.object({
  WEB_BASE_URL: z.string(),
  SERVICE_BASE_URL: z.string(),
  NEXTAUTH_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
})

export type Env = z.infer<typeof envScheme>
