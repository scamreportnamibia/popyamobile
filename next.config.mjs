/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable strict mode to avoid double rendering in development
  reactStrictMode: false,
  
  // Optimize images
  images: {
    domains: ['placeholder.svg'],
    unoptimized: true,
  },
  
  // Disable TypeScript and ESLint checks during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
