import Link from "next/link"
import styles from "./nav.module.css"
import { signIn, signOut, useSession } from "next-auth/react"

export const Nav = () => {
  const { data: session, status } = useSession()

  return (
    <nav className="cluster">
      <ol className="cluster">
        <li>
          <Link href="/">Pastes</Link>
        </li>
        <li>
          <Link href="/create">Create</Link>
        </li>
          {session?.user ? (
            <>
            <li>
            <a
              href="/api/auth/signout"
              onClick={e => {
                e.preventDefault()
                signOut()
              }}
            >
              Log out
            </a>
            </li>
            <li>
              {session.user.name}
            </li>
            </>
          ) : (
            <li>
            <a
              href="/api/auth/signin"
              onClick={e => {
                e.preventDefault()
                signIn()
              }}
            >
              Log in
            </a>
            </li>
          )}
      </ol>
    </nav>
  )
}
