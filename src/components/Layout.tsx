import React from 'react'
import {Nav} from './Nav'

export const Layout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="stack">
    <Nav />
    <main className="box">{children}</main>
  </div>
)
