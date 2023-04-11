import * as React from "react"
import { MenuItem, Select, SelectChangeEvent } from "@mui/material"
import Head from "next/head"
import { useSession } from "next-auth/react"
import { useMutation } from "@tanstack/react-query"
import ky from "ky"
import { useToast } from "./Snackbar"

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
  const session = useSession()
  const updateUserCodeTheme = useMutation(
    (vars: { prismTheme: PrismThemeName; userId: string }) =>
      ky.put(`/api/users/${vars.userId}/prefs`, {
        json: {
          prismTheme: vars.prismTheme,
        },
      })
  )

  const toast = useToast()

  const onChange = React.useCallback(
    (event: SelectChangeEvent<PrismThemeName>) => {
      const prismTheme = event.target.value as PrismThemeName
      setPrismTheme(prismTheme)
      const userId = session?.data?.user.id
      if (userId) {
        updateUserCodeTheme.mutateAsync({ prismTheme, userId }).catch(error => {
          console.error(error)
          toast({
            severity: `error`,
            children: `We couldn't persist your theme choice, please retry`,
          })
        })
      }
    },
    [session.data?.user.id, prismTheme, toast]
  )

  return (
    <Select
      label="Code theme"
      value={prismTheme}
      size="small"
      onChange={onChange}
      variant="standard"
      renderValue={x => `Theme: ${x}`}
    >
      {THEMES.map(theme => (
        <MenuItem key={theme} value={theme}>
          {theme}
        </MenuItem>
      ))}
    </Select>
  )
}
