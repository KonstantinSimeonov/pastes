import { GetStaticPropsContext, InferGetServerSidePropsType } from "next"
import React from "react"
import "node_modules/prismjs/themes/prism-tomorrow.css"
import Head from "next/head"
import { withClient } from "@/prisma/with-client"
import { MostRecent } from "@/components/MostRecent"
import LC from "language-colors"

export const getServerSideProps = async (ctx: GetStaticPropsContext) => {
  const u = await withClient(client =>
    client.user.findFirst({
      where: {
        id: String(ctx.params?.id),
      },
      include: {
        stats: true,
      },
    })
  )

  if (!u) {
    return {
      notFound: true,
    }
  }

  const colors = Object.entries(Object.assign({}, ...(u.stats?.langs || [])))
    .sort((a, b) => b[1] - a[1])
    .map(([lang, count]: [string, number]) => {
      console.log(lang, `kek`, LC[lang])
      return [LC[lang]?.color, count, lang] as const
    })

  console.log(LC.sql, LC.typescript, LC.javascript, LC.ts, LC.js)
  console.log(colors)

  return {
    props: {
      user: u,
      colors,
    },
  }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function UserById({ user, colors }: Props) {
  const total =
    user.stats?.totalPastesCount ||
    colors.reduce((total, [, count]) => total + count, 0) ||
    0
  return (
    <>
      <Head>
        <title>{user.name}</title>
      </Head>
      <div>
        <h1>
          {user.name} ({user.stats?.totalPastesCount} pastes)
        </h1>
        <div style={{ width: `5rem`, height: `10px` }}>
          {colors.map(([color, count, lang]) => {
            console.log(color, lang, `rbg(${color?.join()})`)
            return (
              <div
                key={color?.join()}
                title={`${lang} ${count / total * 100 | 0}%`}
                style={{
                  width: `${count / total * 100}%`,
                  height: `10px`,
                  display: `inline-block`,
                  backgroundColor: `rgb(${color?.join()})`,
                }}
              />
            )
          })}
        </div>
        <section>
          <h3>Activity</h3>
          <MostRecent authorId={user.id} />
        </section>
      </div>
    </>
  )
}
