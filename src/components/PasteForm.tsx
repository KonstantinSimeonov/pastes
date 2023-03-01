import * as React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { MAX_FILES_PER_PASTE, post } from "@/pages/api/pastes/schemas"
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { z } from "zod"

type Create = z.infer<typeof post>

type PasteFormProps<Schema extends typeof post> = {
  defaultValues?: z.infer<Schema>
  schema: Schema
  onSubmit: (data: z.infer<Schema>) => Promise<unknown>
  submitText?: string
  children?: React.ReactNode
}

export const PasteForm = <Schema extends typeof post>({
  children,
  submitText = `Create`,
  schema,
  defaultValues,
  onSubmit,
}: PasteFormProps<Schema>) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<Create>({
    defaultValues: defaultValues || {
      description: ``,
      public: true,
      files: [{ name: ``, content: `` }],
    },
    mode: `onChange`,
    resolver: zodResolver(schema),
  })

  const fa = useFieldArray({ control, name: `files` as const })

  const session = useSession()

  const tooManyFiles = fa.fields.length >= MAX_FILES_PER_PASTE

  const hasErrors = Object.keys(errors).length > 0

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={5}>
        <Stack direction="row" gap={2}>
          <TextField
            {...register("description")}
            label="Description"
            variant="filled"
            fullWidth
          />
          <Tooltip
            title={
              <Typography>
                {session.data?.user
                  ? `If you uncheck this, only you will be able to see this paste`
                  : `You can create private pastes after you log in`}
              </Typography>
            }
          >
            <FormControlLabel
              control={
                <Checkbox
                  disabled={!session.data?.user}
                  defaultChecked={true}
                  {...register("public")}
                />
              }
              label="Public"
            />
          </Tooltip>
        </Stack>
        <Stack gap={3}>
          {fa.fields.map((_, i) => (
            <Stack gap={1} key={i}>
              <Stack direction="row" gap={1} alignItems="center">
                <TextField
                  variant="filled"
                  label="File name"
                  fullWidth
                  error={Boolean(errors.files?.[i]?.name)}
                  helperText={errors.files?.[i]?.name?.message}
                  {...register(`files.${i}.name`)}
                />
                {fa.fields.length > 1 ? (
                  <Tooltip title={<Typography>Delete this file</Typography>}>
                    <IconButton
                      color="primary"
                      aria-label="delete file"
                      onClick={() => fa.remove(i)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </Stack>
              <TextField
                label="Content"
                variant="filled"
                error={Boolean(errors.files?.[i]?.content)}
                helperText={errors.files?.[i]?.content?.message}
                multiline
                fullWidth
                rows={15}
                {...register(`files.${i}.content`)}
              />
            </Stack>
          ))}
        </Stack>
        <Stack direction="row" gap={2}>
          <Button
            size="small"
            variant="contained"
            type="submit"
            disabled={hasErrors || !isDirty}
          >
            {submitText}
          </Button>
          <Button
            variant="outlined"
            disabled={tooManyFiles}
            onClick={() => fa.append({ name: ``, content: `` })}
          >
            {tooManyFiles
              ? `Cannot add more than ${MAX_FILES_PER_PASTE} files`
              : `Add file`}
          </Button>
          {children}
        </Stack>
      </Stack>
    </form>
  )
}
