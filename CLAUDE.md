# FLO Landing — Project Context for Claude Code

_Last updated: 2026-04-20. Read this first whenever you open this project._

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
- **Shopify checkout permalinks** via `lib/checkout.ts` (currently broken — see blockers)
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

Real product imagery lives in `public/product/`:

```
public/product/
├── hero-lifestyle.jpg         # Moody woman-in-shower shot
├── hair-lifestyle.jpg         # Smiling woman with healthy hair (founder section)
├── filter-cutaway.png         # 20-stage filter cross-section (HomeProducts)
├── product-white-composite.jpg  # Chrome + packaging + splash
├── product-black-composite.jpg  # Black + packaging + splash
├── product-white-face.jpg     # Chrome face-on with trust badges
├── product-black-face.jpg     # Black face-on with trust badges
├── product-bathroom.jpg       # M1 — product tilted in luxe bathroom (has "Beauty Tool" text in corner)
├── before-after.jpg           # Real hair + acne before/afters (M2 from Amazon A+)
├── dimensions.jpg             # 134mm × 140mm spec shot
├── install-guide.jpg          # 3-step install infographic
├── lifestyle-triptych.jpg     # 3-panel shower lifestyle
├── install-glowup.jpg         # "Instant Glow-Up" A+ panel
├── bathroom-scene.jpg         # AI-GENERATED empty luxe bathroom (Gemini Nano Banana Pro)
├── bathroom-with-product.jpg  # AI composite — bad, product floats
├── ritual-mounted.jpg         # AI composite v2 — head too flat
└── ritual-mounted-v3.jpg      # AI composite v3 — better but not fidelity-accurate
```

**Photography policy (agreed 2026-04-20):** Youssef owns imagery. Gen AI (Gemini Nano Banana Pro / 2) was tried 3× for product-in-bathroom composite — got close but never fidelity-accurate to the real product. Graphic designer will handle. **Do not regenerate images without being asked.**

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

## Site architecture

```
/                   Home: Hero → Promise → Products spotlight (cutaway) → Founder (hair) → Testimonials (illustrated study) → CTA
/shower             Full funnel: Hero → Proof strip → TikTok proof → Problem → 4-week study → Brand credibility ribbon → Before/After → Offer (w/ colorway) → Benefits → Science → Reviews → Comparison → FAQ → CTA + Sticky mobile ATC
/about              Founder story → long-form thesis → 4 principles → closing CTA
```

**Killed routes:** `/bath` (single-product focus pivot), `/shower-v2` (v2 promoted to canonical `/shower`).

**Git tag `v1`** preserves the pre-pivot editorial version. `git checkout v1` to restore.

---

## Pre-launch punch list

### ✅ Done in latest sprint
- Checkout routing: `NEXT_PUBLIC_CHECKOUT_MODE=amazon` now returns Amazon listing; flip to `shopify` + populate variant IDs when ready
- Fake press logos removed (cut `ShowerProof` entirely — component file kept in repo)
- Water quality report popup (email + zip capture, 12s timer + exit-intent, value-forward not discount-forward)
- SEO infrastructure: `app/sitemap.ts`, `app/robots.ts`, Product + FAQ + Organization JSON-LD via `components/StructuredData.tsx`
- OG image wired to `bathroom-scene.jpg` in root metadata
- Skip-to-offer floating pill on `/shower` (desktop only, visible between hero and offer)
- `BrandCredibility` lifted to position 2 on `/shower` (right after hero)
- `RitualMoment` (clean bathroom, no product) slotted between Benefits and Science

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

### 🟠 High-value polish
- **Image optimization** — logged for when final images are locked in. Flip `unoptimized: true` → `false` in `next.config.ts`, convert to WebP/AVIF, add proper `srcset`, enable lazy-load on below-fold. ~45 min. Expected LCP improvement 1–2s on mobile 4G.
- **Real hero product shot** — Youssef owns this (designer workflow). Current hero uses `bathroom-scene.jpg` (AI-generated clean bathroom); swap to designer composite when ready, no code change needed beyond image path.
- **Verify review count "1,400+"** — match the actual number on Amazon + Shopify listings (currently hardcoded in multiple places).
- **Verify "up to 95% free chlorine" + "independently lab-tested"** — need actual lab report name on file, or swap copy to softer claim per `/research/benchmarks-compliance.md`.

### 🟡 Nice-to-have
- Accessibility audit (contrast ratios on mist/bone backgrounds, keyboard nav on colorway swatches + offer plan cards, screen-reader coverage on animated sections)
- Video testimonials embedded (real customer TikToks reacting to FLO, beyond the 3 FLO-owned ads already embedded)
- Quiz flow ("What's your biggest water issue?" → personalize offer) — 4–6 hr scope
- A/B tests via Vercel flags (hero headline, CTA copy, offer order)

**Launch readiness:** ~90% after this sprint. Critical path remaining = real reviews + analytics IDs + domain + water-report backend endpoint. All four are user-dependent, not code-dependent.

---

## Preferences + partner mode

- **Decisions over questions.** If something is reversible, Claude should make the call. Confirm only on destructive or expensive moves.
- **Speed over polish on first pass.** Ship, show, iterate.
- **Listen when Youssef redirects.** He has strong instincts on imagery and branding — trust them.
- **Vercel CLI is flaky.** Default to `git push` — the GitHub → Vercel integration auto-deploys, takes ~30s.
- **Deploy verification:** curl the live URL for a unique string from the new commit (filename, headline). Don't trust "it pushed" alone.

---

## Research references

- `research/benchmarks-compliance.md` — conversion benchmarks (1.5–2.5% cold CVR target, 2.5x ROAS), full claim matrix, certification guide, Prop 65 boilerplate
- External: [Jolie](https://jolieskinco.com) for category vernacular, [CLAUDE.md one level up](../CLAUDE.md) for RAAR playbook inspiration (kept as reusable pattern), [Workspace master CLAUDE.md](../../CLAUDE.md) for Youssef's ventures overview

---

## Sensitive note

Gemini API key `AIzaSyBYGPK...` was used during image-gen experiments on 2026-04-20. **Youssef should rotate this key** at [aistudio.google.com/apikey](https://aistudio.google.com/apikey). Flagged in-session but confirming here.
