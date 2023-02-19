import { signIn, signOut, useSession } from "next-auth/react"
import Head from "next/head"
import { NextLink } from "./NextLink"
import { AppBar, MenuItem, Select, Toolbar, Typography } from "@mui/material"
import * as React from "react"
import { ToggleTheme } from "./ThemeToggle"

const THEMES = [
  `coy`,
  `dark`,
  `funky`,
  `okaidia`,
  `solarizedlight`,
  `tomorrow`,
  `twilight`,
]

export const Nav: React.FC = () => {
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
      <AppBar position="static">
        <nav>
          <Toolbar sx={{ gap: `1rem` }}>
            <NextLink href="/" color="inherit">
              Pastes
            </NextLink>
            <NextLink href="/create" color="inherit">
              Create
            </NextLink>
            {session?.user ? (
              <>
                <NextLink
                  href="/api/auth/signout"
                  color="inherit"
                  onClick={e => {
                    e.preventDefault()
                    signOut()
                  }}
                >
                  Log out
                </NextLink>
                <Typography>{session.user.name}</Typography>
              </>
            ) : (
              <NextLink
                href="/api/auth/signin"
                color="inherit"
                onClick={e => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Log in
              </NextLink>
            )}
            <ToggleTheme />
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
          </Toolbar>
        </nav>
      </AppBar>
    </>
  )
}
