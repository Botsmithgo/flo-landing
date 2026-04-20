"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { buildCheckoutUrl, PRODUCTS } from "@/lib/checkout";

type Plan = "subscribe" | "single";
type Color = "chrome" | "black";

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

const COLORS: Record<Color, {
  label: string;
  swatch: string;
  hero: string;
  thumbs: string[];
}> = {
  chrome: {
    label: "Chrome",
    swatch: "bg-gradient-to-br from-bone to-water",
    hero: "/product/product-bathroom.jpg",
    thumbs: [
      "/product/product-white-composite.jpg",
      "/product/product-white-face.jpg",
      "/product/dimensions.jpg",
    ],
  },
  black: {
    label: "Matte Black",
    swatch: "bg-gradient-to-br from-ink-2 to-ink",
    hero: "/product/product-black-composite.jpg",
    thumbs: [
      "/product/product-black-face.jpg",
      "/product/hero-lifestyle.jpg",
      "/product/dimensions.jpg",
    ],
  },
};

export default function ShowerOffer() {
  const [plan, setPlan] = useState<Plan>("subscribe");
  const [color, setColor] = useState<Color>("chrome");
  const selected = PLANS.find((p) => p.id === plan)!;
  const cw = COLORS[color];

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
          attributes: { color: cw.label },
        })
      : "https://feelslikeom.shop";

  return (
    <section id="offer" className="bg-bone py-32 md:py-44 scroll-mt-24">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
        {/* LEFT — product imagery + colorway */}
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-mist">
              <AnimatePresence mode="wait">
                <motion.div
                  key={color}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={cw.hero}
                    alt={`Feels Like Om filtered shower head — ${cw.label}`}
                    fill
                    className="object-cover object-[30%_center]"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </Reveal>

          {/* Colorway selector */}
          <Reveal delay={0.1}>
            <div className="mt-6">
              <p className="overline text-muted mb-3 flex items-center justify-between">
                <span>Colorway</span>
                <span className="text-ink normal-case tracking-normal text-[13px]">
                  {cw.label}
                </span>
              </p>
              <div className="flex gap-3">
                {(Object.keys(COLORS) as Color[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={`Select ${COLORS[c].label} colorway`}
                    className={`h-11 w-11 rounded-full border border-ink/20 transition-all ${COLORS[c].swatch} ${
                      color === c ? "ring-2 ring-offset-2 ring-offset-bone ring-deep" : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </Reveal>

          {/* Thumbnail gallery */}
          <Reveal delay={0.2}>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {cw.thumbs.map((src, i) => (
                <div key={`${color}-${i}`} className="relative aspect-square overflow-hidden rounded-sm bg-mist">
                  <Image
                    src={src}
                    alt={`${cw.label} ${i === 0 ? "product shot" : i === 1 ? "specs and trust badges" : "dimensions"}`}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* RIGHT — offer */}
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

          {/* Primary CTA — includes selected colorway */}
          <motion.a
            href={checkoutUrl}
            className="btn-primary w-full justify-center !py-5 mt-8 text-[14px]"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {plan === "subscribe"
              ? `Subscribe — $${selected.price} · ${cw.label}`
              : `Add to cart — $${selected.price} · ${cw.label}`}
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
