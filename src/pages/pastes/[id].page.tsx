import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next"
import React from "react"
import "prismjs/themes/prism-tomorrow.css"
import Head from "next/head"
import { withClient } from "@/prisma/with-client"
import { useCopy } from "@/hooks/use-copy"
import Prism from "prismjs"
import { Paste } from "@prisma/client"

const fixDates = <T extends {}>(x: T): T => JSON.parse(JSON.stringify(x))

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const pasteOrNull = await withClient(client =>
    client.paste.findFirst({
      where: {
        id: String(ctx.query.id),
      },
      include: {
        files: true,
      },
    })
  )

  if (!pasteOrNull) {
    return {
      notFound: true,
    }
  }

  return {
    props: fixDates(pasteOrNull),
  }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>

export default function PasteById(props: Props) {
  React.useEffect(() => {
    Promise.all(
      props.files.map(
        p => {
          const map: Record<string, string> = {
            hs: `haskell`,
            rs: `rust`,
            sc: `scala`,
            js: `javascript`,
            ts: `typescript`
          }
          return import(`prismjs/components/prism-${map[p.name?.split(`.`).pop() as string]}`)
        }
      )
    ).then(() => Prism.highlightAll())
  }, [props.id])

  const { copy, elem } = useCopy()

  return (
    <>
      <Head>
        <title>Pastes</title>
      </Head>
      <div>
        <h1>{props.description}</h1>
        {props.files.map(f => (
          <div key={f.id}>
            <div className="cluster">
              <h3>{f.name}</h3>
              <button onClick={copy(f.content)}>Copy content</button>
              <button
                onClick={copy(
                  typeof window !== `undefined` ? window.location.href : ``
                )}
              >
                Copy url
              </button>
            </div>
            <pre>
              <code className={`lang-${f.name?.split(`.`).pop()}`}>
                {f.content}
              </code>
            </pre>
          </div>
        ))}
        {elem}
      </div>
    </>
  )
}
