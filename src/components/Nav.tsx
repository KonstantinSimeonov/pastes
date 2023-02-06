import Link from "next/link";
import styles from "./nav.module.css"

export const Nav = () => (
  <nav>
    <ol className={styles[`app-nav`]}>
      <li>
        <Link href="/">Pastes</Link>
      </li>
      <li>
        <Link href="/create">Create</Link>
      </li>
    </ol>
  </nav>
)
