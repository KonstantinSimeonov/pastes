import * as React from "react"
import { MenuItem, Select } from "@mui/material"
import Head from "next/head"

const THEMES = [
  `coy`,
  `dark`,
  `funky`,
  `okaidia`,
  `solarizedlight`,
  `tomorrow`,
  `twilight`,
] as const

type PrismThemeName = (typeof THEMES)[number]

const PrismThemeContext = React.createContext<{
  prismTheme: PrismThemeName
  setPrismTheme: (theme: PrismThemeName) => void
}>({
  prismTheme: `tomorrow`,
  setPrismTheme: () => {},
})

export const PrismThemeProvider: React.FC<
  React.PropsWithChildren<{ theme?: PrismThemeName }>
> = ({ children, theme = `tomorrow` }) => {
  const [prismTheme, setPrismTheme] = React.useState<PrismThemeName>(theme)

  return (
    <>
      <Head>
        <link
          key={prismTheme}
          rel="stylesheet"
          href={`/themes/prism-${prismTheme}.min.css`}
        />
      </Head>
      <PrismThemeContext.Provider value={{ prismTheme, setPrismTheme }}>
        {children}
      </PrismThemeContext.Provider>
    </>
  )
}

export const PrismThemeSelect: React.FC = () => {
  const { prismTheme, setPrismTheme } = React.useContext(PrismThemeContext)
  return (
    <Select
      label="Code theme"
      value={prismTheme}
      size="small"
      onChange={event => setPrismTheme(event.target.value as PrismThemeName)}
    >
      {THEMES.map(theme => (
        <MenuItem key={theme} value={theme}>
          {theme}
        </MenuItem>
      ))}
    </Select>
  )
}
