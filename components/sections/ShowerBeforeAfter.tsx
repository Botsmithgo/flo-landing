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

            {/* Stats with brand illustrations */}
            <Reveal delay={0.3}>
              <div className="mt-10 grid grid-cols-2 gap-4 md:gap-6 pt-8 border-t border-ink/15">
                <div className="flex flex-col items-start">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3">
                    <Image
                      src="/product/illus-skin.png"
                      alt=""
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                  <p className="display text-2xl md:text-3xl text-deep leading-none">91%</p>
                  <p className="text-[12px] text-muted mt-2 leading-snug">Reduced acne &amp; skin irritation</p>
                </div>
                <div className="flex flex-col items-start">
                  <div className="relative w-16 h-16 md:w-20 md:h-20 mb-3">
                    <Image
                      src="/product/illus-hair.png"
                      alt=""
                      fill
                      className="object-contain"
                      sizes="80px"
                    />
                  </div>
                  <p className="display text-2xl md:text-3xl text-deep leading-none">87%</p>
                  <p className="text-[12px] text-muted mt-2 leading-snug">Experienced less hair frizz</p>
                </div>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-[960/500]"
              >
                {/* Transparent PNG floats on the section's mist bg — no container */}
                <Image
                  src="/product/comparison-clean.png"
                  alt="Before and after — softer hair and clearer skin after 4 weeks with the Feels Like Om filter"
                  fill
                  className="object-contain drop-shadow-[0_20px_60px_rgba(20,28,34,0.12)]"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </motion.div>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 text-[11px] text-muted leading-relaxed text-center lg:text-left">
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
