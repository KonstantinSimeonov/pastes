import { withClient } from "@/prisma/with-client"
import { restHandler } from "@/rest/http-methods"
import { mw3 } from "@/rest/middleware"
import { authenticated, zbody, zquery } from "@/rest/validated"
import { z } from "zod"

const PUT = mw3(
  zbody(
    z.object({
      prismTheme: z.string(),
    })
  ),
  zquery(z.object({ id: z.string() })),
  authenticated,
  async (req, res, { body, query, token }) => {
    const uid = query.id

    if (token.sub !== req.query.id) {
      return res.status(403).json({ error: `Forbidden` })
    }

    const prefs = await withClient(({ userPrefs }) =>
      userPrefs.update({
        where: {
          userId: uid,
        },
        data: body,
      })
    )

    if (!prefs) {
      return res.status(404).json({ error: `Not Found` })
    }

    return res.status(200).json(prefs)
  }
)

export default restHandler({ PUT })
