import Head from "next/head"
import { useRouter } from "next/router"
import * as React from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import * as apiSchemas from "@/pages/api/pastes"
import { InferSchemas } from "@/rest/validated"
import { $TODO } from "@/types/todo"
import { Button, Stack, TextField } from "@mui/material"
import styled from "@emotion/styled"

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
      <form onSubmit={handleSubmit(d => createPaste.mutateAsync(d as $TODO))}>
        <Stack gap={5}>
          <TF
            {...register("description", { maxLength: 30 })}
            placeholder="Description"
            label="Description"
            variant="filled"
            fullWidth
          />
          <Stack gap={3}>
            {fa.fields.map((_, i) => (
              <Stack gap={1} key={i}>
                <TF
                  variant="filled"
                  label="File name"
                  fullWidth
                  {...register(`files.${i}.name`, { maxLength: 30 })}
                />
                <TF
                  label="content"
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
