/**
 * Shopify cart-permalink builder.
 * Docs: https://shopify.dev/docs/storefronts/themes/navigation-search/cart/cart-permalinks
 *
 * Usage:
 *   buildCheckoutUrl({ variantId: 12345, quantity: 1, discount: "WELCOME20" })
 *   → https://feelslikeom.shop/cart/12345:1?discount=WELCOME20
 */
export type CheckoutOptions = {
  variantId: string | number;
  quantity?: number;
  discount?: string;
  sellingPlan?: string;
  attributes?: Record<string, string>;
};

export function buildCheckoutUrl(opts: CheckoutOptions): string {
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

export const PRODUCTS = {
  shower: {
    name: "Filtered Shower Head",
    price: 139,
    subscribePrice: 125,
    firstOrderDiscount: 20,
    filterLife: "6 months · 12,000 gallons",
    variants: {
      single: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_SHOWER_SINGLE ?? "",
      subscription: process.env.NEXT_PUBLIC_SHOPIFY_VARIANT_SHOWER_SUBSCRIPTION ?? "",
    },
  },
} as const;
