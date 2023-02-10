import { GetServerSideProps } from "next"
import React from "react"
import "node_modules/prismjs/themes/prism-tomorrow.css"
import Head from "next/head"
import { withClient } from "@/prisma/with-client"
import {User} from "@prisma/client"
import {MostRecent} from "@/components/MostRecent"

export const getServerSideProps: GetServerSideProps = async ctx => {
  const u = await withClient(client => client.user.findFirst({
    where: {
      id: String(ctx.params?.id)
    },
  }))

  if (!u) {
    return {
      notFound: true
    }
  }

  return {
    props: u
  }
}

export default function UserById(props: User) {
  return (
    <>
      <Head><title>{props.name}</title></Head>
      <div>
        <h1>{props.name}</h1>
        <section>
          <h3>Activity</h3>
          <MostRecent authorId={props.id} />
        </section>
      </div>
    </>
  )
}
