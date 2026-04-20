"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { RevealText } from "@/components/Reveal";

export default function HomeHero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen min-h-[720px] w-full overflow-hidden bg-ink text-bone"
      data-surface="dark"
    >
      {/* Background image — clean editorial bathroom scene */}
      <motion.div
        style={{ y: imgY }}
        className="absolute inset-0 -z-0"
      >
        <Image
          src="/product/bathroom-scene.jpg"
          alt="A quiet luxury bathroom in warm morning light"
          fill
          priority
          className="object-cover object-[35%_center]"
          sizes="100vw"
        />
        {/* Darker gradient at the bottom for text legibility; top stays natural */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-ink/35 to-ink/75" />
      </motion.div>

      {/* Soft ripple blobs */}
      <div className="absolute inset-0 overflow-hidden -z-0">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] rounded-full bg-sage/15 blur-[120px] breathe" />
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-deep/25 blur-[140px] breathe" style={{ animationDelay: "3s" }} />
      </div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 h-full mx-auto max-w-[1400px] px-5 md:px-10 flex flex-col justify-end pb-20 md:pb-28"
      >
        <p className="overline text-bone/70 mb-6">A ritual of quieter water</p>

        <h1 className="display text-[13vw] md:text-[9vw] leading-[0.92] max-w-[1200px]">
          <RevealText text="Clean water," />
          <br />
          <span className="display-italic text-sage">
            <RevealText text="softer everything." delay={0.2} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-10 max-w-lg text-[15px] md:text-[17px] leading-relaxed text-bone/75"
        >
          Shower and bath filters that quietly take the edge off your water —
          chlorine, heavy metals, the chemicals that dry your hair and irritate your skin.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row items-start gap-4"
        >
          <Link href="/shower" className="btn-primary !bg-bone !text-ink hover:!bg-sand">
            Shop the shower filter
            <span aria-hidden>→</span>
          </Link>
          <Link href="/about" className="text-[13px] tracking-widest uppercase px-4 py-3 text-bone/80 hover:text-bone transition-colors border-b border-bone/30">
            Read the story
          </Link>
        </motion.div>

        {/* Trust stripe */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 text-[11px] tracking-[0.18em] uppercase text-bone/55"
        >
          <span className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.8 4 4.2.4-3.2 2.8 1 4.2L7 10l-3.8 2.4 1-4.2L1 5.4l4.2-.4L7 1z" fill="currentColor"/></svg>
            Independently lab-tested
          </span>
          <span>Prop 65 compliant brass</span>
          <span>Free U.S. shipping over $49</span>
          <span>60-day returns</span>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-bone/60 text-[10px] tracking-[0.3em] uppercase"
      >
        <span className="block animate-bounce">↓</span>
      </motion.div>
    </section>
  );
}
