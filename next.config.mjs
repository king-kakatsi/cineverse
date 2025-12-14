/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', 
      },
      {
        protocol: 'https',
        hostname: 'image.ceneostatic.pl', 
      },
    ],
  },

  // Disable dev indicators
  devIndicators: false,

  // Enable standalone output for Docker
  output: 'standalone',
};

export default nextConfig;
