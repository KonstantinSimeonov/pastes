import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import React from "react"
import "prismjs/themes/prism-tomorrow.css"
import Head from "next/head"
import { withClient } from "@/prisma/with-client"
import { useCopy } from "@/hooks/use-copy"
import Prism from "prismjs"

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const pasteOrNull = await withClient(client =>
    client.paste.findFirst({
      where: {
        id: String(ctx.query.id),
      },
    })
  )

  if (!pasteOrNull) {
    return {
      notFound: true,
    }
  }

  const { id, title, content, language } = pasteOrNull

  return {
    props: { id, title, content, language },
  }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function PasteById(props: Props) {
  React.useEffect(() => {
    const pr = props.language
      ? import(`prismjs/components/prism-${props.language}`)
      : Promise.resolve()
    pr.then(() => Prism.highlightAll())
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
          <code className={`lang-${props.language}`}>{props.content}</code>
        </pre>
      </div>
    </>
  )
}
