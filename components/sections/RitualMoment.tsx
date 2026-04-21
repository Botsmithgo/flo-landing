"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/Reveal";

export default function RitualMoment() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section ref={ref} className="relative w-full h-[70vh] md:h-[85vh] min-h-[500px] overflow-hidden bg-ink" data-surface="dark">
      <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
        <Image
          src="/product/bathroom-scene.jpg"
          alt="A quiet luxury bathroom in warm morning light"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
      </motion.div>

      {/* Soft bottom vignette for text legibility */}
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/60 via-ink/20 to-transparent" />

      {/* Minimal text overlay — poetic bridge, not pitch */}
      <div className="absolute inset-0 flex items-end pb-16 md:pb-24">
        <div className="mx-auto max-w-[1400px] w-full px-5 md:px-10">
          <Reveal>
            <p className="overline text-bone/70 mb-4">Before skincare</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="display text-[8vw] md:text-[4.5vw] leading-[1] text-bone max-w-3xl">
              Before every serum, every mask —
              <br />
              <span className="display-italic text-bone/80">there&rsquo;s the water.</span>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
