/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // Ensuring clean build validation
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
