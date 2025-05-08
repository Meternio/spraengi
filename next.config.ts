import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://a.storyblok.com/**')],
  },
};

export default nextConfig;
