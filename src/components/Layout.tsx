import { Box, Typography } from "@mui/material"
import { Stack } from "@mui/system"
import React from "react"
import { Footer } from "./Footer"
import { MostRecent } from "./MostRecent"
import { Nav } from "./Nav"

export const Layout: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <Stack minHeight="100%">
      <Nav />
      <Stack direction="row" flexWrap="wrap" flex={1}>
        <Box component="main" style={{ flexGrow: 1, padding: `1rem` }}>
          {children}
        </Box>
        <Stack component="aside" sx={{ minWidth: `18%` }}>
          <Box sx={{ padding: `1rem` }}>
            <Typography variant="h5" component="h2">
              Most recent pastes
            </Typography>
          </Box>
          <MostRecent />
        </Stack>
      </Stack>
      <Footer />
    </Stack>
  )
}
