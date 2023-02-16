import { Typography } from "@mui/material"
import { Stack } from "@mui/system"
import React from "react"
import { MostRecent } from "./MostRecent"
import { Nav } from "./Nav"

export const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <Stack gap={2}>
    <Nav />
    <Stack direction="row">
      <main className="box" style={{ flex: 1, maxWidth: `75%` }}>
        {children}
      </main>
      <aside style={{ width: `20%` }}>
        <Typography variant="h4" component="h2">
          Most recent pastes
        </Typography>
        <MostRecent />
      </aside>
    </Stack>
  </Stack>
)
