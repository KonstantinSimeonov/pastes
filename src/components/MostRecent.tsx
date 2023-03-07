import React from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import * as apiSchemas from "@/pages/api/pastes/schemas"
import { NextLink } from "./NextLink"
import { z } from "zod"
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material"
import SourceIcon from "@mui/icons-material/Source"
import { formatDistance } from "date-fns"
import { Stack } from "@mui/system"

const DEFAULT_PARAMS: z.infer<typeof apiSchemas.get> = {
  page: 1,
  pageSize: 12,
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
    { initialData: [], refetchInterval: 10_000, refetchOnWindowFocus: false }
  )

  return (
    <List>
      {pastes.data.map(p => (
        <ListItem key={p.id}>
          <ListItemAvatar>
            <Avatar>
              {p.author?.image ? (
                <Avatar
                  alt={p.author.name || `pic of author`}
                  src={p.author.image}
                />
              ) : (
                <SourceIcon />
              )}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <NextLink
                sx={{
                  display: `inline-block`,
                  maxWidth: `24ch`,
                  textOverflow: `ellipsis`,
                  overflow: `hidden`,
                  whiteSpace: `nowrap`,
                }}
                href={`/pastes/${p.id}`}
              >
                {p.description || `Untitled`}
              </NextLink>
            }
            secondary={
              <Stack gap={0}>
                <time>
                  {formatDistance(new Date(p.createdAt), new Date())} ago
                </time>
                {p.author?.name ? (
                  <>
                    <span>
                      {`by `}
                      <NextLink href={`/users/${p.authorId}`}>
                        {p.author?.name}
                      </NextLink>
                    </span>
                  </>
                ) : null}
              </Stack>
            }
          />
        </ListItem>
      ))}
    </List>
  )
}
