import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://matcha-backend:3001/api/:path*',
      },
      {
        source: '/pubapi/:path*',
        destination: 'http://matcha-backend:3001/pubapi/:path*',
      },
    ];
  },
};

export default nextConfig;
