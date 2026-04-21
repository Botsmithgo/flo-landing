"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

/**
 * Consolidated proof panel — stats anchor the LEFT column (big numbers,
 * clean text, no icons), comparison panels float on the RIGHT.
 *
 * Headline sizes capped with clamp so they don't explode on wide viewports.
 */

const STATS = [
  { pct: "91%", label: "Reduced acne & skin irritation" },
  { pct: "87%", label: "Experienced less hair frizz" },
  { pct: "82%", label: "Noticed less dryness & breakage" },
  { pct: "90%", label: "Felt better water pressure" },
];

export default function ShowerResults() {
  return (
    <section className="bg-mist py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* HEADER — capped size so it never explodes on wide viewports */}
        <div className="max-w-3xl mb-14 md:mb-20">
          <Reveal>
            <p className="overline text-deep mb-6">Four-week study · all hair types</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2
              className="display leading-[0.98]"
              style={{ fontSize: "clamp(36px, 6vw, 76px)" }}
            >
              Healthier skin and hair
              <br />
              <span className="display-italic text-deep">start here.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 text-[15px] md:text-[16px] leading-relaxed text-muted max-w-xl">
              200 customers. The same four questions each week for four weeks.
              No paid actors, no clinical trial — just real people who swapped one
              shower head.
            </p>
          </Reveal>
        </div>

        {/* 2-COLUMN: stats LEFT (hero numbers), images RIGHT (smaller, stacked) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          {/* LEFT — 4 stacked stats, big numbers, no icons */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-x-8 gap-y-12 md:gap-y-16">
            {STATS.map((s, i) => (
              <Reveal key={s.pct} delay={0.25 + i * 0.08}>
                <div className="pt-5 border-t border-ink/15">
                  <p
                    className="display leading-none text-deep"
                    style={{ fontSize: "clamp(56px, 6vw, 86px)" }}
                  >
                    {s.pct}
                  </p>
                  <p className="mt-4 text-[13px] md:text-[14px] leading-snug text-muted max-w-[220px]">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* RIGHT — 2 before/after panels stacked, smaller */}
          <div className="lg:col-span-5 space-y-5 md:space-y-6 lg:sticky lg:top-32">
            <Reveal delay={0.3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[397/290]"
              >
                <Image
                  src="/product/comparison-acne.png"
                  alt="Before and after — clearer skin after four weeks"
                  fill
                  className="object-contain drop-shadow-[0_16px_40px_rgba(20,28,34,0.12)]"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
              </motion.div>
            </Reveal>
            <Reveal delay={0.4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[391/286]"
              >
                <Image
                  src="/product/comparison-hair.png"
                  alt="Before and after — softer, shinier hair after four weeks"
                  fill
                  className="object-contain drop-shadow-[0_16px_40px_rgba(20,28,34,0.12)]"
                  sizes="(max-width: 1024px) 100vw, 35vw"
                />
              </motion.div>
            </Reveal>
          </div>
        </div>

        {/* Disclaimer */}
        <Reveal delay={0.6}>
          <p className="mt-14 text-[11px] text-muted max-w-2xl leading-relaxed">
            *Results are self-reported. Individual outcomes vary. Photos are from
            customers using the Feels Like Om filter daily for four weeks,
            alongside their existing skincare and hair routine.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
