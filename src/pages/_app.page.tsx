import "@/styles/globals.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

import type { AppProps } from "next/app"
import { Layout } from "@/components/Layout"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { CssBaseline } from "@mui/material"
import React from "react"
import { SnackbarProvider } from "@/components/Snackbar"
import { ThemeContext } from "@/components/ThemeToggle"

const qc = new QueryClient()

const dark = createTheme({
  palette: {
    mode: "dark",
  },
})

const light = createTheme({
  palette: {
    mode: "light",
  },
})

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [theme, setTheme] = React.useState(dark)
  const changeTheme = React.useCallback(
    (theme: `dark` | `light`) => setTheme(theme === `dark` ? dark : light),
    []
  )

  return (
    <ThemeProvider theme={theme}>
      <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
        <CssBaseline />
        <QueryClientProvider client={qc}>
          <SessionProvider session={session}>
            <SnackbarProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </SnackbarProvider>
          </SessionProvider>
        </QueryClientProvider>
      </ThemeContext.Provider>
    </ThemeProvider>
  )
}
