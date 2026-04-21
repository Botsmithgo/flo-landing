"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { FollicleIcon, DropletIcon } from "@/components/icons/StudyIcons";

/**
 * Consolidated proof panel — comparison images stacked on the left,
 * stats stacked on the right. Fills the container tightly (less dead space
 * than a centered hero image with stats below).
 */

type Stat = {
  pct: string;
  label: string;
  kind: "illus" | "icon";
  illusSrc?: string;
  IconComponent?: typeof FollicleIcon;
};

const STATS: Stat[] = [
  {
    pct: "91%",
    label: "Reduced acne & skin irritation",
    kind: "illus",
    illusSrc: "/product/illus-skin.png",
  },
  {
    pct: "87%",
    label: "Experienced less hair frizz",
    kind: "illus",
    illusSrc: "/product/illus-hair.png",
  },
  {
    pct: "82%",
    label: "Noticed less dryness & breakage",
    kind: "icon",
    IconComponent: FollicleIcon,
  },
  {
    pct: "90%",
    label: "Felt better water pressure",
    kind: "icon",
    IconComponent: DropletIcon,
  },
];

export default function ShowerResults() {
  return (
    <section className="bg-mist py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        {/* HEADER — left-aligned, tight */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <Reveal>
            <p className="overline text-deep mb-6">Four-week study · all hair types</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[11vw] md:text-[5.4vw] leading-[0.98]">
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

        {/* 2-COLUMN: stacked comparison images LEFT, stacked stats RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* LEFT — two before/after panels stacked vertically */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <Reveal delay={0.25}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[397/290]"
              >
                <Image
                  src="/product/comparison-acne.png"
                  alt="Before and after — clearer skin after four weeks"
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(20,28,34,0.14)]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </motion.div>
            </Reveal>
            <Reveal delay={0.35}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative aspect-[391/286]"
              >
                <Image
                  src="/product/comparison-hair.png"
                  alt="Before and after — softer, shinier hair after four weeks"
                  fill
                  className="object-contain drop-shadow-[0_20px_50px_rgba(20,28,34,0.14)]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </motion.div>
            </Reveal>
          </div>

          {/* RIGHT — stats stacked vertically */}
          <div className="lg:col-span-5 space-y-6 md:space-y-8">
            {STATS.map((s, i) => (
              <Reveal key={s.pct} delay={0.3 + i * 0.06}>
                <div className="flex items-center gap-5 pt-6 border-t border-ink/15">
                  <div className="flex-shrink-0 h-14 w-14 md:h-16 md:w-16 flex items-center justify-center">
                    {s.kind === "illus" && s.illusSrc ? (
                      <Image
                        src={s.illusSrc}
                        alt=""
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    ) : s.IconComponent ? (
                      <s.IconComponent className="text-deep" size={44} />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className="display text-[12vw] md:text-[3.2vw] lg:text-[2.6vw] leading-none text-deep">
                      {s.pct}
                    </p>
                    <p className="mt-2 text-[13px] md:text-[14px] leading-snug text-muted">
                      {s.label}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
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
