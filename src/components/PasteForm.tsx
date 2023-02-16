import * as React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import * as apiSchemas from "@/pages/api/pastes"
import { InferSchemas } from "@/rest/validated"
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
import styled from "@emotion/styled"
import DeleteIcon from "@mui/icons-material/Delete"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"

type Create = InferSchemas<typeof apiSchemas>[`post`]

const TF = styled(TextField)({
  "& .MuiFilledInput-root": {
    backgroundColor: `#2b2b2b`,
  },
})

export const PasteForm: React.FC<{
  defaultValues?: Create
  onSubmit: (data: Create) => Promise<unknown>
}> = ({ defaultValues, onSubmit }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Create>({
    defaultValues: defaultValues || {
      description: ``,
      files: [{ name: ``, content: `` }],
    },
    mode: `onChange`,
    resolver: zodResolver(apiSchemas.post),
  })

  const fa = useFieldArray({ control, name: `files` as const })

  const session = useSession()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack gap={5}>
        <Stack direction="row" gap={2}>
          <TF
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
                  defaultChecked
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
              <Stack direction="row" gap={1}>
                <TF
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
              <TF
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
          <Button size="small" variant="contained" type="submit">
            Create
          </Button>
          <Button
            variant="outlined"
            onClick={() => fa.append({ name: ``, content: `` })}
          >
            Add file
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
