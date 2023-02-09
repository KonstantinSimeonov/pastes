import Link from "next/link"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import * as apiSchemas from "@/pages/api/pastes"
import { InferSchemas } from "@/rest/validated"

const params: InferSchemas<typeof apiSchemas>[`get`] = {
  page: 1,
  pageSize: 5,
  sort: `createdAt`,
}

export const MostRecent: React.FC = () => {
  const pastes = useQuery(
    [`recent-pastes`],
    () =>
      axios
        .get<apiSchemas.GetResp>(`/api/pastes`, { params })
        .then(r => r.data),
    { initialData: [] }
  )

  return (
    <div>
      <h2>Recent pastes</h2>
      <ol>
        {pastes.data.map(p => (
          <li key={p.id}>
            <Link href={`/pastes/${p.id}`}>{p.title || p.language}</Link>
            {p.title && p.language ? <span> ({p.language})</span> : null}
            {p.author ? <> by <Link href={`/users/${p.authorId}`}>{p.author.name}</Link></> : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
