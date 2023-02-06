import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";

const qc = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={qc}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}
