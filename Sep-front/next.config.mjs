/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'https://stopakambalaza.com/',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET, // Ensure your secret is defined
  },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
  };
  
  export default nextConfig;
  