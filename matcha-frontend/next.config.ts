import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://matcha-backend:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/pubapi/:path*',
        destination: `${backendUrl}/pubapi/:path*`,
      },
    ];
  },
};

export default nextConfig;
