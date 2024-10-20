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
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('_http_common', 'undici');
    }
    return config;
  },
  generateBuildId: () => nextBuildId({ dir: __dirname }),
  env: {
    GRAPHQL_API_URL: process.env.GRAPHQL_API_URL,
    GRAPHQL_API_WS_URL: process.env.GRAPHQL_API_WS_URL,
    PAGE_PROPS_REVALIDATE: process.env.PAGE_PROPS_REVALIDATE
  },
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/dx66fumod/**'
      }
    ]
  }
};

module.exports = withBundleAnalyzer(withNextIntl({ ...nextConfig }));
