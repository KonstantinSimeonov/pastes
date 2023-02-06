import Link from "next/link";
import '@/components/nav.css'

export const Nav = () => (
  <nav>
    <ol className="app-nav">
      <li>
        <Link href="/">Pastes</Link>
      </li>
      <li>
        <Link href="/create">Create</Link>
      </li>
    </ol>
  </nav>
)
