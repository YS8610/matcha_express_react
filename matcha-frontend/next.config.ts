import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.infrastructureLogging = {
        level: 'error',
      };
    }
    return config;
  },
  async rewrites() {
    const backendUrl = process.env.NODE_ENV === 'production'
      ? 'http://matcha-backend:8080'
      : (process.env.BACKEND_URL || 'http://localhost:8080');

    return {
      beforeFiles: [],
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
    const isDev = process.env.NODE_ENV !== 'production';

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ''} https://cdn.socket.io https://cdn.jsdelivr.net;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https: blob:;
              font-src 'self' data: https:;
              worker-src 'self' blob:;
              connect-src 'self' http://localhost:8080 http://localhost:3002 http://localhost:80 ws://localhost:8080 ws://localhost:3002 ws://localhost:80 http://matcha-backend:8080 ws://matcha-backend:8080 http://backend:8080 ws://backend:8080 https://nominatim.openstreetmap.org http://ip-api.com https://ipapi.co;
              frame-ancestors 'none';
              base-uri 'self';
              form-action 'self';
              object-src 'none';
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
