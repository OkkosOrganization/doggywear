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
    deviceSizes: [480, 960, 1280, 1440, 1920],
    qualities: [25, 50, 75, 90],
  },
};

module.exports = nextConfig;
