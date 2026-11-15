import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  // Security headers on every response. The Content-Security-Policy is REPORT-ONLY for now:
  // browsers log what it would block (DevTools console) but block nothing; enforce it once the
  // reports are clean. Camera stays allowed for this site (barcode / food scan).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), browsing-topics=()" },
          {
            key: "Content-Security-Policy-Report-Only",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.line-scdn.net https://js.stripe.com https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: wss:; frame-src https://js.stripe.com https://hooks.stripe.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://checkout.stripe.com; object-src 'none'; worker-src 'self' blob:",
          },
        ],
      },
    ];
  },
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
