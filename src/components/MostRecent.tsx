import Link from "next/link"
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { $TODO } from "@/types/todo"
import axios from "axios"

export const MostRecent: React.FC = () => {
  const pastes = useQuery(
    [`recent-pastes`],
    () =>
      axios
        .get(`/api/pastes`, {
          params: {
            page: 1,
            pageSize: 5,
            sort: `createdAt`,
          },
        })
        .then(r => r.data),
    { initialData: [] }
  )

  return (
    <div>
      <h2>Recent pastes</h2>
      <ol>
        {pastes.data.map((p: $TODO) => (
          <li key={p.id}>
            <Link href={`/pastes/${p.id}`}>{p.title || p.language}</Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
