"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { PRODUCTS } from "@/lib/checkout";
import { track } from "@/lib/analytics";

type Plan = "subscribe" | "single";
type Color = "chrome" | "black";

const PLANS: Record<Plan, { label: string; price: number; original: number | null; line: string; badge?: string }> = {
  subscribe: {
    label: "Subscribe & Save",
    price: 125,
    original: 139,
    line: "Filter ships every 6 months · Free shipping · Skip anytime",
    badge: "Most popular",
  },
  single: {
    label: "One-time",
    price: 139,
    original: null,
    line: "Just the shower head · 60-day returns",
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
      { src: "/product/product-white-composite.jpg", alt: "Chrome filtered shower head — main view" },
      { src: "/product/product-bathroom.jpg", alt: "Chrome shower head in luxe bathroom" },
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

  const [plan, setPlan] = useState<Plan>("subscribe");
  const [color, setColor] = useState<Color>("chrome");
  const [imgIdx, setImgIdx] = useState(0);

  const selected = PLANS[plan];
  const colorImages = COLORS[color].images;
  const mainImage = colorImages[imgIdx] ?? colorImages[0];
  const checkoutHref = `/checkout?plan=${plan}&color=${color}`;

  function pickColor(c: Color) {
    setColor(c);
    setImgIdx(0); // reset to main image when colorway changes
    track("color_switch", { color: c });
  }

  return (
    <section
      ref={ref}
      className="relative bg-bone pt-32 md:pt-36 pb-16 md:pb-24 overflow-hidden"
    >
      {/* Ambient gradient wash */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[65%] h-full bg-gradient-to-bl from-water/70 via-mist/50 to-transparent" />
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-deep/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* LEFT — main product image + thumbnail gallery */}
        <div className="lg:col-span-5 order-2 lg:order-1 relative">
          <motion.div
            style={{ y: productY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square w-full"
          >
            {/* Ripple rings */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="absolute w-[65%] h-[65%] rounded-full border border-deep/20 ripple" />
              <div className="absolute w-[65%] h-[65%] rounded-full border border-deep/15 ripple" style={{ animationDelay: "1.3s" }} />
              <div className="absolute w-[65%] h-[65%] rounded-full border border-deep/10 ripple" style={{ animationDelay: "2.6s" }} />
            </div>

            {/* Breathing product container */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={mainImage.src}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={mainImage.src}
                    alt={mainImage.alt}
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 42vw"
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* 91% stat pill — top left */}
            <motion.div
              initial={{ opacity: 0, x: -16, y: -16 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="absolute top-2 md:top-6 left-0 md:left-4 bg-bone/95 backdrop-blur px-4 py-3 rounded-sm shadow-lg shadow-ink/10"
            >
              <p className="display text-xl md:text-2xl leading-none text-deep">91%</p>
              <p className="text-[10px] tracking-wider uppercase text-muted mt-1.5 max-w-[130px] leading-tight">
                reported calmer skin in 4 weeks
              </p>
            </motion.div>

            {/* TikTok pill — bottom right */}
            <motion.a
              href="https://www.tiktok.com/@feelslikeom.shop"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.7 }}
              onClick={() => track("tiktok_click", { source: "hero_pill" })}
              className="absolute bottom-2 md:bottom-6 right-0 md:right-4 bg-deeper/92 backdrop-blur px-4 py-2.5 rounded-full text-bone text-[11px] tracking-widest uppercase flex items-center gap-2 hover:bg-ink transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              5M+ views on TikTok
            </motion.a>
          </motion.div>

          {/* THUMBNAIL GALLERY — under the main image */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-5 grid grid-cols-4 gap-2 md:gap-3"
          >
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
          </motion.div>
        </div>

        {/* RIGHT — copy + INLINE OFFER + CTA above the fold */}
        <div className="lg:col-span-7 order-1 lg:order-2 relative z-10">
          {/* Star rating + orders */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-5"
          >
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
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="display text-[10vw] lg:text-[4.6vw] leading-[0.98]"
          >
            Softer hair,
            <br />
            calmer skin —
            <br />
            <span className="display-italic text-deep">by your next shower.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="mt-5 text-[14px] md:text-[15px] leading-relaxed text-muted max-w-lg"
          >
            A 20-stage filter that reduces chlorine, heavy metals, and the
            chemicals that dry your hair. Independently lab-tested · 90-second install.
          </motion.p>

          {/* INLINE OFFER — plan picker (vertical stack, larger cards) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-7 space-y-3"
          >
            {(Object.keys(PLANS) as Plan[]).map((p) => {
              const isActive = plan === p;
              const planInfo = PLANS[p];
              return (
                <button
                  key={p}
                  onClick={() => {
                    setPlan(p);
                    track("plan_switch", { plan: p });
                  }}
                  className={`relative w-full text-left p-4 md:p-5 rounded-sm border transition-all ${
                    isActive
                      ? "border-deep bg-mist/60 shadow-sm shadow-ink/5"
                      : "border-ink/15 bg-bone hover:border-ink/30"
                  }`}
                >
                  {planInfo.badge && (
                    <span className="absolute -top-2 left-4 overline text-bone bg-deep px-2.5 py-0.5 rounded-full text-[9px]">
                      {planInfo.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-4">
                    {/* Radio */}
                    <span
                      className={`h-5 w-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                        isActive ? "border-deep bg-deep" : "border-ink/30"
                      }`}
                    >
                      {isActive && <span className="block h-full w-full rounded-full bg-bone scale-[0.4]" />}
                    </span>

                    {/* Label + line */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3 mb-1">
                        <span className="text-[15px] font-medium text-ink">{planInfo.label}</span>
                        <span className="display text-2xl text-ink leading-none whitespace-nowrap">
                          ${planInfo.price}
                          {planInfo.original && (
                            <span className="ml-2 text-[12px] text-muted line-through font-sans">
                              ${planInfo.original}
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-[12px] text-muted leading-snug">{planInfo.line}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>

          {/* INLINE OFFER — colorway picker (compact) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.6 }}
            className="mt-5 flex items-center gap-4"
          >
            <span className="overline text-muted">Color</span>
            <div className="flex items-center gap-2">
              {(Object.keys(COLORS) as Color[]).map((c) => (
                <button
                  key={c}
                  onClick={() => pickColor(c)}
                  aria-label={`Select ${COLORS[c].label}`}
                  className={`h-8 w-8 rounded-full border border-ink/20 transition-all ${COLORS[c].swatch} ${
                    color === c ? "ring-2 ring-offset-2 ring-offset-bone ring-deep" : ""
                  }`}
                />
              ))}
            </div>
            <span className="text-[12px] text-muted">{COLORS[color].label}</span>
          </motion.div>

          {/* PRIMARY CTA */}
          <motion.a
            href={checkoutHref}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
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
            className="btn-primary w-full justify-center !py-5 mt-6 text-[14px]"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={`${plan}-${color}-${selected.price}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2"
              >
                Checkout — ${selected.price} · {COLORS[color].label}
                <span aria-hidden>→</span>
              </motion.span>
            </AnimatePresence>
          </motion.a>

          {/* Express-pay row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-3 flex items-center justify-center gap-3 text-[10.5px] text-muted"
          >
            <span className="tracking-widest uppercase">Pay with</span>
            <span className="flex items-center gap-2 text-ink/70">
              <span className="px-1.5 py-0.5 rounded bg-ink/5 border border-ink/10">Apple Pay</span>
              <span className="px-1.5 py-0.5 rounded bg-ink/5 border border-ink/10">Google Pay</span>
              <span className="px-1.5 py-0.5 rounded bg-ink/5 border border-ink/10">PayPal</span>
              <span className="px-1.5 py-0.5 rounded bg-ink/5 border border-ink/10">Card</span>
            </span>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-6 pt-5 border-t border-ink/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px] tracking-wider uppercase text-muted"
          >
            <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> 100K+ orders shipped</span>
            <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> 5M+ TikTok views</span>
            <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> Lab-tested</span>
            <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> 60-day guarantee</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
