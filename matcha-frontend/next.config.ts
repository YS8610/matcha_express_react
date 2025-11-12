import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'http://matcha-backend:3001'
      : (process.env.BACKEND_URL || 'http://localhost:3001');

    return {
      beforeFiles: [
        {
          source: '/pubapi/activate/:token',
          destination: '/activate/:token',
        },
        {
          source: '/pubapi/reset-password/:id/:token',
          destination: '/reset-password/:id/:token',
        },
      ],
      afterFiles: [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
        {
          source: '/pubapi/:path*',
          destination: `${backendUrl}/pubapi/:path*`,
        },
      ],
    };
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.socket.io https://cdn.jsdelivr.net;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: blob:;
              font-src 'self' data:;
              worker-src 'self' blob:;
              connect-src 'self' http://localhost:3001 http://localhost:8080 http://localhost:80 ws://localhost:3001 ws://localhost:8080 ws://localhost:80 http://matcha-backend:3001 ws://matcha-backend:3001;
              frame-ancestors 'none';
              base-uri 'self';
              form-action 'self';
              upgrade-insecure-requests;
            `.replace(/\s+/g, ' ').trim(),
          },

          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },

          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },

          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },

          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },

          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), payment=()',
          },

          ...(process.env.NODE_ENV === 'production'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains; preload',
                },
              ]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
