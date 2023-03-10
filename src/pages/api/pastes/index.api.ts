import * as uuid from "uuid"
import { restHandler } from "@/rest/http-methods"
import { withClient } from "@/prisma/with-client"
import { withToken, zbody, zquery } from "@/rest/validated"
import * as schemas from "./schemas"
import { mw3 } from "@/rest/middleware"
import { NextApiResponse } from "next"

const POST = mw3(
  zbody(schemas.post),
  withToken,
  async (_, res, { body, token }) => {
    const { files, ...rest } = body

    const paste = await withClient(client =>
      client.paste.create({
        data: {
          ...rest,
          id: uuid.v4(),
          authorId: token?.sub,
          files: {
            create: files.map(f => ({ ...f, id: uuid.v4() })),
          },
        },
      })
    )

    return res
      .setHeader(`Link`, `</pastes/${paste.id}>; rel=prefetch`)
      .status(201)
      .json(paste)
  }
)

const GET = mw3(
  zquery(schemas.get),
  async (_, res: NextApiResponse<schemas.GetResp>, { query }) => {
    const { sort, page, pageSize, authorId } = query
    const pastes = await withClient(client =>
      client.paste.findMany({
        orderBy: {
          [sort]: `desc`,
        },
        skip: pageSize * (page - 1),
        take: pageSize,
        include: {
          author: {
            select: {
              name: true,
              image: true,
            },
          },
          files: true,
        },
        where: {
          public: true,
          ...(authorId ? { authorId } : null),
        },
      })
    )

    res.json(pastes)
  }
)

export default restHandler({ POST, GET })
