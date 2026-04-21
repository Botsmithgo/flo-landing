import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Image optimization ON — Vercel auto-serves WebP/AVIF variants with
    // responsive srcset + lazy-loading. Hero JPGs at 3MB each drop to ~200KB.
    // Previously disabled as a workaround for dev-mode Unsplash proxy timeouts;
    // all current images live in /public so that workaround is obsolete.
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "m.media-amazon.com" },
    ],
  },
};

export default nextConfig;
