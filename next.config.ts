import type { NextConfig } from "next";

// CSP
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.storyblok.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' blob: data: https://a.storyblok.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://app.storyblok.com https://api.storyblok.com;
  frame-src 'self' https://app.storyblok.com;
  frame-ancestors 'self' https://app.storyblok.com;
`;

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  poweredByHeader: false,
  images: {
    qualities: [100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "a.storyblok.com",
        port: "",
        pathname: "/f/335981/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspHeader.replace(/\s{2,}/g, " ").trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;