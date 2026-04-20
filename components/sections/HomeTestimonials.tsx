"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

const TESTIMONIALS = [
  {
    quote: "My scalp used to flare up after every shower. A week in, the itch was gone. I'll never go back to unfiltered.",
    name: "Jenna K.",
    meta: "Verified shower filter customer",
  },
  {
    quote: "You can literally smell the chlorine leave the water. My hair dries soft without leave-in conditioner for the first time in years.",
    name: "Marcus P.",
    meta: "Verified shower filter customer",
  },
  {
    quote: "I run a studio. My clients keep asking what changed. It's the water.",
    name: "Ana R.",
    meta: "Verified shower filter customer",
  },
  {
    quote: "Replaced our showerhead on Sunday. By Friday my daughter's eczema patches were calmer. I don't say that lightly.",
    name: "Priya S.",
    meta: "Verified shower filter customer",
  },
];

export default function HomeTestimonials() {
  return (
    <section className="bg-bone py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex items-center gap-3 mb-6">
            <span className="overline text-muted">What people say</span>
            <span className="hairline flex-1 text-ink" />
          </div>
        </Reveal>

        {/* 4-week perception study stats */}
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6 py-14 border-y border-ink/10">
            <Stat number="91%" label="reported reduced skin irritation" />
            <Stat number="87%" label="noticed less hair frizz" />
            <Stat number="82%" label="felt less dryness & breakage" />
            <Stat number="90%" label="preferred the water pressure" />
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-4 text-[12px] text-muted max-w-lg">
            Four-week consumer perception study, self-reported. Individual results vary.
          </p>
        </Reveal>

        {/* Quotes grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <motion.blockquote
                className="p-8 md:p-10 bg-mist rounded-sm h-full flex flex-col justify-between min-h-[240px]"
                whileHover={{ y: -3 }}
                transition={{ duration: 0.4 }}
              >
                <div>
                  <div className="flex gap-0.5 text-deep mb-5">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s}>★</span>
                    ))}
                  </div>
                  <p className="display text-[22px] md:text-[25px] leading-[1.25] text-ink">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <footer className="mt-8 pt-5 border-t border-ink/10">
                  <p className="text-[14px] font-medium text-ink">{t.name}</p>
                  <p className="text-[11px] text-muted tracking-wider uppercase mt-1">{t.meta}</p>
                </footer>
              </motion.blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <p className="display text-4xl md:text-[56px] leading-none text-deep">{number}</p>
      <p className="text-[12px] md:text-[13px] mt-3 text-muted leading-snug">{label}</p>
    </div>
  );
}
