"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal from "@/components/Reveal";

export default function HomeFounder() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="bg-ink text-bone py-32 md:py-44 overflow-hidden" data-surface="dark">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-20 items-center">
        <div className="md:col-span-5 relative aspect-[4/5] overflow-hidden rounded-sm">
          <motion.div style={{ y: imgY }} className="absolute inset-0 scale-110">
            <Image
              src="/product/hair-lifestyle.jpg"
              alt="Soft, healthy hair — the quiet result of cleaner water"
              fill
              className="object-cover object-[55%_center]"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </motion.div>
        </div>

        <div className="md:col-span-7">
          <Reveal>
            <p className="overline text-bone/60 mb-6">A quiet thesis</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[9vw] md:text-[4.8vw] leading-[1] max-w-2xl">
              Skincare got a whole routine.
              <br />
              <span className="display-italic text-sage">Water got nothing.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-10 text-[16px] md:text-[17px] leading-relaxed text-bone/70 max-w-xl">
              Most of what&apos;s on your skin and hair every day isn&apos;t product —
              it&apos;s the water you rinse with. Chlorine. Heavy metals. Residual
              sediment. None of them belong in a morning routine.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <p className="mt-6 text-[16px] md:text-[17px] leading-relaxed text-bone/70 max-w-xl">
              We started Feels Like Om because the quietest ingredient in your
              routine deserved the same attention as the loud ones.
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <Link href="/about" className="mt-10 inline-block overline text-bone border-b border-bone/40 pb-1 hover:border-bone transition-colors">
              Read the full story →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
