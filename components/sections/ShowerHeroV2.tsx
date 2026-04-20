"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PRODUCTS } from "@/lib/checkout";

export default function ShowerHeroV2() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const productY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  return (
    <section ref={ref} className="relative bg-bone pt-24 md:pt-28 pb-16 md:pb-24 overflow-hidden">
      {/* Ambient gradient wash — dusty blue bloom */}
      <div className="absolute inset-0 -z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[65%] h-full bg-gradient-to-bl from-water/70 via-mist/50 to-transparent" />
        <div className="absolute top-[15%] left-[50%] -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-deep/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
        {/* LEFT — product image with full staging */}
        <div className="lg:col-span-6 order-2 lg:order-1 relative">
          <motion.div
            style={{ y: productY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-square w-full"
          >
            {/* Ripple rings — concentric, animated */}
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
              <div className="relative w-full h-full">
                <Image
                  src="/product/product-white-composite.jpg"
                  alt="The Feels Like Om filtered shower head — 20-stage filtration"
                  fill
                  priority
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </motion.div>

            {/* Floating stat pill — top-left */}
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

            {/* TikTok trust pill — bottom-right */}
            <motion.a
              href="https://www.tiktok.com/@feelslikeom.shop"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.7 }}
              className="absolute bottom-2 md:bottom-6 right-0 md:right-4 bg-deeper/92 backdrop-blur px-4 py-2.5 rounded-full text-bone text-[11px] tracking-widest uppercase flex items-center gap-2 hover:bg-ink transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              5M+ views on TikTok
            </motion.a>

            {/* Colorway hint — bottom-left */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="absolute bottom-0 left-0 md:left-4 flex items-center gap-2 text-[11px] tracking-wider uppercase text-muted"
            >
              <span className="h-4 w-4 rounded-full bg-bone border border-ink/20 ring-2 ring-deep" />
              <span className="h-4 w-4 rounded-full bg-ink border border-ink/20" />
              <span className="ml-1">2 colorways</span>
            </motion.div>
          </motion.div>
        </div>

        {/* RIGHT — copy + proof + offer + CTA */}
        <div className="lg:col-span-6 order-1 lg:order-2 relative z-10">
          {/* Star rating + orders */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-6"
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
            className="display text-[11vw] lg:text-[5.2vw] leading-[0.98]"
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
            className="mt-6 text-[15px] md:text-[17px] leading-relaxed text-muted max-w-lg"
          >
            A 20-stage filter that reduces chlorine, heavy metals, and the
            chemicals that dry your hair and irritate your skin.
            Independently lab-tested. Installs in under 90 seconds.
          </motion.p>

          {/* Price + offer block */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 p-5 md:p-6 bg-mist/60 backdrop-blur rounded-sm border border-ink/10"
          >
            <div className="flex items-baseline gap-3 mb-2">
              <span className="display text-[40px] md:text-[46px] text-ink leading-none">
                ${PRODUCTS.shower.subscribePrice}
              </span>
              <span className="text-muted line-through text-base">
                ${PRODUCTS.shower.price}
              </span>
              <span className="overline text-deep">subscribe &amp; save</span>
            </div>
            <p className="text-[13px] text-muted">
              <span className="text-deep font-medium">20% off first order</span> ·
              Free shipping · 60-day returns · Cancel anytime
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-6 flex flex-col sm:flex-row gap-3"
          >
            <a href="#offer" className="btn-primary flex-1 sm:flex-none justify-center">
              Shop now — 20% off
              <span aria-hidden>→</span>
            </a>
            <Link href="/about" className="btn-secondary">
              Why water?
            </Link>
          </motion.div>

          {/* Trust strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="mt-8 pt-6 border-t border-ink/10 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] tracking-wider uppercase text-muted"
          >
            <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> 100K+ orders shipped</span>
            <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> 5M+ views on TikTok</span>
            <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> Independently lab-tested</span>
            <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> 60-day guarantee</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
