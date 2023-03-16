import { db } from "@/prisma/client"
import { restHandler } from "@/rest/http-methods"
import { mw3 } from "@/rest/middleware"
import { authenticated, zbody, zquery } from "@/rest/middleware/api"
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

    const prefs = await db.userPrefs.update({
      where: {
        userId: uid,
      },
      data: body,
    })

    if (!prefs) {
      return res.status(404).json({ error: `Not Found` })
    }

    return res.status(200).json(prefs)
  }
)

export default restHandler({ PUT })
