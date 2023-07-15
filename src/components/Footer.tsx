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
    <Typography>Powered by NextJS, Postgres and AWS</Typography>
    <Stack direction="row" gap={1}>
      <NextLink color="inherit" href="https://github.com/KonstantinSimeonov">
        Konstantin Simeonov
      </NextLink>{" "}
      /
      <NextLink
        color="inherit"
        href="https://github.com/KonstantinSimeonov/pastes"
      >
        <Typography>pastes</Typography>
      </NextLink>
      <GithubIcon />
    </Stack>
  </Stack>
)
