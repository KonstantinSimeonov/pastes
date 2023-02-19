import { signIn, signOut, useSession } from "next-auth/react"
import { NextLink } from "./NextLink"
import { AppBar, Toolbar, Typography } from "@mui/material"
import * as React from "react"
import { ToggleTheme } from "./ThemeToggle"
import { PrismThemeSelect } from "./PrismTheme"

export const Nav: React.FC = () => {
  const { data: session } = useSession()

  return (
    <>
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
            <PrismThemeSelect />
          </Toolbar>
        </nav>
      </AppBar>
    </>
  )
}
