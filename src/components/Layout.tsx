import React from 'react'
import {MostRecent} from './MostRecent'
import {Nav} from './Nav'

export const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="stack">
    <Nav />
    <div className="cluster">
      <main className="box">{children}</main>
      <aside><MostRecent /></aside>
    </div>
  </div>
)
