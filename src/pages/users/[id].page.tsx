import { InferGetServerSidePropsType } from "next"
import React from "react"
import "node_modules/prismjs/themes/prism-tomorrow.css"
import Head from "next/head"
import { Typography, Stack } from "@mui/material"
import { NextLink } from "@/components/NextLink"
import { z } from "zod"
import { mw3 } from "@/rest/middleware"
import { withToken, zquery } from "@/rest/middleware/page"
import { db } from "@/prisma/client"
import { getLanguageStatColors } from "./user-stats"
import { refreshUserStats } from "@/prisma/refresh-stats-view"
import { LanguageColors } from "./LanguageColors"

export const getServerSideProps = mw3(
  zquery(
    z.object({
      id: z.string(),
      page: z.coerce.number().int().min(1).default(1),
    })
  ),
  withToken,
  async (_, { query, token }) => {
    const { id, page } = query

    // TODO: capture with sentry
    await refreshUserStats().catch(console.error)

    const user = await db.user.findFirst({
      where: { id },
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
          skip: (page - 1) * 10,
          where: {
            OR: [{ public: true }, { authorId: token?.sub }],
          },
        },
      },
    })

    if (!user) {
      return {
        notFound: true,
      }
    }

    const colors = getLanguageStatColors(user.stats)

    return {
      props: {
        user,
        colors,
        page,
      },
    }
  }
)

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function UserById({ user, colors, page }: Props) {
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
          <LanguageColors colors={colors} />
        </Stack>
        <Stack gap={2} component="section">
          <Typography variant="h5" component="h3">
            Activity
          </Typography>
          <Stack gap={1} component="ol">
            {user.pastes.map(p => (
              <Stack component="li" key={p.id}>
                <NextLink href={`/pastes/${p.id}`}>
                  {user.name} / {p.description || p.id}
                </NextLink>
                <pre style={{ whiteSpace: `pre-wrap` }}>
                  <code>
                    {p.files[0].content
                      .slice(0, 300)
                      .split(`\n`, 4)
                      .join(`\n`) + `\n...`}
                  </code>
                </pre>
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Stack direction="row" gap={1} justifyContent="center">
          {page > 1 ? (
            <NextLink
              color="inherit"
              href={`/users/${user.id}?page=${page - 1}`}
            >
              Newer
            </NextLink>
          ) : (
            <Typography sx={{ opacity: 0.8 }}>Newer</Typography>
          )}
          {user.pastes.length >= 10 ? (
            <NextLink
              color="inherit"
              href={`/users/${user.id}?page=${page + 1}`}
            >
              Older
            </NextLink>
          ) : (
            <Typography sx={{ opacity: 0.8 }}>Older</Typography>
          )}
        </Stack>
      </Stack>
    </>
  )
}
