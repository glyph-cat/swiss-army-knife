import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack(config) {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        symlinks: false,
      },
    }
  }
}

export default nextConfig
