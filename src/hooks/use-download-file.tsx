import * as React from "react"

export const useDownloadFile = () => {
  const link = React.useRef<HTMLAnchorElement>(null)

  const anchor = <a ref={link} style={{ display: `none` }} />

  const download = React.useCallback(
    (content: string, name: string, type = `text/plain`) => {
      const blob = new Blob([content], { type })
      if (link.current) {
        link.current.href = webkitURL.createObjectURL(blob)
        link.current.download = name
        link.current.click()
      }
    },
    []
  )

  return { anchor, download }
}
