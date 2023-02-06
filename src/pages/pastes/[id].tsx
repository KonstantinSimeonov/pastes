import {PrismaClient} from "@prisma/client";
import {GetServerSideProps} from "next";
import Prism from "prismjs"
import React from "react";
import "node_modules/prismjs/themes/prism-tomorrow.css"

type Props = { id: string; title: string | null; content: string; language: string | null }

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const pc = new PrismaClient()
  const { id, title, content, language, ...rest } = (await pc.paste.findFirst({
    where: {
      id: String(ctx.query.id)
    }
  }))!

  return {
    props: { id, title, content, language }
  }
}

export default function PasteById(props: Props) {
  React.useEffect(() => {
    if (typeof window !== "undefined")
      Prism.highlightAll()
  }, [])

  return (
    <div>
      <h1>{props.title}</h1>
      <pre>
        <code className={`language-${props.language}`}>{props.content}</code>
      </pre>
    </div>
  )
}
