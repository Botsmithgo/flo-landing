## 2026-09-12 | Contact delivery | Activation is not delivery

**Problem:** An email form service can accept a setup request without delivering customer messages.
**Root Cause:** FormSubmit requires inbox activation and returns `success` as a string; treating the string "false" as truthy would falsely report success.
**Solution:** Accept only boolean true or string "true" with a successful HTTP status. Keep the email-draft fallback active until the receiving inbox is verified.
**Prevention:** Verify activation and inbox receipt separately; never mark a mailto draft or activation email as a delivered contact message.
**Tags:** #forms #email #verification

## 2026-09-14 | Checkout | Treat hosted checkout as part of the product

**Problem:** The storefront advertised one price and subscription cadence while the live Stripe Payment Links displayed different terms. A first-time-only promotion also looked enforceable in the site code but was not reliable for one-time Payment Links.
**Root Cause:** Price, cadence, branding, portal mode, and post-payment behavior lived outside the repository. Stripe creates guest customers for one-time Payment Links, so first-time-order promotion restrictions do not work as expected across repeat purchases.
**Solution:** Make offer values explicit in the storefront, use a fixed $54.99 discount for an exact $80 total, add a branded success route and policy routes, and block deployment until every live Payment Link is checked against the page. Use server-created Checkout Sessions if strict returning-customer enforcement is needed.
**Prevention:** Include hosted-checkout screenshots and payment-link settings in every launch checklist. Verify final charged price, cadence, email receipt, merchant identity, live portal, success redirect, and purchase attribution before sending paid traffic.
**Tags:** #stripe #checkout #cro #pricing #payment-links
