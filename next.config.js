/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: [`page.tsx`, `api.ts`],

  redirects: () => [
    {
      source: `/`,
      destination: `/create`,
      permanent: true
    }
  ]
}

module.exports = nextConfig
