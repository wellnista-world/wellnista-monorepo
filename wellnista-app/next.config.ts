import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.openfoodfacts.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.openfoodfacts.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
