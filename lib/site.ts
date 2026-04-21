/**
 * Canonical site URL — single source of truth for SEO + structured data.
 *
 * Reads `NEXT_PUBLIC_SITE_URL` from env with a production fallback. To change
 * the production domain later:
 *   1. Set `NEXT_PUBLIC_SITE_URL=https://new-domain.com` in Vercel
 *   2. Redeploy
 *   3. Every canonical URL, OG tag, schema.org URL, sitemap entry, robots.txt
 *      pointer, and llms.txt reference flips automatically.
 *
 * Do NOT hardcode `https://feelslikeom.shop` anywhere else — import from here.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://feelslikeom.shop";

/** Hostname only (for places that need it without the protocol). */
export const SITE_HOST = new URL(SITE_URL).host;
