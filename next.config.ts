import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "badges.strava.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
