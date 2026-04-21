"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

export default function HomeCTA() {
  return (
    <section className="relative bg-deep text-bone py-32 md:py-48 overflow-hidden" data-surface="dark">
      {/* Ambient breathing blobs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-[500px] h-[500px] rounded-full bg-sage/25 blur-[120px]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] rounded-full bg-bone/10 blur-[140px]"
        animate={{ scale: [1.1, 1, 1.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10 text-center">
        <Reveal>
          <p className="overline text-bone/60 mb-6">Start the ritual</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display text-[13vw] md:text-[8vw] leading-[0.95] max-w-5xl mx-auto">
            Pure water
            <br />
            for a <span className="display-italic text-sage">pure you.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-10 text-[16px] md:text-[18px] leading-relaxed text-bone/70 max-w-xl mx-auto">
            Free shipping with subscription. First filter is 20% off.
            Swap in under 90 seconds. You can feel it in a week.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/shower#offer" className="btn-primary !bg-bone !text-ink hover:!bg-sage hover:!text-ink">
              Shop now — 20% off first order
            </Link>
            <Link href="/about" className="btn-secondary text-bone">
              Our story →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
