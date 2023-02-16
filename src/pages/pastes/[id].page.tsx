import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import React from "react"
import "prismjs/themes/prism-tomorrow.css"
import Head from "next/head"
import { withClient } from "@/prisma/with-client"
import { useCopy } from "@/hooks/use-copy"
import Prism from "prismjs"
import { Button, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { EXT_MAP } from "./extension-map"
import * as path from "path"

const fixDates = <T extends {}>(x: T): T => JSON.parse(JSON.stringify(x))

const ext = (filename: string) => path.extname(filename).slice(1)
const lang = (filename: string) =>
  EXT_MAP[ext(filename)]?.toLowerCase() || `plain`

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const pasteOrNull = await withClient(client =>
    client.paste.findFirst({
      where: {
        id: String(ctx.query.id),
      },
      include: {
        files: true,
      },
    })
  )

  if (!pasteOrNull) {
    return {
      notFound: true,
    }
  }

  const filesWithLang = pasteOrNull.files.map(f => ({
    ...f,
    lang: lang(f.name),
  }))

  return {
    props: fixDates({ ...pasteOrNull, files: filesWithLang }),
  }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const useHighlight = (paste: Props) => {
  console.log(paste)
  React.useEffect(() => {
    const langs = new Set(paste.files.map(p => p.lang))
    Promise.all(
      Array.from(langs, lang => import(`prismjs/components/prism-${lang}`))
    ).then(() => Prism.highlightAll())
  }, [paste.id])
}

export default function PasteById(props: Props) {
  useHighlight(props)
  const { copy, elem } = useCopy()

  return (
    <>
      <Head>
        <title>Pastes</title>
      </Head>
      <Stack gap={3}>
        <Typography variant="h3" component="h1">
          {props.description || props.id}
        </Typography>
        <Stack gap={2} component="ul">
          {props.files.map(f => (
            <Stack key={f.id} component="li" gap={1}>
              <Stack direction="row" gap={2}>
                <Typography variant="h5" component="h3">
                  {f.name}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={copy(f.content)}
                >
                  Copy content
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={copy(
                    typeof window !== `undefined` ? window.location.href : ``
                  )}
                >
                  Copy url
                </Button>
              </Stack>
              <pre>
                <code className={`lang-${f.lang}`}>{f.content}</code>
              </pre>
            </Stack>
          ))}
        </Stack>
        {elem}
      </Stack>
    </>
  )
}
