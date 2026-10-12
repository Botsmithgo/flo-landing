"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { buildCheckoutUrl, PRODUCTS } from "@/lib/checkout";
import { track } from "@/lib/analytics";
import { useOffer, setOffer, type Plan, type Color } from "@/lib/offerStore";
import { AmazonPayIcon, ApplePayIcon, CreditCardIcon, GooglePayIcon, KlarnaIcon, PayPalIcon } from "@/components/icons/PaymentIcons";

const PLANS: Record<Plan, { label: string; price: number; original: number | null; line: string; badge?: string }> = {
  subscribe: {
    label: "Subscribe & Save",
    price: PRODUCTS.shower.subscribePrice,
    original: PRODUCTS.shower.msrp,
    line: `$80 today · $${PRODUCTS.shower.refillPrice} every ${PRODUCTS.shower.refillCadenceMonths} months · Skip anytime`,
    badge: "Auto-refill",
  },
  single: {
    label: "First order",
    price: PRODUCTS.shower.price,
    original: PRODUCTS.shower.msrp,
    line: "$80 for eligible new customers · No subscription · 60-day returns",
    badge: "Best for first-time buyers",
  },
};

const COLORS: Record<Color, {
  label: string;
  swatch: string;
  images: { src: string; alt: string }[];
}> = {
  chrome: {
    label: "Chrome",
    swatch: "bg-gradient-to-br from-bone to-water",
    images: [
      { src: "/product/chrome-studio.webp", alt: "Chrome filtered shower head" },
      { src: "/product/product-white-composite.jpg", alt: "Chrome filtered shower head with packaging" },
      { src: "/product/product-white-face.jpg", alt: "Chrome face-on with specs and trust badges" },
      { src: "/product/dimensions.jpg", alt: "Product dimensions (134mm × 140mm)" },
    ],
  },
  black: {
    label: "Matte Black",
    swatch: "bg-gradient-to-br from-ink-2 to-ink",
    images: [
      { src: "/product/product-black-composite.jpg", alt: "Matte black filtered shower head — main view" },
      { src: "/product/product-black-face.jpg", alt: "Matte black face-on with specs and trust badges" },
      { src: "/product/hero-lifestyle.jpg", alt: "Lifestyle shower scene" },
      { src: "/product/dimensions.jpg", alt: "Product dimensions (134mm × 140mm)" },
    ],
  },
};

