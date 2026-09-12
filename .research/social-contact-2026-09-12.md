# FLO sharing preview and contact page — September 12, 2026 (PST)

## Scope and design
User requested a cooler shared-link preview and a contact page delivering messages to caniprojectllc@gmail.com. Existing deployment authorization applies. Work isolated in `flo-contact-social` from production 6274d60 because `flo-background-deploy` contains a separate unpushed SEO commit (370c806). That work is preserved.

Branded 1200×630 PNG: original approved studio product photograph, cream/navy, existing FLO wordmark, “Your daily reset.” Photo itself is unmodified. The image URL is versioned to avoid stale image caches. Homepage, shower, story and contact metadata use a single shared image definition. Existing messages may retain cached link previews; send a fresh URL with `?share=om2` to prompt a new fetch.

Contact: same Fraunces / Inter Tight typography; cream/mist layout; fixed recipient; name, email, topic, optional order number and message. HTML validation and length limits, a honeypot, request timeout, pending state, accessible status and retained inputs on failure. Success requires HTTP success AND a provider success flag (boolean true or string "true"). No modal lead magnet interrupts the contact page. Navigation, footer and shower FAQ link to /contact; FAQ anchor added; business contact metadata aligned.

## Email setup
Vercel production had no email provider configured. FormSubmit was initially unreachable, then recovered. A setup-only POST to the documented AJAX endpoint for caniprojectllc@gmail.com returned:
`{"success":"false","message":"This form needs Activation. We've sent you an email containing an 'Activate Form' link. Just click it and your form will be actived!"}`

User was asked asynchronously to activate that email. Do not call this delivered. `CONTACT_FORM_ENABLED` remains false/unset until activation and verification. While pending, the page honestly offers “Continue in email” and opens a prefilled mailto draft. It never says this draft was sent. Once activated, verify the provider accepts a labeled setup test and ask for inbox receipt; set CONTACT_FORM_ENABLED=true on Vercel and redeploy. The enabled form sends directly through FormSubmit to the fixed business recipient; email sets Reply-To. Provider handles spam filtering; no account API secret is exposed. No paid service purchased. A researched Web3Forms fallback was not used or registered.

## Sources
- https://nextjs.org/docs/app/getting-started/metadata-and-og-images — sharing image metadata and ImageResponse
- https://formsubmit.co/ajax-documentation — browser-side JSON submission API
- https://formsubmit.co/documentation — email Reply-To, subject, honeypot and form URL
- https://formsubmit.co/help — activation required before messages reach inbox

## Verification
- Production build and TypeScript passed.
- Focused ESLint passed via local flat-config audit file (existing repository lint config uses incompatible FlatCompat; not changed in this task).
- Four pages return HTTP 200; OG and Twitter image URLs agree; image returns image/png and 1200×630 dimensions.
- Contact included in sitemap; FAQ anchor resolves.
- Browser required-field test focuses name and marks name/email/message invalid without sending.
- Desktop visual review passed. Phone-width Lighthouse results saved beside this report; fixed contact button contrast using brand deeper blue.
- Original homepage hero, global button sizing, iconography, checkout and Stripe files remain unchanged.

## Rollback
Revert only the social/contact commit and push. Previous assets remain in public/product. The separate SEO commit is not included. The CONTACT_FORM_ENABLED environment flag can disable direct submission in the next build while retaining the working email-draft fallback.
