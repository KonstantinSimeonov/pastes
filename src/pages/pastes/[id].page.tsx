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
  Snackbar,
  Tooltip,
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
import { useSession } from "next-auth/react"
import { put } from "../api/pastes/schemas"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { z } from "zod"
import { useRouter } from "next/router"

const ext = (filename: string) => path.extname(filename).slice(1)
const lang = (filename: string) =>
  EXT_MAP[ext(filename)]?.toLowerCase() || `plain`

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const id = z.string().uuid().safeParse(ctx.params?.id)
  if (!id.success) {
    return {
      notFound: true,
    }
  }

  const pasteOrNull = await withClient(client =>
    client.paste.findFirst({
      where: {
        id: id.data,
      },
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
      },
    })
  )

  if (!pasteOrNull) {
    return {
      notFound: true,
    }
  }

  if (!pasteOrNull.public) {
    const session = await getServerSession(ctx.req, ctx.res, authOptions)
    if (pasteOrNull.authorId !== session?.user.id) {
      return {
        notFound: true,
      }
    }
  }

  const filesWithLang = pasteOrNull.files.map(f => ({
    ...f,
    lang: lang(f.name),
  }))

  return {
    props: { ...pasteOrNull, files: filesWithLang },
  }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

const useHighlight = (paste: Props) => {
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

  const session = useSession()

  return (
    <Stack gap={3}>
      <Stack direction="row" gap={2}>
        <Typography variant="h3" component="h1">
          {paste.description || paste.id}
        </Typography>
        {session.data?.user.id === paste.authorId ? (
          <Tooltip title={<Typography>Edit</Typography>}>
            <span style={{ display: `flex` }}>
              <Button size="small" variant="outlined" onClick={onEdit}>
                <EditIcon />
              </Button>
            </span>
          </Tooltip>
        ) : null}
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
            <pre className="line-numbers" style={{ whiteSpace: `pre-wrap` }}>
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
  const router = useRouter()
  const updatePaste = useMutation(
    (x: z.infer<typeof put>) => axios.put(`/api/pastes/${paste.id}`, x),
    {
      onSuccess: () => router.reload(),
    }
  )
  return (
    <PasteForm
      submitText="Save"
      defaultValues={paste}
      schema={put}
      onSubmit={x => updatePaste.mutateAsync(x)}
    >
      <Button variant="outlined" onClick={onCancel}>
        Cancel
      </Button>
    </PasteForm>
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
