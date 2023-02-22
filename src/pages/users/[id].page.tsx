import { GetStaticPropsContext, InferGetServerSidePropsType } from "next"
import React from "react"
import "node_modules/prismjs/themes/prism-tomorrow.css"
import Head from "next/head"
import { withClient } from "@/prisma/with-client"
import LC from "language-colors"
import { EXT_MAP } from "../pastes/extension-map"
import { Box, Tooltip, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { NextLink } from "@/components/NextLink"

export const getServerSideProps = async (ctx: GetStaticPropsContext) => {
  const user = await withClient(client =>
    client.user.findFirst({
      where: {
        id: String(ctx.params?.id),
      },
      include: {
        stats: true,
        pastes: {
          select: {
            id: true,
            description: true,
            files: {
              take: 1,
              select: {
                name: true,
                content: true,
              },
            },
          },
          orderBy: {
            createdAt: `desc`,
          },
          take: 10,
        },
      },
    })
  )

  if (!user) {
    return {
      notFound: true,
    }
  }

  const langEntries = Object.entries(user.stats?.langs || {}) as [
    string,
    number
  ][]

  const colors = langEntries
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([ext, count]) => {
      const name = (EXT_MAP[ext] || ``).toLowerCase()
      const { color = null } = LC[name] || LC[ext] || {}
      return { name, color, count }
    })

  return {
    props: {
      user,
      colors,
    },
  }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function UserById({ user, colors }: Props) {
  const total = colors.reduce((total, { count }) => total + count, 0)
  return (
    <>
      <Head>
        <title>{user.name}</title>
      </Head>
      <Stack gap={4}>
        <Stack gap={1}>
          <Typography variant="h4" component="h1">
            {user.name} ({user.stats?.totalPastesCount} pastes)
          </Typography>
          <Stack
            direction="row"
            gap={0}
            sx={{ width: `20rem`, height: `1rem` }}
          >
            {colors.map(({ color, count, name }) => (
              <Tooltip
                title={
                  <Typography>
                    {name} {((count / total) * 100) | 0}%
                  </Typography>
                }
                key={`${color?.join()}-${name}`}
              >
                <div
                  style={{
                    width: `${(count / total) * 100}%`,
                    backgroundColor: `rgb(${color?.join()})`,
                  }}
                />
              </Tooltip>
            ))}
          </Stack>
        </Stack>
        <Stack gap={2} component="section">
          <Typography variant="h5" component="h3">
            Activity
          </Typography>
          <Stack gap={1} component="ol">
            {user.pastes.map(p => (
              <Stack component="li" key={p.id}>
                <NextLink href={`/pastes/${p.id}`}>
                  {user.name} / {p.description}
                </NextLink>
                <Box>
                  <pre>
                    <code>
                      {p.files[0].content.split(`\n`, 4).join(`\n`) + `\n...`}
                    </code>
                  </pre>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </>
  )
}
