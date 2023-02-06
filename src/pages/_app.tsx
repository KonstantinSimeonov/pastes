import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "@/components/Layout";
import { QueryClient, QueryClientProvider } from "react-query";

const qc = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <QueryClientProvider client={qc}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </Layout>
  );
}
