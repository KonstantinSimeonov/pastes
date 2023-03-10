import type { NextApiResponse, NextApiRequest } from "next"
import { getToken } from "next-auth/jwt"
import { z } from "zod"

export const zquery =
  <S extends z.ZodSchema>(schema: S) =>
  <T extends object>(req: NextApiRequest, res: NextApiResponse, args: T) => {
    const result = schema.safeParse(req.query)
    if (result.success)
      return [req, res, { ...args, query: result.data as z.infer<S> }] as const

    res.status(400).json({ error: `Bad Request` })
  }

export const zbody =
  <S extends z.ZodSchema>(schema: S) =>
  <T extends object>(req: NextApiRequest, res: NextApiResponse, args: T) => {
    const result = schema.safeParse(req.body)
    if (result.success)
      return [req, res, { ...args, body: result.data as z.infer<S> }] as const

    res.status(400).json({ error: `Bad Request` })
  }

export const withToken = async <T extends object>(
  req: NextApiRequest,
  res: NextApiResponse,
  args: T
) => [req, res, { ...args, token: await getToken({ req }) }] as const

export const authenticated = async <T extends object>(
  req: NextApiRequest,
  res: NextApiResponse,
  args: T
) => {
  const token = await getToken({ req })
  if (token) return [req, res, { ...args, token }] as const

  res.status(401).json({ error: `Unauthorized` })
}
