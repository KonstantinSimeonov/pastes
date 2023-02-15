import Head from "next/head"
import { useRouter } from "next/router"
import * as React from "react"
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import * as apiSchemas from "@/pages/api/pastes"
import { InferSchemas } from "@/rest/validated"
import ReactSelect from "react-select"
import { $TODO } from "@/types/todo"

type Create = InferSchemas<typeof apiSchemas>[`post`]

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
    (p: Create) => {
      return axios.post<apiSchemas.PostResp>(`/api/pastes`, p)
    },
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
        <fieldset>
          <label>Title</label>
          <input type="text" {...register("description", { maxLength: 30 })} />
        </fieldset>
        {fa.fields.map((file, i) => (
          <fieldset key={i}>
            <div>
              <label>Title</label>
              <input
                type="text"
                {...register(`files.${i}.name`, { maxLength: 30 })}
              />
            </div>
            <label>Content</label>
            <textarea
              rows={30}
              {...register(`files.${i}.content`, {
                required: true,
                maxLength: 8192,
              })}
            />
          </fieldset>
        ))}
        <button
          type="button"
          onClick={() => fa.append({ name: ``, content: `` })}
        >
          Add file
        </button>
        <input type="submit" />
      </form>
    </>
  )
}
