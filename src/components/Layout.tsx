import { Box, Drawer, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import React from "react"
import { MostRecent } from "./MostRecent"
import { Nav } from "./Nav"

export const Layout: React.FC<
  React.PropsWithChildren<{
    onThemeToggle: () => void
  }>
> = ({ children, onThemeToggle }) => (
  <Stack gap={2}>
    <Nav onThemeToggle={onThemeToggle} />
    <Stack direction="row">
      <main className="box" style={{ flex: 1, maxWidth: `75%` }}>
        {children}
      </main>
      <Drawer
        components={{ Root: `aside` }}
        variant="permanent"
        anchor="right"
        sx={{
          width: `20%`,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: `20%`,
            boxSizing: `border-box`,
          },
        }}
      >
        <Box sx={{ padding: `1rem` }}>
          <Typography variant="h4" component="h2">
            Most recent pastes
          </Typography>
          <MostRecent />
        </Box>
      </Drawer>
    </Stack>
  </Stack>
)
