import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'http://matcha-backend:3001'
      : (process.env.BACKEND_URL || 'http://localhost:3001');

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
