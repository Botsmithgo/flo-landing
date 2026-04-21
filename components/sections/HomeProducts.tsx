"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/Reveal";
import FilterCutawayInteractive from "@/components/sections/FilterCutawayInteractive";
import { PRODUCTS } from "@/lib/checkout";

export default function HomeProducts() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="bg-mist py-32 md:py-48 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
        <div className="lg:col-span-7 relative lg:order-1">
          {/* Dark editorial panel — interactive filter cutaway with hover labels */}
          <motion.div
            style={{ y: imgY }}
            className="relative rounded-sm bg-ink p-6 md:p-8 lg:p-10"
            data-surface="dark"
          >
            <FilterCutawayInteractive compact />
          </motion.div>
        </div>

        <div className="lg:col-span-5 lg:order-2 relative z-10">
          <Reveal>
            <p className="overline text-deep mb-6 flex items-center gap-3">
              <span className="inline-block w-6 h-px bg-deep" />
              The product
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h2 className="display text-[11vw] md:text-[5.5vw] leading-[0.98]">
              One filter,
              <br />
              <span className="display-italic text-deep">done right.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-8 text-[16px] md:text-[17px] leading-relaxed text-muted max-w-md">
              Instead of two okay products, we built one exceptional one.
              Twenty stages of filtration — KDF-55, calcium sulfite, activated
              carbon — tuned for the way showers actually behave. Hot, high flow,
              short contact. Reduces chlorine, heavy metals, and odor before they
              touch your skin.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-10 flex items-baseline gap-3">
              <span className="display text-[44px] text-ink leading-none">${PRODUCTS.shower.subscribePrice}</span>
              <span className="text-muted line-through text-lg">${PRODUCTS.shower.price}</span>
              <span className="overline text-deep">subscribe</span>
            </div>
          </Reveal>

          <Reveal delay={0.4}>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/shower#offer" className="btn-primary">
                Shop now — 20% off
                <span aria-hidden>→</span>
              </Link>
              <Link href="/shower" className="btn-secondary">
                How it works
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="mt-10 pt-6 border-t border-ink/15 flex flex-wrap gap-x-5 gap-y-2 text-[11px] tracking-wider uppercase text-muted">
              <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> 100K+ orders shipped</span>
              <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> 5M+ TikTok views</span>
              <span className="flex items-center gap-1.5"><span className="text-deep">✓</span> 60-day returns</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
