import Head from "next/head"
import { useRouter } from "next/router"
import * as React from "react"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { post, PostResp } from "@/pages/api/pastes"

import { PasteForm } from "@/components/PasteForm"
import { z } from "zod"

type Create = z.infer<typeof post>

export default function Create() {
  const r = useRouter()

  const createPaste = useMutation(
    (p: Create) => axios.post<PostResp>(`/api/pastes`, p),
    {
      onSuccess: ({ data }) => r.push(`/pastes/${data.id}`),
    }
  )

  return (
    <>
      <Head>
        <title>New Paste</title>
      </Head>
      <PasteForm
        schema={post}
        onSubmit={paste => createPaste.mutateAsync(paste)}
      />
    </>
  )
}
