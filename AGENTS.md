# FLO Landing — Project Context for Codex

_Last updated: 2026-04-29 (sprint 4: paid-LP optimization — plan persistence + section cuts). Read this first whenever you open this project._

---

## Next-session quick-start (read first if picking up from a break)

**Where we are:** **launch-ready ~96%.** Site live at https://flo-landing-six.vercel.app. Design, copy, compliance, architecture, SEO, GEO (AI-search), and Core Web Vitals all done. Remaining blockers are all user-dependent: real Amazon reviews, analytics pixel IDs, domain wire, Stripe setup, water-report backend, designer product photography.

**Last sprint shipped (2026-04-29, sprint 4 — paid-LP optimization + plan persistence):**
1. **Reveal motion tuning** (`74f60d0`) — duration `0.8s → 0.45s`, y-shift `24px → 12px`. Affects all 89 Reveal call-sites at once. ~2× snappier with subtler lift; matches premium positioning.
2. **Plan/color persistence across page** (`58e6a89`) — new `lib/offerStore.ts` (`useSyncExternalStore` module store) holds `{ plan, color }` globally. ShowerHeroV2, StickyATC, and new ShowerInlineCTA all read/write the same state. Fixed silent plan switch on click (StickyATC was always routing to `subscribe/chrome` regardless of hero choice).
3. **Mid-page inline CTA** (`58e6a89`) — new `components/sections/ShowerInlineCTA.tsx` between Benefits and Honesty. Quick "I'm in" path for buyers convinced by section 6 so they don't scroll through six more social-proof sections to find the next checkout. Dynamic price/href via offerStore + `begin_checkout` analytics tagged `source: "inline_cta"`.
4. **Home pricing fix** (`a443515`) — `HomeProducts` was anchoring $80 against $107.99 (single first-order) instead of MSRP $134.99. Now reads "From $80 ̶$̶1̶3̶4̶.̶9̶9̶ / subscribe & save" → 41% off perception vs old 26%.
5. **Save $X accents on plan cards** (`38acf0b`) — small uppercase `--deep` overline under each price in ShowerHeroV2 plan picker. "Save $54.99" subscribe vs "Save $27.00" one-time makes the gap visceral without bloating the strikethrough (which would clash with FLO's premium voice).
6. **Section cuts for paid-LP optimization** (`012580c`) — removed `TikTokProof` (duplicated BrandCredibility's "5M+ TikTok views" stat) and `RitualMoment` (pure brand mood at the moment buyers should be reaching for buy button) from `/shower`. Page goes 14 → 12 sections. Component files kept in repo for revert (see "Killed/superseded routes + components" below for revert recipes).

**Previous sprint (2026-04-21, sprint 3 — Phase 1 SEO/GEO hardening + audit fixes):**
1. **Compliance sweep** — removed every remaining "independently tested" / "lab-tested" / "bath filter" leak across 6 files (`aae9949`). Deleted orphan `ShowerScience.tsx`.
2. **ICP audit 6-item punch list** (`f76942b`) — benefits headline 6→7, honest Jolie-wins rows added to comparison, stat alignment, #offer anchor fix, RitualMoment copy rewrite, express-pay icons bumped 15%.
3. **SEO/GEO Tier 1 buildout** — 9 commits shipping: `lib/site.ts` centralizing SITE_URL via env var, per-route OG+Twitter on /shower and /about, full Organization schema (description/founding/address/contact), AI-crawler-explicit robots.txt (14 AI bots), WebSite+Breadcrumb+HowTo schemas, `/llms.txt` brand digest, Product schema with MerchantReturnPolicy+ShippingDetails, FAQ `<h3>` wrappers for rich-snippet parser, image optimization flipped back ON (AVIF/WebP served, 3MB hero JPGs → ~200KB).
4. **HomePromise headline rewrite** — "Water is the quietest ingredient / Make it count" → "Water is the most overlooked part / Make it work for you" (+ smaller type).
5. **Home filter image shrink** — FilterCutawayInteractive gained `compact` prop; home desktop uses 666/880 aspect (~18% shorter) so the section fits one viewport.

**Youssef's partner-mode preferences** (important — see §Preferences below for full detail):
- Make decisions on reversible things, don't ask permission 3 times
- Ship, show, iterate
- Push back honestly when he asks — he explicitly wants expert opinions, not yes-man
- Talk before building on strategic moves; execute without asking on tactical ones
- Git push for deploys (Vercel CLI is flaky)
- Compliance discipline is non-negotiable — do NOT port Amazon copy that contains "water softener," "99% chlorine," "toxic," "pH balance," or "thrive" language. Also do NOT re-introduce "independently tested" / "lab-tested" / "bath filter" language — we just swept those out.

**If Youssef asks you to pick up where we left off, the most likely next moves are:**
- Real Amazon reviews swap into AmazonReviewsGrid → unblocks deferred ReviewSchema JSON-LD (see "How to swap real reviews" below)
- Connect Stripe + Amazon MCF (his task — see §Checkout architecture)
- Analytics pixel IDs (his task — see §Analytics wiring)
- Domain cutover: update `NEXT_PUBLIC_SITE_URL` in Vercel + add 301s from flo-landing-six.vercel.app
- Tier 2 editorial scaffold (`/journal` MDX) — deferred; trigger is first real article in FLO voice
- Confirm Venice, CA / 2022 founding story is factually true before ad-spend scales (currently in OrganizationSchema + /about copy — flagged 2026-04-21)

**Git rollback tags:** `v1` (pre-pivot editorial), `pre-consolidation` (before ShowerResults merge on 2026-04-21)

---

## What this is

**Brand:** Feels Like Om (FLO) — wellness DTC, ~$70K/mo on Amazon. Amazon SKU `B0DHJ74TCC`, retail $139 / $125 with subscribe.

**This repo:** Full Next.js 16 brand site (not just an LP) at `https://flo-landing-six.vercel.app`. Four routes: `/`, `/shower`, `/about`. Bath filter was intentionally killed — single-product focus. See [Commits](https://github.com/Botsmithgo/flo-landing/commits/main) for the history.

**Owner:** Youssef (youssef@heydonto.com). He operates in **partner mode** — wants decisions, opinions, and speed. Don't ask "are you sure?" three times. Ship, show, iterate.

---

## Tech stack

- **Next.js 16.2.4** (App Router, Turbopack) + **React 19.2.4** + **TypeScript**
- **Tailwind v4** (`@theme inline` tokens in `app/globals.css`)
- **Framer Motion** (reveals, parallax, transitions) + **Lenis** (smooth scroll)
- **Fraunces** (serif display) + **Inter Tight** (sans) via `next/font/google`
- **Stripe Payment Links** via `lib/checkout.ts` (wired, env-var gated — see §Checkout)
- **Image optimization ON** (`next.config.ts` `unoptimized: false`, formats: [avif, webp]) — as of sprint 3
- **Canonical URL centralized** in `lib/site.ts` reading `NEXT_PUBLIC_SITE_URL` — changing the production domain is a 1-line env var flip in Vercel
- **Vercel Git integration** for deploys (CLI is flaky, push to main = auto-deploy)

---

## Brand tokens (v2 — dusty blue palette)

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#141C22` | Primary text + dark surfaces |
| `--ink-2` | `#1A2530` | Secondary dark surface |
| `--bone` | `#F7F3EC` | Warm cream — primary light bg |
| `--mist` | `#E6ECEF` | Pale dusty blue alt bg |
| `--water` | `#CDD8E0` | Mid dusty blue tertiary bg |
| `--deep` | `#5C7A9A` | **Brand blue — CTAs + italic accents** |
| `--deeper` | `#374F66` | Deep blue for dark sections |
| `--sage` | `#8FA8BA` | Light blue tertiary accent |
| `--gold` | `#C9A96E` | Warm hairline accent only |
| `--muted` | `#64707A` | Cool muted text |

**Motion DNA:** Lenis smooth scroll (gentler than RAAR), reveal-on-scroll for headlines, magnetic CTAs **only** on primary buy button, **no custom cursor** (skipped for ecom CVR), Framer `useScroll`/`useTransform` for parallax. Honor `prefers-reduced-motion`.

**Copy voice:** restrained + wellness-credible. One italic `--deep` accent per headline. Three-beat rhythm. No "softens," no "detox," no "cures."

---

## Compliance rules (NON-NEGOTIABLE)

See `/research/benchmarks-compliance.md` for full 2,100-word brief. Key rules:

| ❌ Never write | ✅ Safe rewrite |
|---|---|
| "Softens hard water" | "Softer-feeling water" |
| "Eliminates chlorine" | "Designed to reduce chlorine" |
| "NSF-grade" / "meets NSF standards" (without cert) | "Tested by [lab name]" |
| "Detoxifies" | "Reduces chlorine and chemicals" |
| "Purifies your water" | "Filters chlorine, heavy metals, sediment" |
| "Clinically proven" | "Users report" |
| "Removes 99%" | "Reduces by up to [X]%" (with lab data) |

**Prop 65 warning is already in the footer.** Do not remove. CA orders require it.

**If FLO doesn't have NSF 177 certification**, never use the NSF logo, the letters "NSF," or the number 177. Say "independently lab-tested" instead.

---

## Assets + photography

Real product imagery lives in `public/product/`. The FLO assets library (2026-04-21 drop) added brand illustrations, icons, and the polished comparison image.

```
public/product/
# — IN ACTIVE USE —
├── filter-exploded-cutaway.png  # Chrome top + cartridge w/ visible bands + base + water swirl
│                                # Used in FilterCutawayInteractive (home + /shower science)
├── comparison-clean.png         # Transparent PNG — full 2-panel before/after (Acne + Hair)
├── comparison-acne.png          # Left panel only (split via PIL) — used in ShowerResults right col top
├── comparison-hair.png          # Right panel only — used in ShowerResults right col bottom
├── hero-lifestyle.jpg           # Moody woman-in-shower — used as /about hero bg
├── hair-lifestyle.jpg           # Smiling woman w/ healthy hair — HomeFounder bg
├── bathroom-scene.jpg           # AI-generated empty luxe bathroom — HomeHero bg + OG image
├── product-white-composite.jpg  # Chrome + packaging + splash — ShowerHero main + gallery
├── product-black-composite.jpg  # Black + packaging + splash — hero thumbnail
├── product-bathroom.jpg         # M1 — product tilted in luxe bathroom (has "Beauty Tool" text in corner)
├── product-white-face.jpg       # Chrome face-on w/ badges (gallery thumb)
├── product-black-face.jpg       # Black face-on w/ badges (gallery thumb)
├── dimensions.jpg               # 134mm × 140mm spec shot — gallery thumb
│
# — BRAND ILLUSTRATIONS (FLO asset library, 2026-04-21) —
├── illus-skin.png               # Colored vector: woman w/ hands near face + sparkles
│                                # Used in ShowerResults "91% reduced skin irritation" stat
├── illus-hair.png               # Colored vector: woman hugging own long hair + sparkles
│                                # Used in ShowerResults "87% less hair frizz" stat
├── illus-portrait.png           # Stylized editorial portrait (black woman) — NOT wired yet
│
# — LINE ICONS (FLO asset library, editorial style) —
├── icon-face.png                # Face w/ acne dots — StudyIcons FaceIcon
├── icon-follicle.png            # Hair follicle + water drops — StudyIcons FollicleIcon
├── icon-droplet.png             # Water droplet + check — StudyIcons DropletIcon
│                                # (All 3 are black-on-transparent; pass `dark` prop on dark surfaces)
│
# — HELD FOR FUTURE —
├── lifestyle-shower-happy.jpg   # Real smiling woman in shower (not yet wired)
├── product-black-clean.png      # Clean black face-on product — held for listing images
│                                # folder Youssef will provide (do NOT use as hero yet)
├── before-after.jpg             # Raw Amazon A+ composite — superseded by comparison-clean.png
├── filter-cutaway.png           # OLD cartridge-only cutaway — superseded by -exploded-
├── filter-media-chart.jpg       # 20-stage filter media chart infographic
├── install-guide.jpg            # 3-step install infographic
├── install-glowup.jpg           # "Instant Glow-Up" A+ panel
├── lifestyle-triptych.jpg       # 3-panel shower lifestyle
└── # Old Gemini AI composite attempts — failed to hit product fidelity, kept for record
    # bathroom-with-product.jpg, ritual-mounted.jpg, ritual-mounted-v3.jpg
```

Brand wordmark: `public/logo.png` (FLO "feelslikeOm" wordmark, auto-trimmed to 645×158 tight bbox).
- Used in Nav (adaptive invert on dark hero, dark on scrolled light bg)
- Used in Footer (always inverted white on dark ink surface)

**Photography policy (agreed 2026-04-20):** Youssef owns imagery. Gen AI (Gemini Nano Banana Pro / 2) was tried 3× for product-in-bathroom composite — got close but never fidelity-accurate to the real product. Graphic designer will handle the final hero product composite. **Do not regenerate images without being asked.**

---

## Checkout architecture (DECIDED)

**Stripe direct + Amazon MCF for fulfillment.** Shopify is NOT in the V1 plan.

`lib/checkout.ts` supports three modes via `NEXT_PUBLIC_CHECKOUT_MODE`:
- `stripe`  — direct to Stripe Payment Link per variant (RECOMMENDED — keeps customer)
- `shopify` — Shopify cart permalink (only if a Shopify store exists later)
- `amazon`  — Amazon listing fallback (current default until Stripe is set up)

### Stripe setup (Youssef's task, ~15 min)

1. Sign up at [stripe.com](https://stripe.com)
2. Dashboard → Products → create "FLO Filtered Shower Head"
3. Add 4 variants × generate Payment Links for each:
   - Single / Chrome — $139
   - Single / Black — $139
   - Subscribe / Chrome — $125 + recurring filter sub
   - Subscribe / Black — $125 + recurring filter sub
4. Paste Payment Link URLs into Vercel env vars:
   - `NEXT_PUBLIC_STRIPE_LINK_SHOWER_SINGLE_CHROME`
   - `NEXT_PUBLIC_STRIPE_LINK_SHOWER_SINGLE_BLACK`
   - `NEXT_PUBLIC_STRIPE_LINK_SHOWER_SUBSCRIBE_CHROME`
   - `NEXT_PUBLIC_STRIPE_LINK_SHOWER_SUBSCRIBE_BLACK`
5. Set `NEXT_PUBLIC_CHECKOUT_MODE=stripe`
6. Stripe Payment Links accept card + Apple Pay + Google Pay + Link natively. Optional: enable Klarna, Afterpay, PayPal in Payment Link settings.

### Amazon MCF setup (Youssef's task, one-time)

Amazon Multi-Channel Fulfillment ships your existing FBA inventory to *your* customers when orders come from outside Amazon. ~$6-$8/order.

1. Amazon Seller Central → Settings → Fulfillment by Amazon → Multi-Channel Fulfillment Settings → enable
2. Create an MCF API integration OR use a 3PL connector (ShipBob, ShipMonk all integrate)
3. When a Stripe order comes in, push the order to MCF via API for fulfillment

For V1 launch: process Stripe orders manually in Seller Central → Create order → MCF. Automate via Stripe webhook + MCF API later when volume justifies it.

---

## SEO + GEO (AI-search) infrastructure

Full buildout shipped 2026-04-21. See commits `6a4d1e6` → `491469f` for the 9-commit sprint.

### What's live

| Surface | State |
|---|---|
| `metadataBase` + canonical | `SITE_URL` from env var (via `lib/site.ts`) |
| Per-route metadata | `/`, `/shower`, `/about` all have title + description + OG + Twitter |
| `/checkout` | `robots: { index: false, follow: false }` + robots.txt disallow |
| `sitemap.ts` | 3 public routes (excludes `/checkout`) |
| `robots.ts` | Explicit allows for 14 AI crawlers (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended, Meta-ExternalAgent, Bytespider, Amazonbot, CCBot, etc.) + 6 traditional bots |
| `/llms.txt` | Machine-readable brand digest, cached 24h |
| Structured data | Product, FAQ, Organization, WebSite, Breadcrumb, HowTo |
| ProductSchema | Includes MerchantReturnPolicy (60-day), OfferShippingDetails (free US), priceValidUntil, itemCondition, seller |
| OrganizationSchema | description, alternateName "FLO", foundingDate 2022, address (Venice CA US), contactPoint, sameAs (TikTok + Amazon) |
| FAQ rich-snippet eligibility | `<h3>` wrappers on question text |
| Image optimization | ON (`unoptimized: false`, formats avif+webp, responsive srcset) |

### Schema helpers (`components/StructuredData.tsx`)

- `ProductSchema({ name, description, image[], sku, brand, price, aggregateRating? })` — rich Google Shopping
- `FAQSchema({ questions: { q, a }[] })` — FAQPage JSON-LD
- `OrganizationSchema()` — renders once globally, full Organization block
- `WebSiteSchema()` — renders once globally (no SearchAction — intentional)
- `BreadcrumbSchema({ items: { name, url }[] })` — per-page; wired on /shower + /about
- `HowToSchema()` — 4-step 90-second install; wired on /shower

### Deferred schema

- **`ReviewSchema`** — NOT SHIPPED. Individual Amazon reviews schema is ready to build but placeholder review data in `AmazonReviewsGrid.tsx` is FTC risk. Ship when user provides real Amazon review export (see "How to swap real reviews").

### Tier 2 (editorial content) — DEFERRED to post-launch

Plan lives in the session plan file. Trigger: first real article written in FLO voice. Scaffold builds a `/journal/[slug]` MDX route with `ArticleSchema` + per-post FAQ. Cornerstone article roadmap:
1. "Is chlorine in shower water bad for your skin?" (EPA/CDC-cited)
2. "Do shower filters actually work? What 20 stages of filtration mean"
3. "Shower filter vs whole-home filter vs water softener: an honest comparison"
4. "How often should you replace a shower filter?"
5. "Filtered shower for curly hair / color-treated hair / eczema" (long-tail)

### Tier 3 (post-launch, user owns)

1. Google Search Console — verify domain, submit `/sitemap.xml`
2. Bing Webmaster Tools — same (Bing feeds ChatGPT Search citations)
3. IndexNow protocol — automate via Vercel cron once articles ship
4. Lighthouse audit on prod once domain is cut over
5. Backlink outreach (wellness publications: Byrdie, Well+Good, Allure)
6. Perplexity Merchant Program (unlocked by T1-G ProductSchema with return policy)
7. AI search monitoring cadence — weekly queries: "best shower filter 2026", "shower filter for eczema", "Jolie vs FLO", "does a shower filter remove chloramine", "Feels Like Om reviews" → log whether FLO is cited
8. Vercel env var audit — confirm GA4, Meta Pixel, TikTok Pixel, water report endpoint, Stripe links, checkout mode set on production scope
9. Domain cutover — set `NEXT_PUBLIC_SITE_URL` in Vercel to new domain + add 301s from flo-landing-six.vercel.app

### Verification commands (run after any SEO change)

```bash
# Confirm /llms.txt renders correctly
curl -s https://<prod>/llms.txt | head -40

# Confirm robots.txt has all AI crawler allows
curl -s https://<prod>/robots.txt

# Rich Results test URL (opens in browser)
# https://search.google.com/test/rich-results?url=https://<prod>/shower

# Schema validator
# https://validator.schema.org/#url=https%3A%2F%2F<prod>%2Fshower

# Social card validators
# https://developers.facebook.com/tools/debug/?q=<prod>/shower
# https://cards-dev.twitter.com/validator (deprecated but still works)
```

---

## Analytics wiring

`components/Analytics.tsx` is ready — reads from env:

```
NEXT_PUBLIC_GA_MEASUREMENT_ID=   # G-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=       # numeric ID
NEXT_PUBLIC_TIKTOK_PIXEL_ID=     # TikTok pixel code
```

If an ID is missing, that pixel silently doesn't load.

**Youssef's task (pending):**
1. GA4 — analytics.google.com → Create Property → Data Streams → Web → G-ID
2. Meta Pixel — business.facebook.com → Events Manager → Data Sources → Create Pixel
3. TikTok Pixel — ads.tiktok.com → Assets → Events → Web Events

**Events I should instrument once IDs land:** `shop_now_hero`, `plan_switch`, `color_switch`, `begin_checkout` (on ATC click), `faq_expand`, scroll depth 25/50/75/100.

---

## Site architecture (as of 2026-04-21)

```
/
  1. HomeHero                    Bathroom-scene.jpg bg + adaptive nav logo
  2. HomePromise                 3-pillar values
  3. HomeProducts                "One filter, done right" + FilterCutawayInteractive (exploded)
  4. HomeFounder                 Hair portrait + thesis
  5. HomeTestimonials            Illustrated 4-week stats (line icons) + quote grid
  6. HomeCTA                     "Pure water for a pure you."

/shower                            (12 sections after sprint-4 cuts; was 14)
  0. AnnouncementBar             Rotating 4-message bar above Nav (free shipping / 60-day / 100K / 20% off)
  1. ShowerHeroV2                Inline offer: plan picker + colorway + price + Checkout CTA
                                 Save $X accents under each plan card (sprint 4)
                                 Plan/color writes to lib/offerStore (sprint 4)
                                 Left = product image w/ 4 thumbnails (color-aware)
  2. BrandCredibility            100K+ / 4.8★ / 5M+ TikTok / 60-day (ribbon)
  3. ShowerResults               CONSOLIDATED: headline + subhead + stats LEFT, comparison
                                 images stacked RIGHT (top-flush with headline)
                                 Replaced ShowerBeforeAfter + ShowerStudy
  4. ShowerProblem               RESEARCH-BACKED: EPA framing, CDC chloramine stat, 9M lead
                                 service lines, 60-hrs-a-year math, "EPA tests water, no
                                 one tests what it does to you" closing line
  5. ShowerScienceInteractive    20-stage framing, interactive exploded filter RIGHT (capped
                                 max-w-[460px]), POV-flip copy LEFT, "what it won't do" callout
                                 Replaced ShowerScience (text-heavy tooltip version)
  6. ShowerBenefits              6 tangible shifts + 7th "Modern, classy design"
  7. ShowerInlineCTA  ⭐ NEW     "Ready when you are" mid-page close (sprint 4).
                                 Reads plan/color from offerStore — href + price reflect hero choice.
  8. ShowerHonesty               "What this won't do" — radical transparency
  9. AmazonReviewsGrid           6 review cards (placeholder but realistic) — SWAP WITH REAL
 10. CustomerUGC                 Auto-hides until UGC env vars set
                                 [TikTokProof was here at position 11 — cut sprint 4, see Killed below]
 11. ShowerComparison            vs Jolie, honest
 12. ShowerFAQ                   8 Q&A accordion
                                 [RitualMoment was here at position 13 — cut sprint 4, see Killed below]
 13. HomeCTA (reused)            Final close
     Sticky mobile ATC           Reads plan/color from offerStore (sprint 4) — price label + href reflect hero choice

/about                            Moody hero → long thesis → 4 principles → closing CTA
/sitemap.xml, /robots.txt         SEO infra
```

**Killed/superseded routes + components:**
- `/bath` — single-product focus pivot
- `/shower-v2` — promoted to canonical `/shower`
- `SkipToOffer` — removed (offer now in hero, no scroll needed)
- `ShowerScience` — superseded by `ShowerScienceInteractive` (component file kept for revert)
- `ShowerBeforeAfter` + `ShowerStudy` — superseded by `ShowerResults` (component files kept for revert)
- `ShowerProof` — removed (fake press logos were FTC risk; component file kept)
- `TikTokProof` — cut from `/shower` in sprint 4 for paid-LP optimization (duplicated BrandCredibility's "5M+ TikTok views" stat; AGENTS.md sprint-2 notes already flagged it as "not real social proof"). Component file kept at `components/sections/TikTokProof.tsx`. **Revert recipe:** restore the import line in `app/shower/page.tsx` and re-insert `<TikTokProof />` between `<CustomerUGC />` and `<ShowerComparison />`.
- `RitualMoment` — cut from `/shower` in sprint 4 for paid-LP optimization (pure brand mood right before the close — killed momentum at the worst moment, and reused the hero bathroom image so it didn't introduce new visual info). Component file kept at `components/sections/RitualMoment.tsx`. **Revert recipe:** restore the import line in `app/shower/page.tsx` and re-insert `<RitualMoment />` between `<ShowerFAQ />` and `<HomeCTA />`.
- `/checkout` route — removed sprint 4 for direct-to-Stripe routing. Stripe's hosted checkout already handles email capture, address autofill, Apple Pay/Google Pay/PayPal/Klarna by device — the FLO branded order-summary screen was a placeholder that added a click without adding conversion value. CTAs (hero, inline CTA, sticky ATC) now compute href via `buildCheckoutUrl({ variant })` from `lib/checkout.ts`, which returns the right Stripe Payment Link by plan+color (or Amazon listing as fallback). **Revert recipe:** if you need a branded pre-checkout screen later (e.g. for cart-abandonment email capture), restore `app/checkout/page.tsx` + `app/checkout/CheckoutContent.tsx` from git history (last commit before sprint 4 removal) and switch the CTA hrefs back to `/checkout?plan=${plan}&color=${color}`.

**Git rollback tags:**
- `v1` — pre-pivot editorial version (single-product scope decision happened)
- `pre-consolidation` — before ShowerResults merge (2026-04-21). Rollback = `git reset --hard pre-consolidation`

---

## Pre-launch punch list

### ✅ Done in sprint 4 (2026-04-29 — paid-LP optimization)
- **Reveal motion tuning** (`74f60d0`): defaults `duration 0.8s → 0.45s`, `y-shift 24px → 12px`. Affects all 89 Reveal call-sites at once.
- **`lib/offerStore.ts`** (new, `58e6a89`): tiny module-scoped store via `useSyncExternalStore` — holds `{ plan, color }` globally. ShowerHeroV2 writes; StickyATC + new ShowerInlineCTA read.
- **StickyATC fix** (`58e6a89`): now reads plan/color from offerStore so `href` + price label respect hero selection (was always routing to `subscribe/chrome`). Strikethrough now anchors against MSRP `$134.99`.
- **`components/sections/ShowerInlineCTA.tsx`** (new, `58e6a89`): mid-page CTA between Benefits and Honesty. Dynamic price/href via offerStore + `begin_checkout` analytics tagged `source: "inline_cta"`.
- **`HomeProducts` pricing fix** (`a443515`): "From $80" framing, strikethrough now `PRODUCTS.shower.msrp` ($134.99) not `.price` ($107.99). 41% off perception vs old 26%.
- **Save $X badges on plan cards** (`38acf0b`): uppercase `--deep` overline under each price in ShowerHeroV2 plan picker. Subscribe shows "Save $54.99", One-time "Save $27.00".
- **Section cuts** (`012580c`): removed `TikTokProof` + `RitualMoment` from `/shower`. Page goes 14 → 12 sections. Component files kept for revert (see "Killed/superseded routes + components" above for revert recipes).

### ✅ Done in sprint 3 (2026-04-21, afternoon — audit + SEO/GEO)

- **Compliance sweep** (commits `aae9949` + `f76942b`) — purged every remaining "independently tested" / "lab-tested" / "bath filter" leak. Deleted orphan `components/sections/ShowerScience.tsx` (superseded by Interactive). Affected 6 files: `app/layout.tsx` (meta description), `app/shower/page.tsx` (JSON-LD FAQ chloramine), `components/sections/ShowerFAQ.tsx` (visible chloramine FAQ), `components/sections/FilterCutawayInteractive.tsx` (KDF-55 hotspot), `app/about/AboutContent.tsx` (Principle II + "we test what we sell" paragraph).
- **ICP audit 6-item punch list** (`f76942b`):
  - ShowerBenefits: "Six quiet shifts" → "Seven small shifts" (killed "quiet" voice, matched 7-item count)
  - ShowerComparison: added 2 honest Jolie-wins rows (NSF/ANSI 177 cert, 5-color finish range) so the "we'll tell you where competition wins" headline delivers
  - ShowerHeroV2 subhead: 91% stat aligned with Results panel ("calmer skin" → "less acne and skin irritation")
  - Added `id="offer"` to ShowerHeroV2 `<section>` so Nav/Footer/HomeCTA `#offer` anchors work
  - RitualMoment copy: "Water is the quietest ingredient / Make it count" → "Before every serum, every mask / there's the water"
  - Express-pay pills: bumped `h-6 → h-7`, `px-2 → px-2.5`, icons `h-3.5 → h-4` (~14% larger on mobile)
- **HomePromise headline rewrite**: "Water is the quietest ingredient in your routine. Make it count." → "Water is the most overlooked part of your routine. Make it work for you." (+ type size shrunk 10vw/5.5vw → 8.5vw/4.2vw)
- **HomeProducts filter image shrink**: added `compact` prop to `FilterCutawayInteractive`; home desktop uses `aspectRatio: 666/880` (~18% shorter) so the section fits one viewport alongside copy. `/shower` Science interactive uses default tall aspect.
- **Payment brand icons everywhere** — `components/icons/PaymentIcons.tsx` with ApplePay, GooglePay, PayPal, CreditCard inline SVGs. Wired into `/checkout` payment buttons + `/shower` hero express-pay row.
- **SEO/GEO Tier 1 buildout** (9 commits) — see §SEO + GEO section above for the full shipped list.

### ✅ Done in sprint 2 (2026-04-21)
- **ShowerResults consolidation**: merged ShowerBeforeAfter + ShowerStudy into one panel. Layout iterated multiple times → final is headline+subhead+2x2 stats LEFT (col-span-7), comparison images (split from transparent PNG) stacked RIGHT (col-span-5) top-flush with headline.
- **ShowerScienceInteractive**: replaced text-heavy ShowerScience with interactive exploded filter cutaway. Copy: "20-Stage Filtration" overline + "Engineered for how showers actually behave" headline + POV-flip subhead (most filters use drinking-filter chemistry; we built for shower physics: 105°F, 8gpm, 1-sec contact) + "What it won't do" callout.
- **ShowerProblem research-backed**: rewrote with EPA/CDC/EWG framing. "EPA tests your water. No one tests what it does to you." closing. 60 hours/year chlorine math, 9M lead service lines citation.
- **TikTokProof demoted**: moved from position 4 (prime social proof) to position 10 (bottom social cluster). FLO's own TikToks aren't true social proof; the 5M stat is already in BrandCredibility ribbon at position 2.
- **Hero transformed** into the offer: inline plan picker (vertical stacked) + colorway picker + price + Checkout CTA + express-pay badges + thumbnail gallery under main product image. No more scroll-to-offer. SkipToOffer pill removed (moot).
- **/checkout page** added: branded order summary + email capture + Apple Pay/Google Pay/PayPal/Card buttons. Routes to Stripe when configured, Amazon fallback. Dev-only "not set up yet" notice hidden from prod via NODE_ENV check.
- **FLO asset library wired** (9 files from 2026-04-21 drop): comparison-clean, illus-hair/skin/portrait, product-black-clean, lifestyle-shower-happy, icon-face/follicle/droplet.
- **StudyIcons** swapped 3 of 4 to PNG icons (with `dark` prop for invert-on-dark-surface).
- **AmazonReviewsGrid** replaced ShowerReviews: 6 realistic placeholder review cards with Verified badges, helpful counts, one with customer photo. One review rewritten to echo the winning TikTok ad ("No regular shower head" opening).
- **Home hero trust strip cleaned**: removed "Independently lab-tested" + "Prop 65 compliant brass"; swapped in "100,000+ orders shipped" as lead item.
- **Logo swap**: FLO wordmark PNG in Nav (adaptive invert) + Footer (always inverted white). Fixed pre-existing readability issue over dark hero.
- **AnnouncementBar polished**: removed dismiss button per request, added per-message line-art icons, subtle moving sheen, dot-pagination on left.
- **HomeProducts**: static cutaway → FilterCutawayInteractive (4 hover hotspots + SVG connecting lines + expandable labels).
- **FilterCutawayInteractive** upgraded to use `filter-exploded-cutaway.png` (chrome top + cartridge w/ visible bands + chrome base + water swirl) with recalculated hotspot Y positions.
- **Five surgical voice-match copy edits** from winning TikTok transcript: hero subhead "chemicals customers say were drying their hair"; Alyssa M. review rewrite; HomeCTA "Pure water for a pure you"; 7th benefit "Modern, classy design"; Problem agitation line.

### ✅ Done in sprint 1 (2026-04-20)
- Checkout routing: `NEXT_PUBLIC_CHECKOUT_MODE=amazon/stripe/shopify`
- Fake press logos removed (cut `ShowerProof` entirely)
- Water quality report popup
- SEO: sitemap.ts, robots.ts, Product + FAQ + Organization JSON-LD
- OG image wired
- `BrandCredibility` lifted to position 2
- `RitualMoment` slotted between Benefits and Science

### 🔴 Still blocking launch
- **Stripe Payment Links** — Youssef sets up Stripe + creates 4 payment links + pastes URLs into env vars + flips `CHECKOUT_MODE=stripe`. Site auto-routes from Amazon to Stripe checkout the moment env vars are set.
- **Amazon MCF** — Youssef enables Multi-Channel Fulfillment in Seller Central so Stripe orders ship from FBA inventory.
- **Real Amazon reviews** — see "How to swap real reviews" below. AmazonReviewsGrid component currently has 6 realistic placeholder reviews that look authentic but are inventions.
- **Analytics pixel IDs** — user to grab from GA4, Meta, TikTok → drop into Vercel env vars. All events already wired (`shop_now_hero`, `plan_switch`, `color_switch`, `begin_checkout`, `faq_expand`, `tiktok_click`, `water_report_lead`, `scroll_depth`).
- **Domain wire** — point `feelslikeom.com` or similar at Vercel project.
- **Water report endpoint** — `NEXT_PUBLIC_WATER_REPORT_ENDPOINT` is empty; popup shows success state but doesn't persist email. Pick Formspree/Klaviyo/custom API, set the env var.

### 📋 How to swap real Amazon reviews

1. Amazon Seller Central → Brand Analytics → Review Insights → export top reviews CSV
2. For each review you want to feature, capture: stars, reviewer first-name+last-initial, review date, review title, review body, and any customer-uploaded photo URL
3. Open `components/sections/AmazonReviewsGrid.tsx` and replace the `REVIEWS` array with the real data, keeping the same shape (stars, verified, name, date, title, body, image?, helpful?)
4. Aim for 6 reviews mixing 5-star + 1 four-star review (all 5s reads cherry-picked); include 1-2 with customer photos for visual variety
5. Update the count in the section footer ("Showing 6 of 1,400+...") to match real review total

### 📋 How to add UGC TikToks

1. Find 1-3 customer TikToks mentioning FLO (search TikTok for `@feelslikeom` mentions or relevant hashtags)
2. Get the full URL of each video
3. Drop URLs into Vercel env vars: `NEXT_PUBLIC_UGC_TIKTOK_1`, `_2`, `_3`
4. CustomerUGC section auto-appears on `/shower` once at least one URL is set; auto-hides when all empty

### 🟠 High-value polish (or pending clarification)
- **Image optimization** — ✅ SHIPPED sprint 3. `unoptimized: false`, formats avif+webp served by Vercel, responsive srcset, native lazy-load. Hero JPGs go from 3MB → ~200KB.
- **Real hero product shot** — Youssef's graphic designer is supplying cleaner product photography. Current chrome hero uses `product-white-composite.jpg` (composite w/ packaging + splash). When clean shot lands, swap via one-line src change in ShowerHeroV2 and home.
- **Clean black product** — `product-black-clean.png` exists in public/ but HELD from use per Youssef until he delivers his organized "listing images" folder.
- **Review count "1,400+"** — hardcoded in multiple places (hero star strip, AmazonReviewsGrid header, ProductSchema aggregateRating). Match to Amazon's actual live review count when we swap real reviews.
- **"95% chlorine reduction" claim** — ✅ SWEPT in sprint 3 compliance purge. Was in `FilterCutawayInteractive.tsx` KDF-55 hotspot; replaced with "The workhorse of our stack — most of the chlorine reduction happens here." No numeric claim now.
- **Venice, CA / 2022 founding story** — 🟡 **confirm with Youssef before ad spend scales.** Currently in `app/about/AboutContent.tsx:88` ("started in a bathroom in Venice, California, in 2022") AND in `OrganizationSchema` (address.addressLocality "Venice", foundingDate "2022"). Originally written by Codex during sprint 1 — may be fiction. Options: (a) confirm true → leave, (b) swap to real founding city/year, (c) remove from schema + /about copy entirely. Low-urgency but flagged to avoid future trust issues.
- **Compliance landmines NOT pulled from Amazon listing** — "water softener shower head system," "removes 99% of chlorine," "toxic chemicals and harmful contaminants," "restore pH balance," "watch your hair and skin thrive." All FTC-flagged in `/research/benchmarks-compliance.md`. Do NOT port these from Amazon copy even if tempting.
- **Superlative claims in llms.txt / meta** — avoid "best," "#1," "number one," "leading" without substantiation. LLMs discount puffery; FTC flags unsupported superlatives. Use scoped factual claims instead ("100,000+ orders shipped since 2022", "4.8★ across 1,400+ Amazon reviews", "20-stage — deepest in the category").

### 🟡 Nice-to-have
- Accessibility audit (contrast ratios on mist/bone backgrounds, keyboard nav on colorway swatches + offer plan cards, screen-reader coverage on animated sections)
- Video testimonials embedded (real customer TikToks reacting to FLO, beyond the 3 FLO-owned ads already embedded)
- Quiz flow ("What's your biggest water issue?" → personalize offer) — 4–6 hr scope
- A/B tests via Vercel flags (hero headline, CTA copy, offer order)

**Launch readiness:** ~90% after this sprint. Critical path remaining = real reviews + analytics IDs + domain + water-report backend endpoint. All four are user-dependent, not code-dependent.

---

## Preferences + partner mode

- **Decisions over questions.** If something is reversible, Codex should make the call. Confirm only on destructive or expensive moves.
- **Speed over polish on first pass.** Ship, show, iterate.
- **Listen when Youssef redirects.** He has strong instincts on imagery and branding — trust them.
- **Vercel CLI is flaky.** Default to `git push` — the GitHub → Vercel integration auto-deploys, takes ~30s.
- **Deploy verification:** curl the live URL for a unique string from the new commit (filename, headline). Don't trust "it pushed" alone.

---

## Research references

- `research/benchmarks-compliance.md` — conversion benchmarks (1.5–2.5% cold CVR target, 2.5x ROAS), full claim matrix, certification guide, Prop 65 boilerplate
- External: [Jolie](https://jolieskinco.com) for category vernacular, [AGENTS.md one level up](../AGENTS.md) for RAAR playbook inspiration (kept as reusable pattern), [Workspace master AGENTS.md](../../AGENTS.md) for Youssef's ventures overview

---

## Sensitive note

Gemini API key `AIzaSyBYGPK...` was used during image-gen experiments on 2026-04-20. **Youssef should rotate this key** at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Flagged in-session but confirming here.
