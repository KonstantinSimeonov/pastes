import Head from "next/head"
import { useRouter } from "next/router"
import * as React from "react"
import { useMutation } from "@tanstack/react-query"
import ky, { HTTPError } from "ky"
import { post, PostResp } from "@/pages/api/pastes/schemas"

import { PasteForm } from "@/components/PasteForm"
import { z } from "zod"
import { useToast } from "@/components/Snackbar"

type Create = z.infer<typeof post>

export default function Create() {
  const router = useRouter()
  const toast = useToast()

  const createPaste = useMutation(
    (p: Create) => ky.post(`/api/pastes`, { json: p }).json<PostResp>(),
    {
      onSuccess: ({ id }) => {
        toast({
          severity: `success`,
          children: `Paste created, redirecting you in a sec...`,
        })
        router.push(`/pastes/${id}`)
      },
    }
  )

  const onSubmit = React.useCallback(
    (paste: Create) => {
      toast({ severity: `info`, children: `Creating paste...` })
      return createPaste.mutateAsync(paste).catch((error: HTTPError) => {
        console.error(error)
        toast({
          severity: `error`,
          children: `Something went wrong, please retry`,
        })
      })
    },
    [createPaste.mutateAsync]
  )

  return (
    <>
      <Head>
        <title>New Paste</title>
      </Head>
      <PasteForm schema={post} onSubmit={onSubmit} />
    </>
  )
}