export default function ShowerHeroV2() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const productY = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);

  const { plan, color } = useOffer();
  const [imgIdx, setImgIdx] = useState(0);

  const selected = PLANS[plan];
  const colorImages = COLORS[color].images;
  const mainImage = colorImages[imgIdx] ?? colorImages[0];
  const checkoutHref = buildCheckoutUrl({ variant: { plan, color } });

  function pickColor(c: Color) {
    setOffer({ color: c });
    setImgIdx(0); // reset to main image when colorway changes
    track("color_switch", { color: c });
  }

  return (
    <section
      id="offer"
      ref={ref}
      className="relative bg-paper pt-32 md:pt-36 pb-16 md:pb-24 overflow-hidden"
    >
      {/* Ambient light: one soft blue bloom behind the product, nothing else */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[8%] w-[640px] h-[640px] rounded-full bg-action/[0.07] blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10">
        {/* MOBILE-ONLY: stars → headline → price land in the first screen, before
            the image. Cold traffic has to know what this is and what it costs
            before it sees the gallery. */}
        <div className="lg:hidden mb-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-4">
            <span className="flex items-center gap-2">
              <span className="text-deep text-base">★★★★★</span>
              <span className="text-[13px] text-muted">
                <span className="text-ink font-medium">4.8</span>
              </span>
            </span>
            <span className="text-[13px] text-muted">·</span>
            <span className="text-[13px] text-muted">
              <span className="text-ink font-medium">100,000+</span> orders shipped
            </span>
          </div>
          <h1 className="display leading-[0.98]" style={{ fontSize: "clamp(36px, 10vw, 48px)" }}>
            Softer hair.
            <br />
            Calmer skin.
            <br />
            <span className="display-italic text-deep">By your next shower.</span>
          </h1>
          <p className="mt-4 flex items-baseline gap-2.5">
            <span className="display text-[26px] text-ink leading-none">${selected.price}</span>
            <span className="text-[13px] text-muted line-through">${PRODUCTS.shower.msrp}</span>
            <span className="text-[12px] text-muted">
              {plan === "subscribe" ? "first order, then refills" : "first order · 60-day returns"}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* LEFT — main product image + thumbnail gallery */}
        <div className="lg:col-span-5 relative">
          <motion.div
            style={{ y: productY }}
            className="relative aspect-square w-full rounded-[28px] bg-gradient-to-b from-mist/70 via-white to-white ring-1 ring-ink/[0.04]"
          >
            {/* Ripple rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[65%] h-[65%] rounded-full border border-deep/20 ripple" />
              <div className="absolute w-[65%] h-[65%] rounded-full border border-deep/15 ripple" style={{ animationDelay: "1.3s" }} />
              <div className="absolute w-[65%] h-[65%] rounded-full border border-deep/10 ripple" style={{ animationDelay: "2.6s" }} />
            </div>

            {/* Image cross-fade on color/thumbnail change */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* key re-mounts on thumbnail/colour change; CSS keyframe fades it in
                  (Framer's AnimatePresence fade stalled under a throttled rAF). */}
              <div key={mainImage.src} className="relative w-full h-full animate-[fadeIn_0.35s_ease-out]">
                  <Image
                    src={mainImage.src}
                    alt={mainImage.alt}
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
              </div>
            </div>

            {/* TikTok pill — bottom right */}
            <a
              href="https://www.tiktok.com/@feelslikeom.shop"
              target="_blank"
              rel="noreferrer"
              onClick={() => track("tiktok_click", { source: "hero_pill" })}
              className="absolute bottom-3 md:bottom-5 right-3 md:right-5 bg-ink/85 backdrop-blur px-3.5 py-2 rounded-full text-white text-[12px] font-medium flex items-center gap-2 hover:bg-ink transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              5M+ views on TikTok
            </a>
          </motion.div>

          {/* THUMBNAIL GALLERY — under the main image */}
          <div className="mt-5 grid grid-cols-4 gap-2 md:gap-3">
            {colorImages.map((img, i) => (
              <button
                key={`${color}-${img.src}`}
                onClick={() => setImgIdx(i)}
                aria-label={img.alt}
                className={`relative aspect-square overflow-hidden rounded-sm bg-mist/50 transition-all ${
                  imgIdx === i ? "ring-2 ring-deep ring-offset-2 ring-offset-bone" : "hover:opacity-80 border border-ink/10"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — copy + INLINE OFFER + CTA above the fold */}
        <div className="lg:col-span-7 relative z-10 rounded-[28px] bg-white p-5 md:p-8 shadow-[0_34px_90px_-44px_rgba(20,28,34,0.35)] ring-1 ring-ink/[0.05]">
          {/* Star rating + orders — DESKTOP ONLY (mobile shows this above the image) */}
          <div className="hidden lg:flex flex-wrap items-center gap-x-4 gap-y-1 mb-5">
            <span className="flex items-center gap-2">
              <span className="text-deep text-base">★★★★★</span>
              <span className="text-[13px] text-muted">
                <span className="text-ink font-medium">4.8</span>
              </span>
            </span>
            <span className="text-[13px] text-muted">·</span>
            <span className="text-[13px] text-muted">
              <span className="text-ink font-medium">100,000+</span> orders shipped
            </span>
          </div>

          {/* H1 — desktop only; mobile renders it above the image */}
          <h1
            className="hidden lg:block display leading-[0.98]"
            style={{ fontSize: "clamp(40px, 4.2vw, 58px)" }}
          >
            Softer hair.
            <br />
            Calmer skin.
            <br />
            <span className="display-italic text-deep">By your next shower.</span>
          </h1>

          <p className="mt-5 text-[14px] md:text-[15px] leading-relaxed text-muted max-w-lg">
            A 20-stage filter — <span className="text-ink">KDF-55, calcium sulfite,
            activated carbon, and water-conditioning media</span> — designed to reduce
            chlorine, heavy metals, mineral buildup, and the drying effects associated
            with hard water.
            In a 4-week customer study, <span className="text-ink">91% reported
            less acne and skin irritation</span>. Three-minute install. 60-day money-back.
          </p>

          {/* OFFER CARD — a raised white panel so the buy decision sits on its own
              surface instead of dissolving into the bone background. One price,
              stated once and loud; the plans only differ in what happens after today. */}
          <div className="mt-7 rounded-2xl bg-action/[0.05] p-4 md:p-5 ring-1 ring-action/10">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <span className="display text-[44px] md:text-[52px] text-ink leading-none">${selected.price}</span>
            <span className="text-[16px] text-muted line-through leading-none mb-1.5">${PRODUCTS.shower.msrp}</span>
            <span className="rounded-full bg-action/10 px-3 py-1.5 text-[12px] font-semibold text-action leading-none mb-1">
              {Math.round((1 - selected.price / PRODUCTS.shower.msrp) * 100)}% off your first order
            </span>
          </div>

          {/* Plan choice — two clear options, selected one outlined in the action colour */}
          <div className="mt-5 grid grid-cols-2 gap-2">
            {(Object.keys(PLANS) as Plan[]).map((p) => {
              const isActive = plan === p;
              const isSub = p === "subscribe";
              return (
                <button
                  key={p}
                  onClick={() => {
                    setOffer({ plan: p });
                    track("plan_switch", { plan: p });
                  }}
                  aria-pressed={isActive}
                  className={`relative text-left rounded-xl border-2 px-4 py-3.5 transition-colors ${
                    isActive
                      ? "border-action bg-action/[0.06] text-ink"
                      : "border-ink/10 bg-white text-ink hover:border-ink/30"
                  }`}
                >
                  {isSub && (
                    <span className={`absolute -top-2.5 left-3 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
                      isActive ? "bg-action text-white" : "bg-mist text-deeper"
                    }`}>
                      Refills included
                    </span>
                  )}
                  <span className="flex items-center gap-2 text-[15px] font-semibold leading-tight">
                    <span className={`h-4 w-4 rounded-full border-2 flex-shrink-0 ${isActive ? "border-action bg-action" : "border-ink/25"}`}>
                      {isActive && <span className="block h-full w-full rounded-full bg-white scale-[0.45]" />}
                    </span>
                    {isSub ? "Subscribe" : "One-time"}
                  </span>
                  <span className="mt-1.5 block text-[12px] leading-snug text-muted">
                    {isSub
                      ? `New filter every ${PRODUCTS.shower.refillCadenceMonths} months, $${PRODUCTS.shower.refillPrice}. Skip anytime.`
                      : "Just the shower head. Reorder filters when you like."}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Colorway */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex items-center gap-2">
              {(Object.keys(COLORS) as Color[]).map((c) => (
                <button
                  key={c}
                  onClick={() => pickColor(c)}
                  aria-label={`Select ${COLORS[c].label}`}
                  aria-pressed={color === c}
                  className={`h-8 w-8 rounded-full border border-ink/20 transition-all ${COLORS[c].swatch} ${
                    color === c ? "ring-2 ring-offset-2 ring-offset-white ring-action" : ""
                  }`}
                />
              ))}
            </div>
            <span className="text-[13px] text-ink">{COLORS[color].label}</span>
          </div>

          {/* PRIMARY CTA */}
          <motion.a
            href={checkoutHref}
            onClick={() =>
              track("begin_checkout", {
                plan,
                color,
                price: selected.price,
                value: selected.price,
                currency: "USD",
                source: "hero",
              })
            }
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            className="btn-primary w-full justify-center !py-[18px] mt-5 !text-[16px]"
          >
            <span className="flex items-center gap-2">
              Get yours — ${selected.price}
              <span aria-hidden>→</span>
            </span>
          </motion.a>

          <p className="mt-3 text-center text-[13px] text-ink">
            Free U.S. shipping · 60-day money-back guarantee
          </p>
          </div>{/* /offer card */}

          {/* Accepted payment methods — trust signal, not buttons. Inline logos, no
              borders (borders previously implied clickability + clipped wider PayPal SVG). */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[12px] text-muted">
            <span>Pay with</span>
            <span className="flex flex-wrap items-center justify-center gap-3 opacity-75">
              <ApplePayIcon className="h-4 w-auto" monochrome />
              <GooglePayIcon className="h-4 w-auto" />
              <PayPalIcon className="h-4 w-auto" />
              <KlarnaIcon className="h-5 w-auto" />
              <AmazonPayIcon className="h-5 w-auto" />
              <CreditCardIcon className="h-4 w-auto" />
            </span>
          </div>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted">
            Email is collected securely at checkout for your receipt and order updates. No account required.{" "}
            <a href="/policies/terms-of-service" className="underline underline-offset-2 hover:text-ink">
              Offer terms
            </a>
            .
          </p>

          {/* Trust strip */}
          <div className="mt-6 pt-5 border-t border-ink/[0.08] flex flex-wrap items-center gap-2">
            {["100K+ orders shipped", "5M+ TikTok views", "4-week customer study", "60-day guarantee"].map((t) => (
              <span key={t} className="rounded-full bg-mist/60 px-3 py-1.5 text-[12px] font-medium text-ink">{t}</span>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
