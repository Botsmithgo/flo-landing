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

## Pre-launch punch list (priority order)

1. 🔴 **Decide checkout path** (Amazon redirect recommended) — 5 min to wire
2. 🔴 **Replace placeholder testimonials with real Amazon reviews** — mine top 6 + objections, 30 min
3. 🔴 **Verify or remove press logos** ("Vogue, Byrdie, Allure" etc in `ShowerProof`) — FTC risk if fake
4. 🟠 **Analytics pixel IDs** (Youssef's task) — 15 min, then I wire events
5. 🟠 **Exit-intent email capture popup** — 45 min to build
6. 🟠 **Domain wire** (e.g., `go.feelslikeom.shop` or `www.feelslikeom.com`) — 10 min once decided
7. 🟡 **Real hero product shot** (designer, not Claude) — out of my hands
8. 🟡 **Sitemap + robots.txt + real OG image** — 20 min
9. 🟡 **Accessibility pass** (contrast, alt, keyboard nav) — 30 min
10. 🟡 **Verify "Independently lab-tested" / "up to 95% free chlorine" claims** — need actual lab report or swap copy

**Total launch-ready time: ~3–4 hours** (items 1–6 are the critical path).

**Confidence check at this writing: 75% launch-ready.** Brand, design, copy are done. Plumbing (checkout, analytics, real testimonials, domain) is the gap.

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
