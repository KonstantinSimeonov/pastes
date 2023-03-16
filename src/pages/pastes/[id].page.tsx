import { InferGetServerSidePropsType } from "next"
import * as React from "react"
import { useCopy } from "@/hooks/use-copy"
import Prism from "prismjs"
import { Box, Button, Chip, Tooltip, Typography } from "@mui/material"
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
import LockIcon from "@mui/icons-material/Lock"

import "prismjs/plugins/line-numbers/prism-line-numbers"
import "prismjs/plugins/line-numbers/prism-line-numbers.css"
import { PrismThemeProvider, PrismThemeSelect } from "@/components/PrismTheme"
import { $TODO } from "@/types/todo"
import { useDownloadFile } from "@/hooks/use-download-file"
import { mw3 } from "@/rest/middleware"
import { withToken, zquery } from "@/rest/middleware/page"
import { db } from "@/prisma/client"
import { MetaTags } from "./MetaTags"

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

const PasteView: React.FC<{ paste: PasteProps; onEdit: () => void }> = ({
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
        <Stack direction="row" gap={2} alignItems="center">
          <Button
            size="small"
            variant="outlined"
            onClick={e => {
              copy(typeof window !== `undefined` ? window.location.href : ``)(e)
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
            <pre className="line-numbers" style={{ whiteSpace: `pre-wrap` }}>
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

const EditPaste: React.FC<{ paste: PasteProps; onCancel: () => void }> = ({
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
