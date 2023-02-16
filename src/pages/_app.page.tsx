import "@/styles/globals.css"
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

import type { AppProps } from "next/app"
import { Layout } from "@/components/Layout"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@emotion/react"
import { createTheme } from "@mui/material/styles"

const qc = new QueryClient()

const theme = createTheme({
  palette: {
    text: {
      primary: `#FFFFFF`,
      secondary: `#aaaaaa`,
      disabled: `rgba(200, 200, 200, 0.75)`,
    },
    divider: `#FFFFFF`,
    action: {
      disabled: `rgba(200, 200, 200, 0.75)`,
    },
  },
})

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={qc}>
        <SessionProvider session={session}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
