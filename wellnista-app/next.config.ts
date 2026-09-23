import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.openfoodfacts.org",
        pathname: "/**",
      },
    ],
  },
};

// next-pwa hooks into webpack, so it is only applied for production builds
// (`next build --webpack`). `next dev` runs on Turbopack, where the plugin was
// disabled anyway, and Next 16 refuses a webpack config under Turbopack.
const config: NextConfig =
  process.env.NODE_ENV === 'development'
    ? nextConfig
    : withPWA({
        dest: 'public',
        register: true,
        skipWaiting: true,
      })(nextConfig);

export default config;
