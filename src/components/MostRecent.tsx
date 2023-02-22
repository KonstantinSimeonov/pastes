import React from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import * as apiSchemas from "@/pages/api/pastes/schemas"
import { NextLink } from "./NextLink"
import { z } from "zod"
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import SourceIcon from "@mui/icons-material/Source"
import { useRouter } from "next/router"

const DEFAULT_PARAMS: z.infer<typeof apiSchemas.get> = {
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

  const router = useRouter()

  return (
    <List>
      {pastes.data.map(p => (
        <ListItemButton
          key={p.id}
          onClick={
            /* TODO: i dont like this */ () => router.push(`/pastes/${p.id}`)
          }
        >
          <ListItemAvatar>
            <Avatar>
              <SourceIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <NextLink href={`/pastes/${p.id}`}>
                {p.description || `Untitled`}
              </NextLink>
            }
            secondary={
              p.author ? (
                <>
                  {" "}
                  by{" "}
                  <NextLink href={`/users/${p.authorId}`}>
                    {p.author.name}
                  </NextLink>
                </>
              ) : (
                `by anonymous`
              )
            }
          />
        </ListItemButton>
      ))}
    </List>
  )
}
