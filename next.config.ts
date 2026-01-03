import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tibiadraptor.com",
        pathname: "/images/monsters/**",
      },
    ],
  },
};

export default nextConfig;
