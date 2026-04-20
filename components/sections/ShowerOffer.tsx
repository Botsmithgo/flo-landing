"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { buildCheckoutUrl, PRODUCTS } from "@/lib/checkout";

type Plan = "subscribe" | "single";

type PlanOption = {
  id: Plan;
  badge?: string;
  title: string;
  price: number;
  original: number | null;
  line: string;
  bullets: string[];
};

const PLANS: PlanOption[] = [
  {
    id: "subscribe",
    badge: "Most popular",
    title: "Subscribe & save",
    price: 125,
    original: 139,
    line: "Replacement filter every 6 months. Free shipping. 20% off first order.",
    bullets: [
      "First order: 20% off with code WELCOME20",
      "Free shipping on every order",
      "Replacement filters auto-ship every 6 months",
      "Skip, pause, or cancel anytime",
    ],
  },
  {
    id: "single",
    title: "One-time purchase",
    price: 139,
    original: null,
    line: "Just the shower head. No commitments. Replacement filters sold separately.",
    bullets: [
      "Free shipping on orders over $49",
      "60-day money-back guarantee",
      "Replacement filters: $33 each, as needed",
    ],
  },
];

export default function ShowerOffer() {
  const [plan, setPlan] = useState<Plan>("subscribe");
  const selected = PLANS.find((p) => p.id === plan)!;

  const variantId =
    plan === "subscribe"
      ? PRODUCTS.shower.variants.subscription
      : PRODUCTS.shower.variants.single;

  const checkoutUrl =
    variantId
      ? buildCheckoutUrl({
          variantId,
          quantity: 1,
          discount: plan === "subscribe" ? process.env.NEXT_PUBLIC_FIRST_ORDER_DISCOUNT : undefined,
        })
      : "https://feelslikeom.shop";

  return (
    <section id="offer" className="bg-bone py-32 md:py-44 scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
        {/* Left: visual */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-mist">
              <Image
                src="https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=1400&q=85"
                alt="Feels Like Om filtered shower head on a bathroom ledge"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-sm bg-mist">
                  <Image
                    src={`https://images.unsplash.com/photo-${
                      i === 1 ? "1552321554-5fefe8c9ef14" : i === 2 ? "1626808642875-0aa545482dfb" : "1584305574647-0cc949a2bb9f"
                    }?w=600&q=85`}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right: offer */}
        <div className="lg:col-span-7">
          <Reveal>
            <p className="overline text-deep mb-6">Choose your plan</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[11vw] md:text-[5.5vw] leading-[0.98]">
              Start the ritual,
              <br />
              <span className="display-italic text-deep">on your terms.</span>
            </h2>
          </Reveal>

          {/* Plan cards */}
          <div className="mt-12 space-y-4">
            {PLANS.map((p) => {
              const active = plan === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={`relative w-full text-left p-6 md:p-8 rounded-sm border transition-all ${
                    active
                      ? "border-deep bg-mist/40 shadow-md shadow-ink/5"
                      : "border-ink/15 bg-bone hover:border-ink/30"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 h-5 w-5 rounded-full border-2 transition-colors ${active ? "border-deep bg-deep" : "border-ink/30"}`}>
                      {active && <div className="h-full w-full rounded-full bg-bone scale-[0.4]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-3 mb-1">
                        <h3 className="display text-xl md:text-[22px] text-ink">{p.title}</h3>
                        {p.badge && (
                          <span className="overline text-bone bg-deep px-2.5 py-1 rounded-full text-[9px]">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] md:text-[14px] text-muted leading-relaxed">{p.line}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="display text-2xl md:text-[28px] text-ink leading-none">${p.price}</p>
                      {p.original && <p className="text-[11px] text-muted line-through mt-1">${p.original}</p>}
                    </div>
                  </div>

                  {active && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.4 }}
                      className="mt-5 ml-9 space-y-2 text-[13px] text-ink/75"
                    >
                      {p.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="text-deep">✓</span> {b}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </button>
              );
            })}
          </div>

          {/* Primary CTA */}
          <motion.a
            href={checkoutUrl}
            className="btn-primary w-full justify-center !py-5 mt-8 text-[14px]"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {plan === "subscribe"
              ? `Subscribe — $${selected.price} (20% off first order)`
              : `Add to cart — $${selected.price}`}
            <span aria-hidden>→</span>
          </motion.a>

          {/* Guarantee bar */}
          <div className="mt-8 grid grid-cols-3 gap-3 text-center border-t border-ink/15 pt-8">
            {[
              { t: "60-day", l: "Money-back guarantee" },
              { t: "Free", l: "Shipping with subscription" },
              { t: "Skip", l: "Or cancel anytime" },
            ].map((g) => (
              <div key={g.t}>
                <p className="display text-xl md:text-2xl text-ink">{g.t}</p>
                <p className="mt-1 text-[11px] text-muted tracking-wider">{g.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
