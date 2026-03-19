/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
    minimumCacheTTL: 1209600, // 2 weeks in seconds
    formats: ['image/webp'],
  },
  experimental: {
    viewTransition: true,
  },
};

module.exports = nextConfig;
