import { db } from "@/prisma/client"
import { restHandler } from "@/rest/http-methods"
import { NextApiHandler } from "next"

const getMostRecent = () =>
  db.paste.findMany({
    orderBy: {
      createdAt: `desc`,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    take: 12,
    where: {
      public: true,
    },
  })

type Awaited<T> = T extends Promise<infer V> ? Awaited<V> : T
type MostRecent = Awaited<ReturnType<typeof getMostRecent>>

let cache: MostRecent
let lastRefresh = Date.now()
const STALE_THRESHOLD = 5_000 // ms

const GET: NextApiHandler<MostRecent> = async (_, res) => {
  if (!cache || Date.now() - lastRefresh > STALE_THRESHOLD) {
    lastRefresh = Date.now()
    cache = await getMostRecent()
    res.setHeader(`X-Cache-Hit`, `false`)
  } else {
    res.setHeader(`X-Cache-Hit`, `true`)
  }

  return res.json(cache)
}

export default restHandler({ GET })
