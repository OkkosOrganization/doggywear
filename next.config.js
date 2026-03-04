/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
      },
      {
        protocol: 'https',
        hostname: 'doggywear.cdn.prismic.io',
      },
      {
        protocol: 'https',
        hostname: '*.prismic.io',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
    deviceSizes: [480, 960, 1280, 1440],
    qualities: [70, 80, 90],
  },
  experimental: {
    viewTransition: true,
  },
};

module.exports = nextConfig;
