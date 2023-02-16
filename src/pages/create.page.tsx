import Head from "next/head"
import { useRouter } from "next/router"
import * as React from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import * as apiSchemas from "@/pages/api/pastes"
import { InferSchemas } from "@/rest/validated"

import { PasteForm } from "@/components/PasteForm"

type Create = InferSchemas<typeof apiSchemas>[`post`]

export default function Create() {
  const r = useRouter()

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
      <PasteForm onSubmit={paste => createPaste.mutateAsync(paste)} />
    </>
  )
}
