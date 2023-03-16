import LC from "language-colors"
import { EXT_MAP } from "../pastes/extension-map"
import { UserStats } from "@prisma/client"

const normalizeExt = (ext: string) => {
  return (
    {
      jsx: `js`,
      tsx: `ts`,
      mjs: `js`,
      cjs: `js`,
      es6: `js`,
      scala: `sc`,
      mm: `cpp`,
      yml: `yaml`,
      chs: `hs`,
    }[ext] || ext
  )
}

export type ColorStat = Readonly<{
  name: string
  color: readonly [number, number, number]
  count: number
}>

export const getLanguageStatColors = (
  stats: Readonly<UserStats> | null
): readonly ColorStat[] => {
  const langEntries = Object.entries(stats?.langs || {}) as [string, number][]

  const grouped = langEntries.reduce<Record<string, number>>(
    (map, [ext, count]) => {
      const normalizedExt = normalizeExt(ext)
      map[normalizedExt] = map[normalizedExt] || 0
      map[normalizedExt] += count
      return map
    },
    {}
  )

  const colors = Object.entries(grouped)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([ext, count]) => {
      const name = (EXT_MAP[ext] || `other`).toLowerCase()
      const { color = [127, 127, 127] } = LC[name] || LC[ext] || {}
      return { name, color, count }
    })

  return colors
}
