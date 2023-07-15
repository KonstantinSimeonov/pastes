import React from "react"
import { useQuery } from "@tanstack/react-query"
import * as apiSchemas from "@/pages/api/pastes/schemas"
import { NextLink } from "./NextLink"
import {
  Avatar,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material"
import SourceIcon from "@mui/icons-material/Source"
import { formatDistance } from "date-fns"
import { Stack } from "@mui/system"
import ky from "ky"

export const MostRecent: React.FC = () => {
  const pastes = useQuery(
    [`recent-pastes`],
    () => ky.get(`/api/feed/most-recent`).json<apiSchemas.GetResp>(),
    { refetchInterval: 10_000, refetchOnWindowFocus: false }
  )

  if (!pastes.data) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: `100%` }}
      >
        <CircularProgress />
      </Stack>
    )
  }

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
              <Stack component="span">
                <time>
                  {formatDistance(new Date(p.createdAt), new Date())} ago
                </time>

                <>
                  <span>
                    {`by `}
                    {p.author?.name ? (
                      <NextLink href={`/users/${p.authorId}`}>
                        {p.author?.name}
                      </NextLink>
                    ) : (
                      `anonymous user`
                    )}
                  </span>
                </>
              </Stack>
            }
          />
        </ListItem>
      ))}
    </List>
  )
}
