import { withClient } from "@/prisma/with-client"
import { restHandler } from "@/rest/http-methods"
import { validatedBody } from "@/rest/validated"
import { getToken } from "next-auth/jwt"
import { put } from "./schemas"

const PUT = validatedBody(put)(async (req, res) => {
  const session = await getToken({ req })

  if (!session?.sub) {
    return res.status(401).json({ error: `Unauthorized` })
  }

  const { files, id, ...updates } = req.validBody

  const { count } = await withClient(({ paste }) =>
    paste.updateMany({
      where: {
        id,
        authorId: session.sub,
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
