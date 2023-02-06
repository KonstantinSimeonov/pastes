import type { NextApiHandler } from "next"

type HttpMethod = `GET` | `POST` | `PUT` | `DELETE` | `PATCH`

type Handlers<T> = Partial<Record<HttpMethod, NextApiHandler<T>>>

export const restHandler =
  <T, H extends Handlers<T>>(handlers: H): NextApiHandler<T> =>
  (req, res) => {
    if (req.method && req.method in handlers) {
      const handler = handlers[req.method as HttpMethod]
      if (handler) {
        return handler(req, res)
      }
    }

    return res
      .setHeader(`Allow`, Object.keys(handlers).join())
      .status(405)
      .end()
  }
