import Head from "next/head"
import * as React from "react"
import { PasteProps } from "./[id].page"

export const MetaTags: React.FC<{ paste: PasteProps }> = ({ paste }) => {
  const metaTitle = `Paste ${paste.description || ``}`
  const author = `Author: ${paste.author?.name || `Anonymous`}`
  const files = `${paste.files.length} file${paste.files.length > 1 ? `s` : ``}`
  const exts = new Set(
    paste.files.map(f => f.name.split(`.`).pop() || `unknown`)
  )
  const languages = `language${paste.files.length > 1 ? `s` : ``}: ${Array.from(
    exts
  ).join(`, `)}`
  const metaDescription = [author, files, languages].join(`, `)

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />

      <meta name="og:title" content={metaTitle} />
      <meta name="og:description" content={metaDescription} />
    </Head>
  )
}
