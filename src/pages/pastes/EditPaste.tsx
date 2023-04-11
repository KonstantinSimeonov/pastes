import * as React from "react"
import { Button } from "@mui/material"
import { PasteForm } from "@/components/PasteForm"
import { put } from "../api/pastes/schemas"
import { useMutation } from "@tanstack/react-query"
import ky from "ky"
import { z } from "zod"
import { useRouter } from "next/router"
import { useToast } from "@/components/Snackbar"
import { PasteProps } from "./[id].page"

export const EditPaste: React.FC<{
  paste: PasteProps
  onCancel: () => void
}> = ({ paste, onCancel }) => {
  const router = useRouter()
  const toast = useToast()
  const updatePaste = useMutation(
    (update: z.infer<typeof put>) =>
      ky.put(`/api/pastes/${paste.id}`, { json: update }),
    {
      onSuccess: () => router.reload(),
    }
  )

  const onSubmit = React.useCallback(
    (update: z.infer<typeof put>) => {
      toast({ severity: `info`, children: `Updating paste...` })
      return updatePaste.mutateAsync(update).catch(error => {
        console.error(error)
        toast({
          severity: `error`,
          children: `Something went wrong, please retry`,
        })
      })
    },
    [updatePaste.mutateAsync]
  )

  return (
    <PasteForm
      submitText="Save"
      defaultValues={paste}
      schema={put}
      onSubmit={onSubmit}
    >
      <Button variant="outlined" onClick={onCancel}>
        Cancel
      </Button>
    </PasteForm>
  )
}
