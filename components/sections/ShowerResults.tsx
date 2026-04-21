"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { FollicleIcon, DropletIcon } from "@/components/icons/StudyIcons";

/**
 * Consolidated proof panel — replaces the previous ShowerBeforeAfter +
 * ShowerStudy sections with ONE hit.
 *
 * Structure: headline → methodology subhead → floating comparison image
 * → 4-stat row (2 illustrated "emotional" stats + 2 line-icon "technical" stats)
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
        {/* HEADER — center-aligned, editorial */}
        <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
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
            <p className="mt-6 text-[15px] md:text-[16px] leading-relaxed text-muted max-w-xl mx-auto">
              200 customers. The same four questions each week for four weeks.
              No paid actors, no clinical trial — just real people who swapped one
              shower head.
            </p>
          </Reveal>
        </div>

        {/* FLOATING COMPARISON IMAGE — transparent PNG on mist bg */}
        <Reveal delay={0.25}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative aspect-[960/500] max-w-4xl mx-auto"
          >
            <Image
              src="/product/comparison-clean.png"
              alt="Before and after — softer hair and clearer skin after 4 weeks with the Feels Like Om filter"
              fill
              className="object-contain drop-shadow-[0_24px_70px_rgba(20,28,34,0.14)]"
              sizes="(max-width: 768px) 100vw, 80vw"
            />
          </motion.div>
        </Reveal>

        {/* STATS ROW — hero stats get illustrations, technical stats get line icons */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {STATS.map((s, i) => (
            <Reveal key={s.pct} delay={0.3 + i * 0.06}>
              <div className="flex flex-col items-start border-t border-ink/15 pt-6">
                <div className="mb-4 h-16 md:h-20 flex items-end">
                  {s.kind === "illus" && s.illusSrc ? (
                    <div className="relative w-16 h-16 md:w-20 md:h-20">
                      <Image
                        src={s.illusSrc}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="80px"
                      />
                    </div>
                  ) : s.IconComponent ? (
                    <s.IconComponent className="text-deep" size={52} />
                  ) : null}
                </div>
                <p className="display text-[14vw] md:text-[5.2vw] lg:text-[3.8vw] leading-none text-deep">
                  {s.pct}
                </p>
                <p className="mt-4 text-[13px] md:text-[14px] leading-snug text-muted max-w-[200px]">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Disclaimer */}
        <Reveal delay={0.5}>
          <p className="mt-14 text-center text-[11px] text-muted max-w-2xl mx-auto leading-relaxed">
            *Results are self-reported. Individual outcomes vary. Photos are from
            customers using the Feels Like Om filter daily for four weeks,
            alongside their existing skincare and hair routine.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
