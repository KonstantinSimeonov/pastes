import { InferGetServerSidePropsType } from "next"
import React from "react"
import "node_modules/prismjs/themes/prism-tomorrow.css"
import Head from "next/head"
import { withClient } from "@/prisma/with-client"
import LC from "language-colors"
import { EXT_MAP } from "../pastes/extension-map"
import { Box, Tooltip, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import { NextLink } from "@/components/NextLink"
import { z } from "zod"
import { mw3 } from "@/rest/middleware"
import { withToken, zquery } from "@/rest/middleware/page"
import { UserStats } from "@prisma/client"

const normalizeExt = (ext: string) => {
  return (
    {
      jsx: `js`,
      tsx: `ts`,
      mjs: `js`,
      cjs: `js`,
      es6: `js`,
      scala: `sc`,
      mm: `cpp`,
      yml: `yaml`,
      chs: `hs`,
    }[ext] || ext
  )
}

const getLanguageStatColors = (stats: UserStats | null) => {
  const langEntries = Object.entries(stats?.langs || {}) as [string, number][]

  const grouped = langEntries.reduce<Record<string, number>>(
    (map, [ext, count]) => {
      const normalizedExt = normalizeExt(ext)
      map[normalizedExt] = map[normalizedExt] || 0
      map[normalizedExt] += count
      return map
    },
    {}
  )

  const colors = Object.entries(grouped)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([ext, count]) => {
      const name = (EXT_MAP[ext] || `other`).toLowerCase()
      const { color = [127, 127, 127] } = LC[name] || LC[ext] || {}
      return { name, color, count }
    })

  return colors
}

const USER_STATS_REFRESH_TIME = 60 * 5 // 5 min

const refreshUserStats = async (force = false) => {
  const meta = await withClient(client => client.metadata.findFirst())
  if (
    !force &&
    meta &&
    (Date.now() - meta.userStatsUpdatedAt.getTime()) / 1000 <
      USER_STATS_REFRESH_TIME
  )
    return

  console.log(`REFRESHING MATERIALIZED VIEW`)
  await withClient(
    client => client.$executeRaw`REFRESH MATERIALIZED VIEW user_stats`
  )
  await withClient(({ metadata }) => {
    const args = { data: { userStatsUpdatedAt: new Date() } }
    return meta ? metadata.updateMany(args) : metadata.create(args)
  })
}

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

    const user = await withClient(client =>
      client.user.findFirst({
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
    )

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
                  {user.name} / {p.description || p.id}
                </NextLink>
                <Box>
                  <pre style={{ whiteSpace: `pre-wrap` }}>
                    <code>
                      {p.files[0].content
                        .slice(0, 300)
                        .split(`\n`, 4)
                        .join(`\n`) + `\n...`}
                    </code>
                  </pre>
                </Box>
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
