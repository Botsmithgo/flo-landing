# FLO social preview and contact — September 12, 2026

- [x] Replace homepage/product/story shared-link artwork with branded 1200×630 product card.
- [x] Build responsive contact page and connect navigation/footer/FAQ.
- [x] Set contact recipient to caniprojectllc@gmail.com.
- [x] Implement FormSubmit delivery with honest failure handling and an email-draft fallback.
- [x] Trigger receiving-inbox activation email (provider confirmed activation required).
- [ ] User: click FormSubmit “Activate Form” in caniprojectllc@gmail.com.
- [ ] After activation: verify setup-test submission and receipt, set CONTACT_FORM_ENABLED=true, redeploy.
- [x] Verify production rollout: 68b8e29, live domain /contact and social metadata checked.

Separate existing SEO work is preserved in flo-background-deploy at 370c806 and is not included here.

- [x] September 14: homepage guarantee/shipping/installation strip deployed and visually checked (4b9c68e).

## Storefront conversion release — September 14, 2026

- [x] Set the eligible first-order storefront price to $80 with $54.99 savings from $134.99.
- [x] Default cold traffic to one-time purchase; keep subscription opt-in.
- [x] Show subscription terms as $80 today and $39 every six months.
- [x] Add persistent mobile checkout, Klarna/Amazon Pay trust marks, and checkout email expectations.
- [x] Publish shipping, returns, privacy, terms, and order-confirmation routes.
- [x] Replace categorical hard-water claims with filtration and water-conditioning expectations.
- [x] Reorder `/shower`: consumer study/before-and-after → 20-stage filtration → water context.
- [x] Pass ESLint and production build.
- [x] Deploy commits `1f58cf5` and `3f84f4b` to `main`; verify public routes and live section order.
- [ ] Stripe: replace `WELCOME20` with a fixed $54.99 offer that produces an exact $80 total.
- [ ] Stripe: align subscription billing to $80 today and $39 every six months.
- [ ] Stripe: apply Feels Like Om branding, live customer portal, receipts, policies, and `/order-confirmed` redirect.
- [ ] TikTok: verify purchase attribution through Stripe webhooks/Events API before routing paid traffic to the website.
