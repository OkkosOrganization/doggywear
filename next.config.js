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
    qualities: [70, 80, 90],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    viewTransition: true,
  },
};

module.exports = nextConfig;
