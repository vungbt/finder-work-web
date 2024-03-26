/** @type {import('next').NextConfig} */
const nextBuildId = require('next-build-id');
const withNextIntl = require('next-intl/plugin')('./i18n.ts');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const nextConfig = {
  output: 'standalone',
  swcMinify: true,
  reactStrictMode: false,
  generateBuildId: () => nextBuildId({ dir: __dirname }),
  env: {
    GRAPHQL_API_URL: process.env.GRAPHQL_API_URL,
    PAGE_PROPS_REVALIDATE: process.env.PAGE_PROPS_REVALIDATE
  },
  images: {
    domains: process.env.IMAGE_DOMAINS.split(',')
  }
};

module.exports = withBundleAnalyzer(withNextIntl({ ...nextConfig }));
