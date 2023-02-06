import Head from "next/head"
import { useRouter } from "next/router"
import * as React from "react"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query"
import Prism from "prismjs"

type Create = {
  title?: string
  language?: string
  content: string
}

export default function Create() {
  const r = useRouter()

  const { register, handleSubmit } = useForm<Create>()

  const createPaste = useMutation(
    (p: Create) =>
      fetch(`/api/pastes`, {
        method: `POST`,
        headers: {
          "Content-Type": `application/json`,
          Accept: `application/json`,
        },
        body: JSON.stringify(p),
      }).then(r => r.json()),
    {
      onSuccess: pr => r.push(`/pastes/${pr.id}`),
    }
  )

  console.log(Prism.languages)

  return (
    <>
      <Head>
        <title>New Paste</title>
      </Head>
      <form onSubmit={handleSubmit(d => createPaste.mutateAsync(d))}>
        <fieldset>
          <label>Title</label>
          <input type="text" {...register("title", { maxLength: 30 })} />
        </fieldset>
        <fieldset>
          <label>Content</label>
          <textarea
            rows={30}
            {...register("content", { required: true, maxLength: 8192 })}
          />
        </fieldset>
        <fieldset>
          <label>Language</label>
          <select {...register("language")}>
            {Object.keys(Prism.languages).map(x => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </fieldset>
        <input type="submit" />
      </form>
    </>
  )
}
