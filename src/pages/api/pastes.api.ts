import * as uuid from "uuid"
import { restHandler } from "@/rest/http-methods"
import { withClient } from "@/prisma/with-client"
import { validatedBody, validatedQuery } from "@/rest/validated"
import * as schemas from "./pastes"

const POST = validatedBody(schemas.post)<schemas.PostResp>(async (req, res) => {
  const paste = await withClient(client =>
    client.paste.create({
      data: { ...req.validBody, id: uuid.v4() },
    })
  )

  return res.status(201).json(paste)
})

const GET = validatedQuery(schemas.get)<schemas.GetResp>(async (req, res) => {
  const { sort, page, pageSize } = req.validQuery
  const pastes = await withClient(client =>
    client.paste.findMany({
      orderBy: {
        [sort]: `desc`,
      },
      skip: pageSize * (page - 1),
      take: pageSize,
    })
  )

  res.json(pastes)
})

export default restHandler({ POST, GET })
