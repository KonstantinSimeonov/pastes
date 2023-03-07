import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import React from "react"
import Head from "next/head"
import { withClient } from "@/prisma/with-client"
import { useCopy } from "@/hooks/use-copy"
import Prism from "prismjs"
import { Box, Button, Chip, Toolbar, Tooltip, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { EXT_MAP } from "./extension-map"
import * as path from "path"
import EditIcon from "@mui/icons-material/Edit"
import { PasteForm } from "@/components/PasteForm"
import { useSession } from "next-auth/react"
import { put } from "../api/pastes/schemas"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { z } from "zod"
import { useRouter } from "next/router"
import { useToast } from "@/components/Snackbar"
import { getToken } from "next-auth/jwt"
import LockIcon from "@mui/icons-material/Lock"

import "prismjs/plugins/line-numbers/prism-line-numbers"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"
import { PrismThemeProvider, PrismThemeSelect } from "@/components/PrismTheme"
import { $TODO } from "@/types/todo"
import { useDownloadFile } from "@/hooks/use-download-file"

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

  const [pasteOrNull, [token, prefs]] = await Promise.all([
    withClient(client =>
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
    ),
    getToken(ctx).then(token =>
      Promise.all([
        token,
        token?.sub
          ? withClient(client =>
              client.userPrefs.upsert({
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
            )
          : Promise.resolve({ prismTheme: `tomorrow`, uiTheme: `dark` }),
      ])
    ),
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
  const { anchor, download } = useDownloadFile()
  const toast = useToast()
  const session = useSession()

  return (
    <Stack gap={3}>
      <Stack direction="row" gap={2} alignItems="center">
        <Typography variant="h5" component="h1">
          {paste.description || paste.id}
        </Typography>
        <Toolbar>
          <Stack direction="row" gap={2} alignItems="center">
            <Button
              size="small"
              variant="outlined"
              onClick={e => {
                copy(typeof window !== `undefined` ? window.location.href : ``)(
                  e
                )
                toast({ severity: `success`, children: `Copied url` })
              }}
            >
              Copy url
            </Button>
            {session.data?.user?.id === paste.authorId ? (
              <Tooltip title={<Typography>Edit</Typography>}>
                <span style={{ display: `flex` }}>
                  <Button size="small" variant="outlined" onClick={onEdit}>
                    <EditIcon />
                  </Button>
                </span>
              </Tooltip>
            ) : null}
            <PrismThemeSelect />

            <Stack direction="row" alignItems="center">
              {/* TODO: fix the alignment and sizes */}
              {paste.public ? null : (
                <Tooltip
                  title={
                    <Typography>This paste is only visible to you</Typography>
                  }
                >
                  <Chip avatar={<LockIcon />} label="Private" />
                </Tooltip>
              )}
            </Stack>
          </Stack>
        </Toolbar>
      </Stack>
      <Stack gap={2} component="ul">
        {paste.files.map(f => (
          <Stack key={f.id} component="li" gap={1}>
            <Stack direction="row" gap={2} alignItems="center">
              <Typography component="h3">{f.name}</Typography>
              <Button
                size="small"
                variant="outlined"
                onClick={e => {
                  copy(f.content)(e)
                  toast({ severity: `success`, children: `Copied content` })
                }}
              >
                Copy content
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => download(f.content, f.name)}
              >
                Download file
              </Button>
            </Stack>
            <pre
              className="line-numbers"
              style={{ width: `calc(100% - 3em)`, whiteSpace: `pre-wrap` }}
            >
              <code className={`language-${f.lang}`}>{f.content}</code>
            </pre>
          </Stack>
        ))}
      </Stack>
      {anchor}
      {elem}
    </Stack>
  )
}

const EditPaste: React.FC<{ paste: Props; onCancel: () => void }> = ({
  paste,
  onCancel,
}) => {
  const router = useRouter()
  const toast = useToast()
  const updatePaste = useMutation(
    (update: z.infer<typeof put>) =>
      axios.put(`/api/pastes/${paste.id}`, update),
    {
      onSuccess: () => router.reload(),
    }
  )

  const onSubmit = React.useCallback(
    (update: z.infer<typeof put>) => {
      console.log(123)
      toast({ severity: `info`, children: `Updating paste...` })
      return updatePaste.mutateAsync(update).catch(error => {
        console.error(error)
        toast({
          severity: `error`,
          children: `Something went wrong, please retry`,
        })
      })
    },
    [updatePaste.mutateAsync]
  )

  return (
    <PasteForm
      submitText="Save"
      defaultValues={paste}
      schema={put}
      onSubmit={onSubmit}
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
    <PrismThemeProvider theme={props.prefs.prismTheme as $TODO}>
      <Head>
        <title>Pastes</title>
      </Head>
      <Box sx={mode === `edit` ? { display: `none` } : {}}>
        <PasteView paste={props} onEdit={() => setMode(`edit`)} />
      </Box>
      {mode === `edit` ? (
        <EditPaste paste={props} onCancel={() => setMode(`view`)} />
      ) : null}
    </PrismThemeProvider>
  )
}
