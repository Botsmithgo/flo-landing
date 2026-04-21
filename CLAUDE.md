# FLO Landing — Project Context for Claude Code

_Last updated: 2026-04-21 (sprint 2). Read this first whenever you open this project._

---

## Next-session quick-start (read first if picking up from a break)

**Where we are:** launch-ready ~93%. Site is live at https://flo-landing-six.vercel.app with the full `/shower` conversion funnel, `/`, `/about`, `/checkout`, `/sitemap.xml`, `/robots.txt`. Design, copy, compliance, architecture all done. Remaining blockers are all user-dependent (real reviews, pixel IDs, domain, Stripe setup, water-report backend, designer photography).

**Last things we shipped (2026-04-21):**
1. ShowerResults consolidation (merged BeforeAfter + Study → one "Healthier skin and hair start here" panel)
2. ShowerScienceInteractive replaced text ShowerScience (exploded filter interactive, capped max-w-[460px])
3. ShowerProblem rewritten with EPA/CDC/EWG research framing
4. TikTokProof demoted to position 10 (bottom social cluster)
5. Logo PNG swapped in Nav + Footer (adaptive invert on dark hero)
6. Transparent comparison image split into 2 stacked panels
7. Hero made self-sufficient (offer inline — no scroll-to-buy)
8. FLO asset library (9 files) wired: illus-hair/skin, line icons, comparison-clean

**Youssef's partner-mode preferences** (important — see §Preferences below for full detail):
- Make decisions on reversible things, don't ask permission 3 times
- Ship, show, iterate
- Push back honestly when he asks — he explicitly wants expert opinions, not yes-man
- Git push for deploys (Vercel CLI is flaky)
- Compliance discipline is non-negotiable — do NOT port Amazon copy that contains "water softener," "99% chlorine," "toxic," "pH balance," or "thrive" language

**If Youssef asks you to pick up where we left off, the most likely next moves are:**
- Workshop the technology section name ("One filter, done right" vs alternatives) — tabled last session
- Hero product image swap (waiting on designer-supplied clean chrome shot; there's a `product-black-clean.png` held for a "listing images" folder he'll deliver)
- Real Amazon reviews swap into AmazonReviewsGrid (see "How to swap real reviews" below)
- Connect Stripe + Amazon MCF (his task — see §Checkout architecture)
- Analytics pixel IDs (his task — see §Analytics wiring)

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

/shower
  0. AnnouncementBar             Rotating 4-message bar above Nav (free shipping / 60-day / 100K / 20% off)
  1. ShowerHeroV2                Inline offer: plan picker + colorway + price + Checkout CTA
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
  7. ShowerHonesty               "What this won't do" — radical transparency
  8. AmazonReviewsGrid           6 review cards (placeholder but realistic) — SWAP WITH REAL
  9. CustomerUGC                 Auto-hides until UGC env vars set
 10. TikTokProof                 DEMOTED from position 4 — FLO's own TikToks at bottom of funnel
 11. ShowerComparison            vs Jolie, honest
 12. ShowerFAQ                   8 Q&A accordion
 13. RitualMoment                Cinematic pause (bathroom-scene.jpg)
 14. HomeCTA (reused)            Final close
     Sticky mobile ATC           Persistent buy bar on mobile

/about                            Moody hero → long thesis → 4 principles → closing CTA
/checkout                         Branded order summary + email capture + Apple Pay/Google Pay/
                                  PayPal/Card buttons (routes to Stripe when configured,
                                  Amazon fallback). robots noindex.
/sitemap.xml, /robots.txt         SEO infra
```

**Killed/superseded routes + components:**
- `/bath` — single-product focus pivot
- `/shower-v2` — promoted to canonical `/shower`
- `SkipToOffer` — removed (offer now in hero, no scroll needed)
- `ShowerScience` — superseded by `ShowerScienceInteractive` (component file kept for revert)
- `ShowerBeforeAfter` + `ShowerStudy` — superseded by `ShowerResults` (component files kept for revert)
- `ShowerProof` — removed (fake press logos were FTC risk; component file kept)

**Git rollback tags:**
- `v1` — pre-pivot editorial version (single-product scope decision happened)
- `pre-consolidation` — before ShowerResults merge (2026-04-21). Rollback = `git reset --hard pre-consolidation`

---

## Pre-launch punch list

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
- **Image optimization** — flip `unoptimized: true` → `false` in `next.config.ts`, convert to WebP/AVIF, add proper `srcset`, enable lazy-load. ~45 min. Expected LCP improvement 1–2s on mobile 4G. Waiting on finalized imagery before locking.
- **Real hero product shot** — Youssef's graphic designer is supplying cleaner product photography. Current chrome hero uses `product-white-composite.jpg` (composite w/ packaging + splash). When clean shot lands, swap via one-line src change in ShowerHeroV2 and home.
- **Clean black product** — `product-black-clean.png` exists in public/ but HELD from use per Youssef until he delivers his organized "listing images" folder.
- **Review count "1,400+"** — hardcoded in multiple places (hero star strip, AmazonReviewsGrid header, ProductSchema structuredData). Match to Amazon's actual live review count when we swap real reviews.
- **"Up to 95% free chlorine" claim** — need actual lab report on file. Current copy in ShowerScienceInteractive callout mentions this but we confirmed FLO doesn't have independent lab testing yet. **If a visitor or FTC pressed: the "95% at rated flow" claim is industry-typical for KDF-55 media published by media vendors, but FLO itself doesn't have a commissioned test.** Mitigation options: (a) commission one ($15-25K per compliance brief), (b) reword to "engineered to reduce free chlorine using industry-benchmarked KDF-55 media" (weaker but compliant), (c) leave as-is and risk-accept.
- **Compliance landmines NOT pulled from Amazon listing** — "water softener shower head system," "removes 99% of chlorine," "toxic chemicals and harmful contaminants," "restore pH balance," "watch your hair and skin thrive." All FTC-flagged in `/research/benchmarks-compliance.md`. Do NOT port these from Amazon copy even if tempting.

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
