# Feels Like Om website paid-traffic audit

## Verdict

The website is potentially a better TikTok destination than the Amazon listing with a frequently returned warning, but it should not receive paid traffic in its current state. The product page is strong; checkout and policy continuity are not.

## Critical blockers

1. The one-time product page promises $107.99 with an automatic 20% discount, but live Stripe checkout displays $134.99.
2. The product page says subscription filters ship every six months; live Stripe checkout charges $39 every three months.
3. The customer subscription-management link opens a Stripe sandbox portal.
4. Shipping and returns links both return 404 pages.
5. Checkout identifies the merchant as “The cani project llc,” not Feels Like Om.
6. No completed-purchase TikTok event was found in the local implementation. Checkout occurs on Stripe, so outbound checkout clicks alone do not give TikTok the signal required to optimize for sales.

## Secondary issues

- The first mobile screen does not expose price or CTA.
- Checkout descriptions contain inconsistent claims and a “0-stage” typo.
- Storefront payment marks omit Klarna and Amazon Pay despite availability.
- Support email identity changes between the footer and contact page.

## Recommended launch sequence

1. Correct one-time pricing and confirm the discount visibly applies before the buyer enters information.
2. Align subscription billing and shipping cadence everywhere.
3. Replace the sandbox portal with the live customer portal.
4. Publish real shipping and return policy pages.
5. Brand Stripe checkout as Feels Like Om and align product descriptions with the storefront.
6. Implement and test TikTok CompletePayment using a success page plus server-side Stripe webhook/Events API where possible.
7. Add TikTok UTMs and use `/shower` as the destination.
8. Launch a separate website-sales test without splitting the current $20 daily budget. Compare verified CPA and contribution profit against TikTok Shop.

## Traffic recommendation

Continue the existing TikTok Shop campaign at its current budget while the website funnel is repaired. After verification, test the website as a separate destination. Do not send traffic to the Amazon page while the warning badge remains unless Amazon conversion data shows it still outperforms the repaired website.
