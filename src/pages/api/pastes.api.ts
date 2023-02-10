import * as uuid from "uuid"
import { restHandler } from "@/rest/http-methods"
import { withClient } from "@/prisma/with-client"
import { validatedBody, validatedQuery } from "@/rest/validated"
import * as schemas from "./pastes"
import {getServerSession} from "next-auth"
import {authOptions} from "./auth/[...nextauth].api"

const POST = validatedBody(schemas.post)<schemas.PostResp>(async (req, res) => {
  const session = await getServerSession(req, res, authOptions);

  const paste = await withClient(client =>
    client.paste.create({
      data: { ...req.validBody, id: uuid.v4(), authorId: session?.user.id },
    })
  )

  return res.status(201).json(paste)
})

const GET = validatedQuery(schemas.get)<schemas.GetResp>(async (req, res) => {
  const { sort, page, pageSize, authorId } = req.validQuery
  console.log({ authorId })
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
            name: true
          }
        }
      },
      ...(authorId ? { where: { authorId } } : null)
    })
  )

  res.json(pastes)
})

export default restHandler({ POST, GET })
