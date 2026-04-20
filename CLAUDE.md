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

## The ONE critical blocker

**Checkout is broken.** `lib/checkout.ts` builds Shopify cart permalinks like `feelslikeom.shop/cart/:1` but:
- There's no Shopify store set up yet
- `NEXT_PUBLIC_SHOPIFY_VARIANT_SHOWER_SINGLE` and `_SUBSCRIPTION` env vars are empty

**Approved path forward (pending Youssef confirmation):** point every "Add to cart" to the Amazon listing at `https://www.amazon.com/dp/B0DHJ74TCC` until Shopify is live. Add `NEXT_PUBLIC_CHECKOUT_MODE=amazon` env var + branch in `buildCheckoutUrl()`.

When Shopify is live, set `CHECKOUT_MODE=shopify` + populate variant IDs. Zero code change needed.

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
- **Real testimonials** — replace placeholders ("Jenna K." etc.) with real Amazon review export. 30 min once user sends CSV.
- **Analytics pixel IDs** — user to grab from GA4, Meta, TikTok → drop into Vercel env vars → I wire events (`water_report_lead`, `begin_checkout`, etc.)
- **Domain wire** — point `go.feelslikeom.shop` or `www.feelslikeom.com` at Vercel project
- **Water report endpoint** — `NEXT_PUBLIC_WATER_REPORT_ENDPOINT` is empty; popup shows success state but doesn't persist. Pick Formspree/Klaviyo/custom API, set the env var.

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
