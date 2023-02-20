import { withClient } from "@/prisma/with-client"
import { restHandler } from "@/rest/http-methods"
import { validatedBody } from "@/rest/validated"
import { getToken } from "next-auth/jwt"
import { z } from "zod"

const PUT = validatedBody(
  z.object({
    prismTheme: z.string(),
  })
)(async (req, res) => {
  const token = await getToken({ req })
  const uid = z.string().safeParse(req.query.id)

  if (!uid.success) {
    // TODO: fix validated query
    return res.status(400).json({ error: `Bad Request` })
  }

  if (!token?.sub) {
    return res.status(401).json({ error: `Unathorized` })
  }

  if (token.sub !== req.query.id) {
    return res.status(403).json({ error: `Forbidden` })
  }

  const prefs = await withClient(({ userPrefs }) =>
    userPrefs.update({
      where: {
        userId: uid.data,
      },
      data: req.validBody,
    })
  )

  if (!prefs) {
    return res.status(404).json({ error: `Not Found` })
  }

  return res.status(200).json(prefs)
})

export default restHandler({ PUT })
