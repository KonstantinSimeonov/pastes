import { withClient } from "@/prisma/with-client"
import { restHandler } from "@/rest/http-methods"
import { validatedBody } from "@/rest/validated"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth].api"
import { put } from "./schemas"

const PUT = validatedBody(put)(async (req, res) => {
  const session = await getServerSession(req, res, authOptions)

  if (!session?.user) {
    return res.status(401).json({ error: `Unauthorized` })
  }

  const { files, id, ...updates } = req.validBody

  const { count } = await withClient(({ paste }) =>
    paste.updateMany({
      where: {
        id,
        authorId: session.user.id,
      },
      data: updates,
    })
  )

  if (count <= 0) {
    return res.status(404).json({ error: `Not found` })
  }

  const fileUpdates = files.filter(f => f.id)
  const newFiles = files.filter(f => !f.id)

  await withClient(async ({ file }) =>
    Promise.all(
      fileUpdates.map(({ id = ``, ...data }) =>
        file.update({
          where: {
            id,
          },
          data,
        })
      )
    )
  )

  await withClient(async ({ file }) =>
    file.deleteMany({
      where: {
        id: {
          notIn: fileUpdates.map(f => f.id) as string[],
        },
        pasteId: id,
      },
    })
  )

  await withClient(({ file }) =>
    file.createMany({
      data: newFiles.map(f => ({
        pasteId: id,
        ...f,
      })),
    })
  )

  res.status(200).json({})
})

export default restHandler({ PUT })
