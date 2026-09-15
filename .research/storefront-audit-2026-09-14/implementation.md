# Storefront implementation — 2026-09-14

## Production release

Deployed to `main` through commits `1f58cf5` and `3f84f4b` on September 14, 2026. The public site at `https://www.feelslikeom.shop` was verified after rollout: homepage, `/shower`, `/order-confirmed`, and all four policy routes return successfully. The live accessibility tree confirms the requested `/shower` order: customer study and before/after proof, 20-stage filtration, then water context.

The release publishes the storefront presentation and trust fixes. Paid website traffic remains blocked until Stripe is aligned: the live CTA still pre-fills `WELCOME20`, so Stripe does not yet match the advertised exact $80 first-order total or the six-month subscription terms.

## Product decision

- Send paid traffic to `/shower`, not the homepage. The product page carries the ad promise directly into price, proof, objections, and checkout.
- Make the one-time first order the default selection for cold traffic. Subscription remains an explicit customer choice.
- Offer eligible new customers an exact first-order total of **$80** from the $134.99 list price. The exact discount is **$54.99** (40.74%); a literal 40% discount would total $80.99.
- Require the normal checkout email for receipts and order updates. Do not require an account or password before purchase. Marketing consent remains optional and unchecked.

## Implemented in the website

- Updated first-order pricing and savings everywhere to $80 / $54.99.
- Changed the default offer from subscription to one-time purchase.
- Clarified the subscription as $80 today, then $39 every six months, with skip/cancel language.
- Added Klarna and Amazon Pay to the payment trust row.
- Added an always-visible mobile checkout bar.
- Added shipping, returns, privacy, terms, and branded order-confirmation pages.
- Removed the sandbox billing portal from the footer unless a live URL is configured.
- Hid the water-report popup when no functioning endpoint exists; added optional marketing consent and removed email/ZIP values from ad analytics.
- Reframed hard-water copy around filtration plus water-conditioning media, mineral buildup, and variable local water chemistry.
- Repaired the ESLint 9 configuration and mobile navigation close behavior.

## Stripe launch gate

The site should stay off production until all four Payment Links match the storefront.

1. Create `WELCOME40` as a **fixed $54.99 discount**, not a 40% percentage coupon.
2. Enable promotion codes on both one-time Payment Links and confirm the URL-prefilled code displays an $80 total before customer information is entered.
3. Set the subscription to $80 for the shower head and first filter, then $39 every six months. If Stripe Payment Links cannot represent that billing model cleanly, use a server-created Checkout Session or a subscription schedule before advertising it.
4. Redirect successful payments to `https://www.feelslikeom.shop/order-confirmed` and enable email receipts.
5. Brand Checkout, receipts, and the live customer portal as Feels Like Om; add the published support and policy URLs.
6. Replace `NEXT_PUBLIC_FIRST_ORDER_DISCOUNT=WELCOME20` with `WELCOME40` only after the new code exists.

## First-time eligibility limitation

Stripe documents that one-time Payment Links create guest customers by default, so promotion codes restricted to first-time orders do not work as expected. For this low-volume launch, use the exact $80 Payment Link offer and reasonable redemption limits. If repeat-code abuse becomes material, replace Payment Links with a server-created Checkout Session that identifies the customer before applying the discount.

## TikTok phase

- Redirect checkout back to the new order-confirmation page.
- Add verified purchase attribution through Stripe webhooks and TikTok Events API; do not treat an outbound checkout click as a purchase.
- Preserve UTM parameters through Stripe and compare website contribution profit against TikTok Shop in a separate ad group.

## Verification

- `npm run lint` passes.
- `npm run build` passes with all 15 static routes generated.
- Production build was checked locally for offer selection, checkout URLs, policy routes, navigation, and the order-confirmation page.
