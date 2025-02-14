import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
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
