import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next"
import Prism from "prismjs"
import React from "react"
import "node_modules/prismjs/themes/prism-tomorrow.css"
import Head from "next/head"
import { withClient } from "@/prisma/with-client"

type Props = {
  id: string
  title: string | null
  content: string
  language: string | null
}

export const getServerSideProps: GetServerSideProps<Props> = async ctx => {
  const pasteOrNull = await withClient(client =>
    client.paste.findFirst({
      where: {
        id: String(ctx.query.id),
      },
    })
  )

  if (!pasteOrNull) {
    return {
      notFound: true
    }
  }

  const { id, title, content, language } = pasteOrNull

  return {
    props: { id, title, content, language },
  }
}

const useCopy = () => {
  const area = React.useRef<HTMLTextAreaElement>(null)

  const copy = (text: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const ta = area.current
    if (!ta) return
    ta.focus()
    ta.value = text
    ta.selectionStart = 0
    ta.selectionEnd = ta.value.length

    document.execCommand(`copy`)

    e.currentTarget.focus()
  }

  const elem = React.useMemo(
    () => <textarea ref={area} className="invis" />,
    []
  )

  return { copy, elem }
}

export default function PasteById(props: Props) {
  React.useEffect(() => {
    if (typeof window !== "undefined") Prism.highlightAll()
  }, [props.id])

  const { copy, elem } = useCopy()

  return (
    <>
      <Head>
        <title>{props.title || `Paste`}</title>
      </Head>
      <div>
        <h1>
          {props.title} {props.language ? `(${props.language})` : ``}
        </h1>
        <div className="cluster">
          <button onClick={copy(props.content)}>Copy content</button>
          <button
            onClick={copy(
              typeof window !== `undefined` ? window.location.href : ``
            )}
          >
            Copy url
          </button>
        </div>
        {elem}
        <pre>
          <code className={`language-${props.language}`}>{props.content}</code>
        </pre>
      </div>
    </>
  )
}
