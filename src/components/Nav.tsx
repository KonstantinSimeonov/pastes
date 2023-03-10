import { signIn, signOut, useSession } from "next-auth/react"
import { NextLink } from "./NextLink"
import { AppBar, Avatar, Toolbar, Typography } from "@mui/material"
import * as React from "react"
import { ToggleTheme } from "./ThemeToggle"
import GithubIcon from "@mui/icons-material/GitHub"
import { Stack } from "@mui/system"

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
                <NextLink color="inherit" href={`/users/${session.user.id}`}>
                  <Stack direction="row" gap={1} alignItems="center">
                    {session.user.image ? (
                      <Avatar
                        alt={session.user.name || `pic of user`}
                        src={session?.user.image}
                      />
                    ) : null}
                    <Typography>{session.user.name}</Typography>
                  </Stack>
                </NextLink>
                <NextLink
                  href="/api/auth/signout"
                  color="inherit"
                  onClick={logOut}
                >
                  Log out
                </NextLink>
              </>
            ) : (
              <NextLink href="/api/auth/signin" color="inherit" onClick={logIn}>
                Log in
              </NextLink>
            )}
            <ToggleTheme />
            <NextLink
              color="inherit"
              href="https://github.com/KonstantinSimeonov/pastes"
            >
              <Stack direction="row" gap={1}>
                <Typography>Src</Typography>
                <GithubIcon />
              </Stack>
            </NextLink>
          </Toolbar>
        </nav>
      </AppBar>
    </>
  )
})
