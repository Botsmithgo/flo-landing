"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { FaceIcon, FollicleIcon, HairIcon, DropletIcon } from "@/components/icons/StudyIcons";

const STUDY_STATS = [
  { n: "91%", l: "Reduced acne & skin irritation", Icon: FaceIcon },
  { n: "82%", l: "Noticed less dryness & breakage", Icon: FollicleIcon },
  { n: "87%", l: "Experienced less hair frizz", Icon: HairIcon },
  { n: "90%", l: "Felt better water pressure", Icon: DropletIcon },
];

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

        {/* 4-week perception study stats — illustrated */}
        <Reveal delay={0.05}>
          <p className="display italic text-2xl md:text-3xl text-deep mb-10 max-w-2xl leading-snug">
            Results from a consumer perception study with all hair types, after 4 weeks.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 py-10 border-y border-ink/10">
            {STUDY_STATS.map((s) => (
              <div key={s.n} className="flex flex-col items-start">
                <s.Icon className="text-deep mb-4" size={52} />
                <p className="display text-4xl md:text-[56px] leading-none text-deep">{s.n}</p>
                <p className="text-[12px] md:text-[13px] mt-3 text-muted leading-snug max-w-[200px]">{s.l}</p>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-4 text-[11px] text-muted max-w-lg">
            *Results from a 4-week consumer perception study. Self-reported. Individual outcomes vary.
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
