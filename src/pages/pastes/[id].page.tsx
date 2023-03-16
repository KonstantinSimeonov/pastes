import { InferGetServerSidePropsType } from "next"
import * as React from "react"
import Prism from "prismjs"
import { Box } from "@mui/material"
import { EXT_MAP } from "./extension-map"
import * as path from "path"
import { z } from "zod"
import { PrismThemeProvider } from "@/components/PrismTheme"
import { $TODO } from "@/types/todo"
import { mw3 } from "@/rest/middleware"
import { withToken, zquery } from "@/rest/middleware/page"
import { db } from "@/prisma/client"
import { MetaTags } from "./MetaTags"
import { EditPaste } from "./EditPaste"
import { PasteView } from "./PasteView"
import "prismjs/plugins/line-numbers/prism-line-numbers"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"

const ext = (filename: string) => path.extname(filename).slice(1)
const lang = (filename: string) =>
  EXT_MAP[ext(filename)]?.toLowerCase() || `plain`

export const getServerSideProps = mw3(
  zquery(z.object({ id: z.string().uuid() })),
  withToken,
  async (_, { query, token }) => {
    const { id } = query
    const [pasteOrNull, prefs] = await Promise.all([
      db.paste.findFirst({
        where: { id },
        select: {
          files: {
            select: {
              name: true,
              content: true,
              id: true,
            },
          },
          id: true,
          description: true,
          public: true,
          authorId: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      }),
      token?.sub
        ? db.userPrefs.upsert({
            where: {
              userId: token.sub,
            },
            update: {},
            create: {
              userId: token.sub as string,
              prismTheme: `tomorrow`,
              uiTheme: `dark`,
            },
          })
        : Promise.resolve({ prismTheme: `tomorrow`, uiTheme: `dark` }),
    ])

    if (
      !pasteOrNull ||
      (!pasteOrNull.public && pasteOrNull.authorId !== token?.sub)
    ) {
      return {
        notFound: true,
      }
    }

    const filesWithLang = pasteOrNull.files.map(f => ({
      ...f,
      lang: lang(f.name),
    }))

    return {
      props: { ...pasteOrNull, files: filesWithLang, prefs },
    }
  }
)

export type PasteProps = InferGetServerSidePropsType<typeof getServerSideProps>

const useHighlight = (languages: readonly string[]) => {
  React.useEffect(() => {
    const langs = new Set(languages.filter(l => !Prism.languages[l]))
    const imports = Array.from(langs, l => import(`@/prism-components/${l}`))
    Promise.all(imports).then(() => Prism.highlightAll())
  }, languages)
}

export default function PasteById(props: PasteProps) {
  const languages = props.files.map(f => f.lang)
  useHighlight(languages)

  const [mode, setMode] = React.useState<`view` | `edit`>(`view`)

  return (
    <>
      <MetaTags paste={props} />
      <PrismThemeProvider theme={props.prefs.prismTheme as $TODO}>
        <Box sx={mode === `edit` ? { display: `none` } : {}}>
          <PasteView paste={props} onEdit={() => setMode(`edit`)} />
        </Box>
        {mode === `edit` ? (
          <EditPaste paste={props} onCancel={() => setMode(`view`)} />
        ) : null}
      </PrismThemeProvider>
    </>
  )
}
