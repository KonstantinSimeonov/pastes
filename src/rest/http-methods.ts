import type { NextApiHandler } from "next"

type HttpMethod = `GET` | `POST` | `PUT` | `DELETE` | `PATCH`

type Handlers<T> = Partial<Record<HttpMethod, NextApiHandler<T>>>

export const restHandler =
  <T, H extends Handlers<T>>(
    handlers: H
  ): NextApiHandler<T | { error: string }> =>
  async (req, res) => {
    if (req.method && req.method in handlers) {
      const handler = handlers[req.method as HttpMethod]
      if (handler) {
        try {
          return await handler(req, res)
        } catch (error) {
          console.error(error)
          return res.status(500).json({ error: `Internal Server Error` })
        }
      }
    }

    return res
      .setHeader(`Allow`, Object.keys(handlers).join())
      .status(405)
      .end()
  }
