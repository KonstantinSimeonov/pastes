// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require(`@sentry/nextjs`)
const CopyPlugin = require(`copy-webpack-plugin`)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: [`page.tsx`, `api.ts`],

  webpack: config => {
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: `node_modules/prismjs/themes/*.min.css`,
            to: `../public/themes/[name][ext]`,
          },
        ],
      })
    )

    return config
  },

  redirects: () => [
    {
      source: `/`,
      destination: `/create`,
      permanent: true,
    },
  ],
}

module.exports = nextConfig

module.exports = withSentryConfig(
  module.exports,
  { silent: true },
  { hideSourcemaps: true }
)
