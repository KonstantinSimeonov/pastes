import type { NextApiHandler, NextApiResponse, NextApiRequest } from "next"
import { z } from "zod"

export const validatedQuery =
  <S extends z.ZodSchema>(schema: S) =>
  <T>(
    handler: (
      req: NextApiRequest & { validQuery: z.infer<S> },
      res: NextApiResponse<T>
    ) => unknown | Promise<unknown>
  ): NextApiHandler<T | z.ZodError> =>
  (req, res) => {
    const result = schema.safeParse(req.query)
    if (result.success) {
      const _req = Object.assign(req, { validQuery: result.data })
      return handler(_req, res)
    }

    return res.status(400).json(result.error)
  }

export const validatedBody =
  <S extends z.ZodSchema>(schema: S) =>
  <T>(
    handler: (
      req: NextApiRequest & { validBody: z.infer<S> },
      res: NextApiResponse<T>
    ) => unknown | Promise<unknown>
  ): NextApiHandler<T | z.ZodError> =>
  (req, res) => {
    const result = schema.safeParse(req.body)
    if (result.success) {
      const _req = Object.assign(req, { validBody: result.data })
      return handler(_req, res)
    }

    return res.status(400).json(result.error)
  }

export type InferSchemas<T extends Record<string, z.ZodSchema>> = {
  [k in keyof T]: z.infer<T[k]>
}
