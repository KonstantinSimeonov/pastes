import * as React from "react"
import { useCopy } from "@/hooks/use-copy"
import { Button, Chip, Tooltip, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import EditIcon from "@mui/icons-material/Edit"
import { useSession } from "next-auth/react"
import { useToast } from "@/components/Snackbar"
import LockIcon from "@mui/icons-material/Lock"
import { PrismThemeSelect } from "@/components/PrismTheme"
import { useDownloadFile } from "@/hooks/use-download-file"
import { PasteProps } from "./[id].page"

export const PasteView: React.FC<{ paste: PasteProps; onEdit: () => void }> = ({
  paste,
  onEdit,
}) => {
  const { copy, elem } = useCopy()
  const { anchor, download } = useDownloadFile()
  const toast = useToast()
  const session = useSession()

  return (
    <Stack gap={3}>
      <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
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
            <Typography component="h3">{f.name}</Typography>
            <Stack direction="row" gap={2} alignItems="center">
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
