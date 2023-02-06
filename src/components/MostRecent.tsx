import Link from "next/link";
import React from "react";
import {useQuery} from "react-query";

const params = new URLSearchParams({
  page: `1`,
  pageSize: `5`,
  sort: `createdAt`
}).toString()

export const MostRecent: React.FC = () => {
  const pastes = useQuery(`recent-pastes`, () => fetch(`/api/pastes?${params}`, {
    method: `GET`,
    headers: {
      'Content-Type': `application/json`
    },
  }).then(r => r.json()), { initialData: [] })

  return (
    <div>
      <h2>Recent pastes</h2>
      <ol>
        {pastes.data.map(p => <li key={p.id}>
          <Link href={`/pastes/${p.id}`}>{p.title || p.language}</Link>
          </li>
        )}
      </ol>
  </div>
  )
}
