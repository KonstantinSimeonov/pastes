import React from "react"
import { MostRecent } from "./MostRecent"
import { Nav } from "./Nav"

export const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="stack full">
    <Nav />
    <div className="cluster full">
      <main className="box" style={{ flex: 1 }}>
        {children}
      </main>
      <aside style={{ width: `20%` }}>
        <h2>Most recent pastes</h2>
        <MostRecent />
      </aside>
    </div>
  </div>
)
