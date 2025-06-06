import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  images: {
    qualities: [100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'a.storyblok.com',
        port: '',
        pathname: '/f/335981/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOW-FROM https://app.storyblok.com",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://app.storyblok.com",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
