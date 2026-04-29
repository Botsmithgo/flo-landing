/**
 * Checkout URL builder.
 *
 * NEXT_PUBLIC_CHECKOUT_MODE controls the destination:
 *   - "stripe"  → direct to Stripe Payment Link per variant (recommended — keeps customer)
 *   - "shopify" → Shopify cart permalink (if Shopify store exists)
 *   - "amazon"  → Amazon listing (fallback; loses customer attribution)
 *
 * Stripe Payment Links are created in Stripe Dashboard → Payment Links, one per variant,
 * configured with Subscribe & Save on / off, colorway, discount. Paste URLs into env vars.
 */

export type CheckoutVariant = {
  plan: "single" | "subscribe";
  color: "chrome" | "black";
};

export type CheckoutOptions = {
  variantId?: string | number;
  quantity?: number;
  discount?: string;
  sellingPlan?: string;
  attributes?: Record<string, string>;
  variant?: CheckoutVariant; // for Stripe mode routing
};

const AMAZON_URL =
  process.env.NEXT_PUBLIC_AMAZON_URL ??
  "https://www.amazon.com/dp/B0DHJ74TCC";

function stripeLinkFor(variant: CheckoutVariant): string | undefined {
  const { plan, color } = variant;
  // Next.js can only inline NEXT_PUBLIC_* vars when accessed STATICALLY at build
  // time. Dynamic bracket access (process.env[key]) returns undefined in the
  // browser bundle and silently falls through to Amazon, which we just shipped
  // and caught. Keep these as a static switch — one branch per variant.
  if (plan === "subscribe" && color === "chrome") return process.env.NEXT_PUBLIC_STRIPE_LINK_SHOWER_SUBSCRIBE_CHROME;
  if (plan === "subscribe" && color === "black")  return process.env.NEXT_PUBLIC_STRIPE_LINK_SHOWER_SUBSCRIBE_BLACK;
  if (plan === "single"    && color === "chrome") return process.env.NEXT_PUBLIC_STRIPE_LINK_SHOWER_SINGLE_CHROME;
  if (plan === "single"    && color === "black")  return process.env.NEXT_PUBLIC_STRIPE_LINK_SHOWER_SINGLE_BLACK;
  return undefined;
}

export function buildCheckoutUrl(opts: CheckoutOptions): string {
  const mode = process.env.NEXT_PUBLIC_CHECKOUT_MODE ?? "amazon";

  // STRIPE: direct to Payment Link for the selected variant.
  // For "single" (one-time) plan, auto-apply WELCOME20 first-order coupon
  // so the buyer sees $107.99 at checkout (20% off $134.99). Subscribe
  // already gets a deeper discount built into the Payment Link price.
  if (mode === "stripe" && opts.variant) {
    const link = stripeLinkFor(opts.variant);
    if (link) {
      const code = process.env.NEXT_PUBLIC_FIRST_ORDER_DISCOUNT;
      if (opts.variant.plan === "single" && code) {
        const sep = link.includes("?") ? "&" : "?";
        return `${link}${sep}prefilled_promo_code=${encodeURIComponent(code)}`;
      }
      return link;
    }
    // If Stripe link missing for this variant combo, fall through to Amazon
  }

  // AMAZON: direct to the Amazon listing
  if (mode === "amazon") {
    return AMAZON_URL;
  }

  // SHOPIFY: build cart permalink from variant IDs
  if (mode === "shopify" && opts.variantId) {
    const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN ?? "feelslikeom.shop";
    const qty = opts.quantity ?? 1;
    const params = new URLSearchParams();
    if (opts.discount) params.set("discount", opts.discount);
    if (opts.sellingPlan) params.set("selling_plan", opts.sellingPlan);
    if (opts.attributes) {
      for (const [k, v] of Object.entries(opts.attributes)) {
        params.set(`attributes[${k}]`, v);
      }
    }
    const qs = params.toString();
    return `https://${domain}/cart/${opts.variantId}:${qty}${qs ? `?${qs}` : ""}`;
  }

  // Final fallback: Amazon
  return AMAZON_URL;
}

export function getCheckoutMode(): "stripe" | "shopify" | "amazon" {
  const mode = process.env.NEXT_PUBLIC_CHECKOUT_MODE ?? "amazon";
  if (mode === "stripe" || mode === "shopify") return mode;
  return "amazon";
}

export const PRODUCTS = {
  shower: {
    name: "Filtered Shower Head",
    price: 107.99,
    subscribePrice: 80,
    msrp: 134.99,
    firstOrderDiscount: 20,
    filterLife: "6 months · 12,000 gallons",
    variants: {
      single: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_SHOWER_SINGLE ?? "",
      subscription: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_SHOWER_SUBSCRIPTION ?? "",
    },
  },
} as const;
