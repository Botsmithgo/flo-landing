"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RevealText } from "@/components/Reveal";
import { PRODUCTS } from "@/lib/checkout";

export default function ShowerHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={ref} className="relative min-h-screen bg-bone overflow-hidden pt-28 md:pt-36">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center pb-20">
        {/* Left: copy */}
        <div className="lg:col-span-6 relative z-10">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="overline text-deep mb-6 flex items-center gap-3"
          >
            <span className="inline-block w-6 h-px bg-deep" />
            The Filtered Shower Head
          </motion.p>

          <h1 className="display text-[12vw] lg:text-[6.5vw] leading-[0.95]">
            <RevealText text="The shower" />
            <br />
            <RevealText text="you thought" delay={0.15} />
            <br />
            <span className="display-italic text-deep">
              <RevealText text="you were taking." delay={0.3} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="mt-10 text-[16px] md:text-[18px] leading-relaxed text-muted max-w-lg"
          >
            A 20-stage media stack — KDF-55, calcium sulfite, activated carbon —
            designed to reduce chlorine, heavy metals, odor and sediment before
            they reach your hair and skin. Independently lab-tested.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
          >
            <div className="flex items-baseline gap-3">
              <span className="display text-[44px] text-ink leading-none">${PRODUCTS.shower.subscribePrice}</span>
              <span className="text-muted line-through text-lg">${PRODUCTS.shower.price}</span>
              <span className="overline text-deep">with subscription</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.7 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <a href="#offer" className="btn-primary">
              Shop now — 20% off first order
            </a>
            <a href="#science" className="btn-secondary">
              How it works
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.7, duration: 1 }}
            className="mt-12 flex items-center gap-3 text-[12px] text-muted"
          >
            <div className="flex gap-0.5 text-deep text-base">★★★★★</div>
            <span className="tracking-wide">
              4.8 / 5 across 1,400+ reviews &nbsp;·&nbsp; 91% report calmer skin*
            </span>
          </motion.div>
        </div>

        {/* Right: product image */}
        <div className="lg:col-span-6 relative">
          <motion.div
            style={{ y: imgY }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-sm bg-water"
          >
            <Image
              src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1800&q=90"
              alt="The Feels Like Om filtered shower head"
              fill
              priority
              className="object-cover"
            />
            {/* Water ripple decorative */}
            <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full border border-bone/40 ripple" />
            <div className="absolute bottom-8 right-8 w-24 h-24 rounded-full border border-bone/40 ripple" style={{ animationDelay: "1.3s" }} />
          </motion.div>

          {/* Floating trust pill */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="absolute -bottom-6 -left-4 md:left-6 bg-bone shadow-xl shadow-ink/10 px-6 py-5 rounded-sm max-w-xs"
          >
            <p className="overline text-deep mb-1">Lab-tested reduction</p>
            <p className="display text-2xl text-ink leading-tight">Up to 95% free chlorine</p>
            <p className="text-[11px] text-muted mt-2 leading-snug">
              Per independent third-party lab testing of filter media at rated flow.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
