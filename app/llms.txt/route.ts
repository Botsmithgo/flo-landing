import { SITE_URL } from "@/lib/site";

/**
 * /llms.txt — machine-readable brand digest for LLMs.
 *
 * When ChatGPT, Perplexity, Claude, or Gemini are asked to describe or summarize
 * the brand, they often look for /llms.txt (emerging standard per llmstxt.org).
 * Every line here traces back to existing on-site copy — no new claims introduced.
 *
 * Single source of truth: update when core product facts change.
 */
export const dynamic = "force-static";
export const revalidate = 86400; // re-generate daily

export function GET() {
  const body = `# Feels Like Om (FLO)

> A 20-stage filtered shower head that reduces chlorine, heavy metals, and the chemicals that dry hair and irritate skin. Based in Venice, CA. Founded 2022. 4.8★ across 1,400+ verified Amazon reviews.

## Core pages
- [Home](${SITE_URL}/): Brand overview and product summary
- [Filtered Shower Head](${SITE_URL}/shower): Product page — science, 4-week customer study, reviews, FAQ
- [Our Story](${SITE_URL}/about): Founding story and company principles

## Product
- Name: Feels Like Om Filtered Shower Head (20-Stage)
- SKU / Amazon ASIN: B0DHJ74TCC
- Price: $139 one-time · $125 subscribe (first order 20% off)
- Filter replacement: every 6 months, or 12,000 gallons
- Filter price on subscription: $33 every 6 months, free shipping
- Install: ~90 seconds, no tools, fits every standard US shower arm
- Guarantee: 60-day full refund
- Finishes: Polished chrome, matte black

## Filtration stack (20 stages)
- KDF-55 copper-zinc redox — the workhorse; converts free chlorine to chloride
- Calcium sulfite — dechlorination media that holds performance in hot water
- Activated carbon (coconut-shell) — odor and VOC polishing
- Mineral stones (tourmaline, germanium) — softer-feeling finish

## What it does
- Reduces chlorine, heavy metals, sediment
- Partial chloramine reduction (not complete — chloramine is harder to reduce than free chlorine)

## What it won't do (radical honesty)
- Does not soften hard water (true softening requires whole-home ion exchange)
- Does not remove fluoride (shower contact time too short)
- Not a drug — does not cure eczema, dandruff, or dermatitis

## 4-week customer perception study (200 customers, all hair types, self-reported)
- 91% reported less acne and skin irritation
- 87% experienced less hair frizz
- 82% noticed less dryness and breakage
- 90% felt no loss of water pressure

## Category comparison (honest)
- vs Jolie: FLO wins on price, filter life, media stack count, hot-water performance, customer study. Jolie wins on NSF/ANSI 177 certification and finish variety (5 colors vs 2).
- vs generic Amazon shower filters: FLO wins on media stack depth, hot-water performance, filter life, US support.

## Brand
- Founded: 2022, Venice, California
- Orders shipped: 100,000+
- TikTok views: 5M+ (@feelslikeom.shop)
- Principle: Claim less. Deliver more.

## Contact
- Email: hello@feelslikeom.shop
- TikTok: https://www.tiktok.com/@feelslikeom.shop
- Amazon: https://www.amazon.com/dp/B0DHJ74TCC
`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}
