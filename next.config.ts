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

  /**
   * Baseline security headers (WEB-SECURITY-BASELINE.md). The live site was
   * shipping only HSTS.
   *
   * All four are SEO-neutral — they change nothing about how Googlebot renders
   * or indexes a page, so there is no ranking reason to withhold them.
   *
   * CSP is deliberately NOT here. Google renders JS before indexing, and this
   * site loads GA / Meta / TikTok pixels plus next/font; an untested CSP would
   * silently break rendering and cost rankings. CSP gets its own tested pass.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
