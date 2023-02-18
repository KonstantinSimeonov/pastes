import { signIn, signOut, useSession } from "next-auth/react"
import Head from "next/head"
import { Stack } from "@mui/system"
import { NextLink } from "./NextLink"
import { Button, MenuItem, Select } from "@mui/material"
import * as React from "react"

const THEMES = [
  `coy`,
  `dark`,
  `funky`,
  `okaidia`,
  `solarizedlight`,
  `tomorrow`,
  `twilight`,
]

export const Nav: React.FC<{ onThemeToggle: () => void }> = ({
  onThemeToggle,
}) => {
  const { data: session } = useSession()
  const [prismTheme, setPrismTheme] = React.useState(`tomorrow`)

  return (
    <>
      <Head>
        <link
          key={prismTheme}
          rel="stylesheet"
          href={`/themes/prism-${prismTheme}.min.css`}
        />
      </Head>
      <Stack
        direction="row"
        component="nav"
        sx={{ padding: `1rem 1rem 0 1rem` }}
      >
        <Stack direction="row" gap={2} component="ol" alignItems="center">
          <li>
            <NextLink href="/">Pastes</NextLink>
          </li>
          <li>
            <NextLink href="/create">Create</NextLink>
          </li>
          {session?.user ? (
            <>
              <li>
                <NextLink
                  href="/api/auth/signout"
                  onClick={e => {
                    e.preventDefault()
                    signOut()
                  }}
                >
                  Log out
                </NextLink>
              </li>
              <li>{session.user.name}</li>
            </>
          ) : (
            <li>
              <NextLink
                href="/api/auth/signin"
                onClick={e => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Log in
              </NextLink>
            </li>
          )}
          <li>
            <Button size="small" variant="outlined" onClick={onThemeToggle}>
              Toggle theme
            </Button>
          </li>
          <li>
            <Select
              label="Code theme"
              value={prismTheme}
              size="small"
              onChange={event => setPrismTheme(event.target.value)}
            >
              {THEMES.map(theme => (
                <MenuItem key={theme} value={theme}>
                  {theme}
                </MenuItem>
              ))}
            </Select>
          </li>
        </Stack>
      </Stack>
    </>
  )
}
