import Head from "next/head"
import { useRouter } from "next/router"
import * as React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import * as apiSchemas from "@/pages/api/pastes"
import { InferSchemas } from "@/rest/validated"
import { Button, IconButton, Stack, TextField } from "@mui/material"
import styled from "@emotion/styled"
import DeleteIcon from "@mui/icons-material/Delete"

type Create = InferSchemas<typeof apiSchemas>[`post`]

const TF = styled(TextField)({
  "& .MuiFilledInput-root": {
    backgroundColor: `#2b2b2b`,
  },
})

export default function Create() {
  const r = useRouter()

  const { register, handleSubmit, control } = useForm<Create>({
    defaultValues: {
      description: ``,
      files: [{ name: ``, content: `` }],
    },
  })
  const fa = useFieldArray({ control, name: `files` as const })

  const createPaste = useMutation(
    (p: Create) => axios.post<apiSchemas.PostResp>(`/api/pastes`, p),
    {
      onSuccess: ({ data }) => r.push(`/pastes/${data.id}`),
    }
  )

  return (
    <>
      <Head>
        <title>New Paste</title>
      </Head>
      <form onSubmit={handleSubmit(d => createPaste.mutateAsync(d))}>
        <Stack gap={5}>
          <TF
            {...register("description", { maxLength: 30 })}
            label="Description (optional)"
            variant="filled"
            fullWidth
          />
          <Stack gap={3}>
            {fa.fields.map((_, i) => (
              <Stack gap={1} key={i}>
                <Stack direction="row" gap={1}>
                  <TF
                    variant="filled"
                    label="File name (required)"
                    fullWidth
                    {...register(`files.${i}.name`, {
                      required: true,
                      maxLength: 30,
                    })}
                  />
                  {fa.fields.length > 1 ? (
                    <IconButton
                      color="primary"
                      aria-label="delete file"
                      onClick={() => fa.remove(i)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : null}
                </Stack>
                <TF
                  label="Content (required)"
                  variant="filled"
                  multiline
                  fullWidth
                  rows={15}
                  {...register(`files.${i}.content`, {
                    required: true,
                    maxLength: 8192,
                  })}
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
    </>
  )
}
