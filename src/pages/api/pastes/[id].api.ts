import { withClient } from "@/prisma/with-client"
import { restHandler } from "@/rest/http-methods"
import { mw3 } from "@/rest/middleware"
import { authenticated, zbody } from "@/rest/validated"
import { put } from "./schemas"

const PUT = mw3(zbody(put), authenticated, async (_, res, { body, token }) => {
  const { files, id, ...updates } = body

  const { count } = await withClient(({ paste }) =>
    paste.updateMany({
      where: {
        id,
        authorId: token.sub,
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
