import React from "react"
import { Typography, Stack, Tooltip } from "@mui/material"
import type { ColorStat } from "./user-stats"

export const LanguageColors: React.FC<{ colors: readonly ColorStat[] }> = ({
  colors,
}) => {
  const total = colors.reduce((total, { count }) => total + count, 0)
  return (
    <Stack direction="row" gap={0} sx={{ width: `20rem`, height: `1rem` }}>
      {colors.map(({ color, count, name }) => (
        <Tooltip
          title={
            <Typography>
              {name} {((count / total) * 100) | 0}%
            </Typography>
          }
          key={`${color.join()}-${name}`}
        >
          <div
            style={{
              width: `${(count / total) * 100}%`,
              backgroundColor: `rgb(${color?.join()})`,
            }}
          />
        </Tooltip>
      ))}
    </Stack>
  )
}
