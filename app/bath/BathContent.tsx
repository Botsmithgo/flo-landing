"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal, { RevealText } from "@/components/Reveal";
import { PRODUCTS, buildCheckoutUrl } from "@/lib/checkout";

const BENEFITS = [
  { n: "01", t: "No install", b: "Clips to your faucet in seconds. No plumber, no tools." },
  { n: "02", t: "Gentler bath, longer soak", b: "Designed for the slow ritual, not the quick rinse." },
  { n: "03", t: "Refills every 2 months", b: "Replacement filters auto-ship on subscription." },
];

const singleUrl = PRODUCTS.bath.variants.single
  ? buildCheckoutUrl({ variantId: PRODUCTS.bath.variants.single })
  : "https://feelslikeom.shop";

const subUrl = PRODUCTS.bath.variants.subscription
  ? buildCheckoutUrl({
      variantId: PRODUCTS.bath.variants.subscription,
      discount: process.env.NEXT_PUBLIC_FIRST_ORDER_DISCOUNT,
    })
  : "https://feelslikeom.shop";

export default function BathContent() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] bg-mist pt-28 md:pt-36 pb-20 overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="lg:col-span-6">
            <p className="overline text-deep mb-6">The Bath Water Filter</p>
            <h1 className="display text-[13vw] lg:text-[7vw] leading-[0.95]">
              <RevealText text="A slower" />
              <br />
              <RevealText text="kind of" delay={0.15} />
              <br />
              <span className="display-italic text-deep">
                <RevealText text="clean." delay={0.3} />
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="mt-10 text-[16px] md:text-[18px] leading-relaxed text-muted max-w-lg"
            >
              A dechlorinating bath filter that clips to your faucet. Catches
              chlorine and sediment before the water ever touches your skin —
              so the long soak feels like one.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
            >
              <span className="display text-[40px] text-ink leading-none">${PRODUCTS.bath.subscribePrice}</span>
              <span className="text-muted line-through text-lg">${PRODUCTS.bath.price}</span>
              <span className="overline text-deep">with subscription</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.35, duration: 0.7 }}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <a href={subUrl} className="btn-primary">
                Subscribe — 20% off first order
              </a>
              <a href={singleUrl} className="btn-secondary">
                One-time purchase
              </a>
            </motion.div>
          </div>

          <div className="lg:col-span-6 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] overflow-hidden rounded-sm bg-water"
            >
              <Image
                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1600&q=90"
                alt="The Feels Like Om bath water filter clipped to a faucet"
                fill
                priority
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-bone py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal>
            <h2 className="display text-[10vw] md:text-[5vw] leading-[0.98] max-w-3xl">
              A quieter ritual,
              <br />
              <span className="display-italic text-deep">with less in the water.</span>
            </h2>
          </Reveal>
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
            {BENEFITS.map((b, i) => (
              <Reveal key={b.n} delay={i * 0.1}>
                <div className="pt-6 border-t border-ink/15">
                  <p className="overline text-deep mb-6">{b.n}</p>
                  <h3 className="display text-2xl md:text-[28px] text-ink mb-4">{b.t}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{b.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-sell */}
      <section className="bg-deep text-bone py-32 md:py-44 overflow-hidden relative" data-surface="dark">
        <motion.div
          className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-sage/20 blur-[120px]"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative mx-auto max-w-[1400px] px-5 md:px-10 text-center">
          <Reveal>
            <p className="overline text-bone/60 mb-6">Both, ideally</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[11vw] md:text-[6vw] leading-[0.98] max-w-4xl mx-auto">
              Daily shower filter +
              <br />
              <span className="display-italic text-sage">slow soak filter.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 max-w-xl mx-auto text-[16px] leading-relaxed text-bone/70">
              Most of our customers buy the shower head first, then add the bath filter
              when they realize their long soaks are the worst chlorine exposure of the week.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <Link href="/shower#offer" className="mt-12 btn-primary !bg-bone !text-ink hover:!bg-sage inline-flex">
              Shop the shower filter →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
