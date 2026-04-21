"use client";

import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState, FormEvent } from "react";
import { buildCheckoutUrl, getCheckoutMode, PRODUCTS, CheckoutVariant } from "@/lib/checkout";
import { track } from "@/lib/analytics";

const COLORS = {
  chrome: { label: "Chrome", image: "/product/product-bathroom.jpg" },
  black:  { label: "Matte Black", image: "/product/product-black-composite.jpg" },
} as const;

const PLANS = {
  subscribe: {
    label: "Subscribe & Save",
    price: 125,
    original: 139,
    line: "Replacement filter every 6 months · Free shipping · Skip or cancel anytime",
  },
  single: {
    label: "One-time purchase",
    price: 139,
    original: null as number | null,
    line: "Just the shower head · Free shipping over $49 · 60-day returns",
  },
} as const;

export default function CheckoutContent() {
  const sp = useSearchParams();
  const planParam = (sp.get("plan") ?? "subscribe") as keyof typeof PLANS;
  const colorParam = (sp.get("color") ?? "chrome") as keyof typeof COLORS;

  const plan = PLANS[planParam] ? planParam : "subscribe";
  const color = COLORS[colorParam] ? colorParam : "chrome";

  const planData = PLANS[plan];
  const colorData = COLORS[color];

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const variant: CheckoutVariant = { plan, color };
  const checkoutMode = getCheckoutMode();
  const stripeReady = checkoutMode === "stripe";

  const checkoutUrl = useMemo(
    () =>
      buildCheckoutUrl({
        variantId:
          plan === "subscribe"
            ? PRODUCTS.shower.variants.subscription
            : PRODUCTS.shower.variants.single,
        quantity: 1,
        discount: plan === "subscribe" ? process.env.NEXT_PUBLIC_FIRST_ORDER_DISCOUNT : undefined,
        attributes: { color: colorData.label },
        variant,
      }),
    [plan, color, colorData.label, variant]
  );

  async function continueToPayment(method: string, e?: FormEvent) {
    e?.preventDefault();
    setSubmitting(true);
    track("begin_checkout", {
      plan,
      color,
      method,
      price: planData.price,
      value: planData.price,
      currency: "USD",
      has_email: Boolean(email),
    });

    // Capture email in parallel with redirect (best-effort, don't block UX)
    if (email) {
      const endpoint = process.env.NEXT_PUBLIC_WATER_REPORT_ENDPOINT;
      if (endpoint) {
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, source: "checkout_intent", plan, color }),
        }).catch(() => {});
      }
    }

    // Allow microtask for analytics fire, then redirect
    setTimeout(() => {
      window.location.href = checkoutUrl;
    }, 80);
  }

  return (
    <div className="min-h-screen bg-bone pt-32 md:pt-36 pb-20">
      <div className="mx-auto max-w-[1100px] px-5 md:px-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <Link href="/shower" className="overline text-muted hover:text-deep transition-colors flex items-center gap-2">
            <span aria-hidden>←</span> Back to product
          </Link>
          <p className="overline text-deep">Secure checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
          {/* LEFT — Order summary */}
          <div className="lg:order-2">
            <div className="bg-mist/50 rounded-sm p-6 md:p-8 sticky top-32">
              <p className="overline text-deep mb-5">Your order</p>

              <div className="flex gap-5 pb-6 border-b border-ink/10">
                <div className="relative w-20 h-24 md:w-24 md:h-28 flex-shrink-0 rounded-sm overflow-hidden bg-bone">
                  <Image
                    src={colorData.image}
                    alt={`Filtered Shower Head — ${colorData.label}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
                <div className="flex-1">
                  <p className="display text-[18px] md:text-[20px] text-ink leading-tight">
                    Filtered Shower Head
                  </p>
                  <p className="text-[13px] text-muted mt-1">{colorData.label}</p>
                  <p className="text-[12px] text-deep mt-3">{planData.label}</p>
                  <p className="text-[12px] text-muted mt-1 leading-snug">{planData.line}</p>
                </div>
              </div>

              <dl className="space-y-3 py-6 border-b border-ink/10 text-[14px]">
                <div className="flex justify-between">
                  <dt className="text-muted">Subtotal</dt>
                  <dd className="text-ink">${planData.price}.00</dd>
                </div>
                {planData.original && (
                  <div className="flex justify-between">
                    <dt className="text-muted">Subscribe & Save</dt>
                    <dd className="text-deep">−${planData.original - planData.price}.00</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted">Shipping</dt>
                  <dd className="text-ink">{plan === "subscribe" ? "Free" : "Calculated at next step"}</dd>
                </div>
              </dl>

              <div className="flex justify-between pt-5 items-baseline">
                <span className="overline text-muted">Total today</span>
                <span className="display text-3xl text-ink">${planData.price}.00</span>
              </div>

              <p className="mt-5 text-[11px] text-muted leading-relaxed">
                60-day money-back guarantee · Cancel subscription anytime · Free
                replacement filter every 6 months with subscription.
              </p>
            </div>
          </div>

          {/* RIGHT — Email + payment selection */}
          <div className="lg:order-1">
            <h1 className="display text-[10vw] md:text-[3.5vw] leading-[1.05] mb-3">
              Almost yours.
            </h1>
            <p className="text-[15px] text-muted leading-relaxed mb-10 max-w-md">
              Pick how you want to pay. Your order ships from our existing
              fulfillment network — same Prime-grade logistics, FLO experience.
            </p>

            {/* Email capture */}
            <form onSubmit={(e) => continueToPayment("card", e)} className="mb-8">
              <label className="block">
                <span className="overline text-muted mb-3 block">Where should we send your receipt?</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                  className="w-full px-4 py-3 rounded-sm bg-bone border border-ink/15 text-[15px] focus:outline-none focus:border-deep focus:ring-1 focus:ring-deep transition-colors"
                />
              </label>
            </form>

            {/* Stripe-not-set notice */}
            {!stripeReady && (
              <div className="mb-6 p-4 rounded-sm bg-gold/10 border border-gold/30 text-[12px] text-ink/80 leading-relaxed">
                <strong className="text-deep">Heads up:</strong> Stripe isn&apos;t
                wired yet — clicking any payment method below will route to our
                Amazon listing for now. Once Stripe Payment Links are added (15
                min of setup), every option below will complete checkout
                directly on FLO.
              </div>
            )}

            {/* Payment method buttons */}
            <p className="overline text-muted mb-4">Pay with</p>
            <div className="space-y-3">
              <PaymentButton label="Apple Pay" theme="dark" onClick={() => continueToPayment("apple_pay")} disabled={submitting} />
              <PaymentButton label="Google Pay" theme="light" onClick={() => continueToPayment("google_pay")} disabled={submitting} />
              <PaymentButton label="PayPal" theme="paypal" onClick={() => continueToPayment("paypal")} disabled={submitting} />
              <PaymentButton label="Pay with card" theme="primary" onClick={() => continueToPayment("card")} disabled={submitting} />
            </div>

            {/* Security strip */}
            <div className="mt-8 pt-6 border-t border-ink/10 flex flex-wrap gap-x-5 gap-y-2 text-[11px] tracking-wider uppercase text-muted">
              <span className="flex items-center gap-1.5"><span className="text-deep">🔒</span> 256-bit secure</span>
              <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> 60-day returns</span>
              <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> No spam ever</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type PaymentButtonProps = {
  label: string;
  theme: "dark" | "light" | "paypal" | "primary";
  onClick: () => void;
  disabled?: boolean;
};

function PaymentButton({ label, theme, onClick, disabled }: PaymentButtonProps) {
  const themeClasses = {
    dark:    "bg-ink text-bone hover:bg-ink-2",
    light:   "bg-bone text-ink border border-ink/20 hover:border-ink/40",
    paypal:  "bg-[#FFC439] text-[#003087] hover:bg-[#FFB800] border border-[#FFC439]",
    primary: "bg-deep text-bone hover:bg-deeper",
  }[theme];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.005 }}
      whileTap={disabled ? undefined : { scale: 0.995 }}
      className={`w-full py-4 rounded-sm font-medium text-[14px] tracking-wide transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${themeClasses}`}
    >
      {label}
    </motion.button>
  );
}
