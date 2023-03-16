import { db } from "@/prisma/client"
import * as fs from "fs"
import * as path from "path"
import { v4 } from "uuid"

const chunks = <T>(xs: readonly T[], n: number): T[][] =>
  xs.length <= n ? [xs.slice()] : [xs.slice(0, n), ...chunks(xs.slice(n), n)]

const seed = async () => {
  const files = fs
    .readdirSync(process.cwd())
    .map(fileName => ({
      fileName,
      filePath: path.join(process.cwd(), fileName),
    }))
    .filter(({ filePath }) => {
      const stats = fs.lstatSync(filePath)
      return stats.isFile() && stats.size < 8192
    })
    .map(({ fileName, filePath }) => {
      const content = fs.readFileSync(filePath, `utf8`)
      return {
        content,
        name: fileName,
        id: v4(),
      }
    })

  for (const create of chunks(files, 2)) {
    const result = await db.paste.create({
      data: {
        id: v4(),
        files: {
          create,
        },
      },
    })

    console.log(result)
  }
}

seed()
