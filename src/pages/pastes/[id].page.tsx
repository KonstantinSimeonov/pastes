import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import React from "react"
import "prismjs/themes/prism-tomorrow.css"
import Head from "next/head"
import { withClient } from "@/prisma/with-client"
import { useCopy } from "@/hooks/use-copy"
import Prism from "prismjs"
import {
  Alert,
  Box,
  Button,
  Container,
  Snackbar,
  Typography,
} from "@mui/material"
import { Stack } from "@mui/system"
import { EXT_MAP } from "./extension-map"
import * as path from "path"
import "prismjs/plugins/line-numbers/prism-line-numbers"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"
import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth].api"
import EditIcon from "@mui/icons-material/Edit"
import { PasteForm } from "@/components/PasteForm"

const fixDates = <T extends {}>(x: T): T => JSON.parse(JSON.stringify(x))

const ext = (filename: string) => path.extname(filename).slice(1)
const lang = (filename: string) =>
  EXT_MAP[ext(filename)]?.toLowerCase() || `plain`

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions)
  const userId = session?.user.id

  const pasteOrNull = await withClient(client =>
    client.paste.findFirst({
      where: {
        id: String(ctx.query.id),
        OR: [{ public: true }, ...(userId ? [{ authorId: userId }] : [])],
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
    const langs = new Set(
      paste.files.map(f => f.lang).filter(l => !Prism.languages[l])
    )
    Promise.all(Array.from(langs, l => import(`@/prism-components/${l}`))).then(
      () => Prism.highlightAll()
    )
  }, [paste.id])
}

const PasteView: React.FC<{ paste: Props; onEdit: () => void }> = ({
  paste,
  onEdit,
}) => {
  const { copy, elem } = useCopy()

  const [toastOpen, setToastOpen] = React.useState(false)
  const [hideToast, showToast] = [false, true].map(v => {
    // eslint-disable-next-line
    return React.useCallback(() => setToastOpen(v), [])
  })

  return (
    <Stack gap={3}>
      <Stack direction="row" gap={2}>
        <Typography variant="h3" component="h1">
          {paste.description || paste.id}
        </Typography>
        <Button size="small" variant="outlined" onClick={onEdit}>
          <EditIcon />
        </Button>
      </Stack>
      <Stack gap={2} component="ul">
        {paste.files.map(f => (
          <Stack key={f.id} component="li" gap={1}>
            <Stack direction="row" gap={2}>
              <Typography variant="h5" component="h3">
                {f.name}
              </Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={e => {
                  copy(f.content)(e)
                  showToast()
                }}
              >
                Copy content
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={e => {
                  copy(
                    typeof window !== `undefined` ? window.location.href : ``
                  )(e)
                  showToast()
                }}
              >
                Copy url
              </Button>
            </Stack>
            <pre className="line-numbers">
              <code className={`language-${f.lang}`}>{f.content}</code>
            </pre>
          </Stack>
        ))}
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: `top`, horizontal: `center` }}
        open={toastOpen}
        autoHideDuration={4000}
        onClose={hideToast}
      >
        <Alert severity="success">Copied</Alert>
      </Snackbar>
      {elem}
    </Stack>
  )
}

const EditPaste: React.FC<{ paste: Props; onCancel: () => void }> = ({
  paste,
  onCancel,
}) => {
  return (
    <PasteForm
      defaultValues={paste}
      onSubmit={async d => {
        console.log(d)
        onCancel()
      }}
    />
  )
}

export default function PasteById(props: Props) {
  useHighlight(props)

  const [mode, setMode] = React.useState<`view` | `edit`>(`view`)

  return (
    <>
      <Head>
        <title>Pastes</title>
      </Head>
      <Box sx={mode === `edit` ? { display: `none` } : {}}>
        <PasteView paste={props} onEdit={() => setMode(`edit`)} />
      </Box>
      {mode === `edit` ? (
        <EditPaste paste={props} onCancel={() => setMode(`view`)} />
      ) : null}
    </>
  )
}
