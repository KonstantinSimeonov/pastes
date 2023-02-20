import { signIn, signOut, useSession } from "next-auth/react"
import { NextLink } from "./NextLink"
import { AppBar, Toolbar, Typography } from "@mui/material"
import * as React from "react"
import { ToggleTheme } from "./ThemeToggle"

export const Nav: React.FC = React.memo(function Nav() {
  const { data: session } = useSession()

  const logOut = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    signOut()
  }, [])

  const logIn = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    signIn()
  }, [])

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
                  onClick={logOut}
                >
                  Log out
                </NextLink>
                <Typography>{session.user.name}</Typography>
              </>
            ) : (
              <NextLink href="/api/auth/signin" color="inherit" onClick={logIn}>
                Log in
              </NextLink>
            )}
            <ToggleTheme />
          </Toolbar>
        </nav>
      </AppBar>
    </>
  )
})
