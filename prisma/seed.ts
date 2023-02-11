import { withClient } from "@/prisma/with-client"
import * as fs from "fs"
import * as path from "path"
import { v4 } from "uuid"

const seed = async () => {
  const pastes = fs
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
      const extension = fileName.split(`.`).pop() || `plain`
      const languageMap: Partial<Record<string, string>> = {
        js: `javascript`,
        ts: `typescript`,
        yml: `yaml`,
        md: `markdown`,
        plain: `plain`,
      }

      const language = languageMap[extension] || extension

      return {
        content,
        title: fileName,
        language,
        id: v4(),
      }
    })

  return withClient(client =>
    client.paste.createMany({
      data: pastes,
    })
  )
}

seed()
