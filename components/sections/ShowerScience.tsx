"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/Reveal";

const STAGES = [
  {
    n: "KDF-55",
    title: "Chlorine reduction",
    body: "Copper-zinc redox media. Converts free chlorine to chloride through an electrochemical reaction. The workhorse of the stack.",
  },
  {
    n: "Calcium sulfite",
    title: "Hot-water performance",
    body: "Unlike most media, calcium sulfite holds its effectiveness at shower temperatures (up to ~110°F). Picks up what KDF leaves behind.",
  },
  {
    n: "Activated carbon",
    title: "Odor & taste reduction",
    body: "Porous coconut-shell carbon adsorbs lingering odor and VOCs. Doesn&apos;t lead the stack — but polishes it.",
  },
  {
    n: "Mineral stones",
    title: "Conditioning feel",
    body: "Tourmaline and germanium stones add a bright, softer-feeling finish to the water without altering pH in any meaningful way.",
  },
];

export default function ShowerScience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="science" ref={ref} className="bg-mist py-32 md:py-44 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-14 md:gap-20 items-start">
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <Reveal>
            <p className="overline text-deep mb-6">How it works</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[10vw] md:text-[5vw] leading-[0.98]">
              The media does
              <br />
              <span className="display-italic text-deep">the work.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 text-[15px] md:text-[16px] leading-relaxed text-muted max-w-md">
              Four media working in sequence. We don&apos;t chase marketing buzzwords
              — we pick the ingredients that have independent testing behind them
              and build the stack around how showers actually behave (hot, high flow,
              short contact time).
            </p>
          </Reveal>

          <motion.div
            style={{ y }}
            className="mt-12 relative aspect-square hidden lg:block rounded-sm overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?w=1400&q=85"
              alt="Exploded view of filter media"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className="lg:col-span-7 space-y-10">
          {STAGES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="grid grid-cols-12 gap-6 pt-8 border-t border-ink/15">
                <div className="col-span-12 md:col-span-4">
                  <p className="overline text-deep mb-2">Stage {i + 1}</p>
                  <p className="display text-2xl md:text-[28px] text-ink">{s.n}</p>
                </div>
                <div className="col-span-12 md:col-span-8">
                  <h3 className="text-[17px] text-ink font-medium">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={0.3}>
            <div className="mt-14 rounded-sm bg-bone border border-ink/10 p-8 md:p-10">
              <p className="overline text-deep mb-3">What it doesn&apos;t do</p>
              <p className="text-[15px] leading-relaxed text-ink">
                A shower-head filter can&apos;t soften hard water — that requires
                whole-home ion exchange. What it can do is leave the water
                <span className="italic"> softer-feeling</span>, free of the
                drying edge chlorine gives it. We&apos;d rather be honest about that
                than sell a claim we can&apos;t back up.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
