import React from "react"
import { MostRecent } from "./MostRecent"
import { Nav } from "./Nav"

export const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="stack">
    <Nav />
    <div className="cluster">
      <main className="box" style={{ flex: 1 }}>
        {children}
      </main>
      <aside style={{ width: `20%` }}>
        <MostRecent />
      </aside>
    </div>
  </div>
)
