"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

export default function ShowerBeforeAfter() {
  return (
    <section className="bg-mist py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="overline text-deep mb-6">Real customers · four weeks</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display text-[10vw] md:text-[5vw] leading-[0.98]">
                The difference you
                <br />
                <span className="display-italic text-deep">actually see.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-[15px] md:text-[16px] leading-relaxed text-muted max-w-md">
                Softer, shinier hair. Fewer breakouts. Less of the tightness
                chlorine leaves behind. These are customers who did nothing but
                change their shower head.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 grid grid-cols-2 gap-6 pt-8 border-t border-ink/15">
                <div>
                  <p className="display text-2xl md:text-3xl text-deep">91%</p>
                  <p className="text-[12px] text-muted mt-2 leading-snug">Reduced acne &amp; skin irritation</p>
                </div>
                <div>
                  <p className="display text-2xl md:text-3xl text-deep">87%</p>
                  <p className="text-[12px] text-muted mt-2 leading-snug">Experienced less hair frizz</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[960/560] rounded-sm overflow-hidden bg-bone shadow-xl shadow-ink/10"
              >
                <Image
                  src="/product/before-after.jpg"
                  alt="Before and after — softer hair and clearer skin after 4 weeks with the Feels Like Om filter"
                  fill
                  className="object-cover object-left"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </motion.div>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-4 text-[11px] text-muted leading-relaxed">
                *Individual results vary. Photos are from customers using the
                Feels Like Om filter daily for four weeks, alongside their
                existing skincare and hair routine.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
