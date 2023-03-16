import { Stack, Typography } from "@mui/material"
import { NextLink } from "./NextLink"
import GithubIcon from "@mui/icons-material/GitHub"

export const Footer = () => (
  <Stack
    justifySelf="flex-end"
    component="footer"
    direction="row"
    justifyContent="space-evenly"
    padding="1rem"
    flexWrap="wrap"
    gap={1}
    borderTop="1px dashed white"
  >
    <Typography>
      Built by{` `}
      <NextLink color="inherit" href="https://github.com/KonstantinSimeonov">
        Konstantin Simeonov
      </NextLink>
    </Typography>
    <Typography>Powered by NextJS, Postgres and AWS</Typography>
    <NextLink
      color="inherit"
      href="https://github.com/KonstantinSimeonov/pastes"
    >
      <Stack direction="row" gap={1}>
        <Typography>Source code</Typography>
        <GithubIcon />
      </Stack>
    </NextLink>
  </Stack>
)
