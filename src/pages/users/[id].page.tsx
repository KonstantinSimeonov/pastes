import { GetStaticPropsContext, InferGetServerSidePropsType } from "next"
import React from "react"
import "node_modules/prismjs/themes/prism-tomorrow.css"
import Head from "next/head"
import { withClient } from "@/prisma/with-client"
import { MostRecent } from "@/components/MostRecent"
import LC from "language-colors"
import { EXT_MAP } from "../pastes/extension-map"
import { Tooltip, Typography } from "@mui/material"
import { Stack } from "@mui/system"

export const getServerSideProps = async (ctx: GetStaticPropsContext) => {
  const user = await withClient(client =>
    client.user.findFirst({
      where: {
        id: String(ctx.params?.id),
      },
      include: {
        stats: true,
      },
    })
  )

  if (!user) {
    return {
      notFound: true,
    }
  }

  console.log(user)

  const languageMap = user.stats?.langs || {}

  console.log(languageMap, `lmap`)
  console.log()

  const colors = Object.entries(languageMap)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([lang, count]: [string, number]) =>
        [
          LC[lang]?.color || LC[EXT_MAP[lang] || ``]?.color || null,
          count,
          EXT_MAP[lang] || lang || `unknown`,
        ] as const
    )

  console.log(colors)

  return {
    props: {
      user,
      colors,
    },
  }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function UserById({ user, colors }: Props) {
  const total = colors.reduce((total, [, count]) => total + count, 0) || 0
  return (
    <>
      <Head>
        <title>{user.name}</title>
      </Head>
      <div>
        <Typography variant="h4" component="h1">
          {user.name} ({user.stats?.totalPastesCount} pastes)
        </Typography>
        {
          <Stack
            direction="row"
            gap={0}
            sx={{ width: `20rem`, height: `1rem` }}
          >
            {colors.map(([color, count, lang]) => {
              return (
                <Tooltip
                  title={
                    <Typography>
                      {lang} {((count / total) * 100) | 0}%
                    </Typography>
                  }
                  key={`${color?.join()}-${lang}`}
                >
                  <div
                    style={{
                      width: `${(count / total) * 100}%`,
                      backgroundColor: `rgb(${color?.join()})`,
                    }}
                  />
                </Tooltip>
              )
            })}
          </Stack>
        }
        <section>
          <h3>Activity</h3>
          <MostRecent authorId={user.id} />
        </section>
      </div>
    </>
  )
}
