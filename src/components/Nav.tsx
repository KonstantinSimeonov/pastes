import { signIn, signOut, useSession } from "next-auth/react"
import { Stack } from "@mui/system"
import { NextLink } from "./NextLink"

export const Nav = () => {
  const { data: session } = useSession()

  return (
    <Stack direction="row" component="nav" sx={{ padding: `1rem 1rem 0 1rem` }}>
      <Stack direction="row" gap={2} component="ol">
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
      </Stack>
    </Stack>
  )
}
