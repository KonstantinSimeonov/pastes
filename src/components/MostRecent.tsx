import Link from "next/link"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import * as apiSchemas from "@/pages/api/pastes"
import { InferSchemas } from "@/rest/validated"
import { NextLink } from "./NextLink"

const DEFAULT_PARAMS: InferSchemas<typeof apiSchemas>[`get`] = {
  page: 1,
  pageSize: 5,
  sort: `createdAt`,
}

export const MostRecent: React.FC<{ authorId?: string }> = ({ authorId }) => {
  const params = { ...DEFAULT_PARAMS, authorId }
  const pastes = useQuery(
    [`recent-pastes`, Object.values(params)],
    () =>
      axios
        .get<apiSchemas.GetResp>(`/api/pastes`, { params })
        .then(r => r.data),
    { initialData: [] }
  )

  return (
    <ol>
      {pastes.data.map(p => (
        <li key={p.id}>
          <NextLink href={`/pastes/${p.id}`}>
            {p.description || `Untitled`}
          </NextLink>
          {p.author ? (
            <>
              {" "}
              by{" "}
              <NextLink href={`/users/${p.authorId}`}>{p.author.name}</NextLink>
            </>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
