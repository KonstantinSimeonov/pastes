import * as React from "react"

export const useCopy = () => {
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
