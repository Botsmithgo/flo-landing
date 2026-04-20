"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Reveal, { RevealText } from "@/components/Reveal";

const PRINCIPLES = [
  {
    n: "I",
    title: "Prefer the quiet claim.",
    body: "If a product promises everything, it doesn&apos;t mean anything. We&apos;d rather tell you it softens the edge of your water than say it changed your life.",
  },
  {
    n: "II",
    title: "Test before you market.",
    body: "Every claim on this site is backed by a third-party lab report. Where we&apos;re not sure, we say so. Where our media can&apos;t do something, we tell you.",
  },
  {
    n: "III",
    title: "Design to disappear.",
    body: "Your bathroom was already beautiful. Our job is not to redecorate it — our job is to improve the water quietly, then step back.",
  },
  {
    n: "IV",
    title: "Favor the daily, small thing.",
    body: "Ten-step skincare routines are the loud cousin. Cleaner water is the quiet one. Both matter, but only one happens to you every single day.",
  },
];

export default function AboutContent() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <>
      {/* Hero */}
      <section ref={ref} className="relative min-h-[90vh] bg-ink text-bone overflow-hidden" data-surface="dark">
        <motion.div style={{ y: imgY }} className="absolute inset-0 -z-0">
          <Image
            src="https://images.unsplash.com/photo-1519417108472-cf20b9daa5ca?w=2400&q=85"
            alt="Soft water falling across hands"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink/80" />
        </motion.div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-5 md:px-10 pt-44 md:pt-56 pb-24">
          <p className="overline text-bone/60 mb-6">Our story</p>
          <h1 className="display text-[13vw] md:text-[8.5vw] leading-[0.95] max-w-5xl">
            <RevealText text="Water is" />
            <br />
            <RevealText text="the quietest" delay={0.15} />
            <br />
            <span className="display-italic text-sage">
              <RevealText text="ingredient." delay={0.3} />
            </span>
          </h1>
        </div>
      </section>

      {/* Long-form story */}
      <section className="bg-bone py-32 md:py-44">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-14 md:gap-20">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <Reveal>
              <p className="overline text-deep mb-6">A small thesis</p>
              <p className="display italic text-3xl md:text-4xl leading-tight text-deep">
                &ldquo;What if the daily step you take most — with no product
                involved — was the one worth upgrading first?&rdquo;
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8 space-y-8 text-[17px] md:text-[18px] leading-[1.7] text-ink/80">
            <Reveal>
              <p>
                Feels Like Om started in a bathroom in Venice, California, in 2022.
                The founders weren&apos;t water engineers. They were two people with
                very dry skin who kept wondering why none of the expensive
                moisturizers were working.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                When you look at the water leaving most U.S. municipalities, it&apos;s
                technically safe to drink. But by the time it lands in your shower,
                it&apos;s been chlorinated, re-treated, and pushed through miles of
                pipe. Chlorine, chloramine, trace metals, and sediment show up at
                the faucet whether you live in Beverly Hills or Brooklyn.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                We built FLO to handle the water side of the equation. Not as a
                miracle fix, not as a cure — but as a small, daily shift that takes
                the chemical edge off the water that touches your body 365 days a
                year.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p>
                We&apos;re a small company. We test what we sell. We publish the
                numbers. We say what the product can&apos;t do. And we believe
                quiet, honest products always outlast loud ones.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="display italic text-2xl md:text-3xl text-deep leading-snug pt-4">
                True beauty starts with clean water. The rest is just marketing.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-mist py-32 md:py-44">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal>
            <p className="overline text-deep mb-6">How we build</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[10vw] md:text-[5.5vw] leading-[0.98] max-w-3xl">
              Four principles.
              <br />
              <span className="display-italic text-deep">Held lightly, applied often.</span>
            </h2>
          </Reveal>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.1}>
                <div className="pt-6 border-t border-ink/15">
                  <p className="display italic text-2xl text-deep mb-6">{p.n}.</p>
                  <h3 className="display text-2xl md:text-[30px] text-ink mb-5 leading-tight">{p.title}</h3>
                  <p className="text-[15px] md:text-[16px] leading-relaxed text-muted" dangerouslySetInnerHTML={{ __html: p.body }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="bg-ink text-bone py-32 md:py-44" data-surface="dark">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 text-center">
          <Reveal>
            <p className="overline text-bone/60 mb-6">One last thing</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[11vw] md:text-[5.5vw] leading-[0.98] max-w-4xl mx-auto">
              If this resonates,
              <br />
              <span className="display-italic text-sage">start with one filter.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 text-[16px] md:text-[17px] leading-relaxed text-bone/70 max-w-xl mx-auto">
              The shower filter is the easiest place to begin. You&apos;ll feel it
              in a week. If you don&apos;t, we&apos;ll take it back.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shower#offer" className="btn-primary !bg-bone !text-ink hover:!bg-sage">
                Shop the shower filter
              </Link>
              <Link href="/bath" className="btn-secondary text-bone">
                Or the bath filter →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
