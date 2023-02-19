import { Box, Drawer, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import React from "react"
import { MostRecent } from "./MostRecent"
import { Nav } from "./Nav"

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Stack gap={2}>
    <Nav />
    <Stack direction="row">
      <Box component="main" style={{ flexGrow: 1, padding: `1rem` }}>
        {children}
      </Box>
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
        <Box sx={{ padding: `1rem 0 0 1rem` }}>
          <Typography variant="h4" component="h2">
            Most recent pastes
          </Typography>
        </Box>
        <MostRecent />
      </Drawer>
    </Stack>
  </Stack>
)
