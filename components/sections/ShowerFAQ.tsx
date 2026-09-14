"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "@/components/Reveal";
import { track } from "@/lib/analytics";

const FAQ = [
  {
    q: "How does installation work?",
    a: "Unscrew your current shower head, screw on the FLO, tighten by hand. The included Teflon tape handles the seal. Total time: under 90 seconds. Fits every standard U.S. shower arm.",
  },
  {
    q: "How often do I replace the filter?",
    a: "Every six months, or 12,000 gallons — whichever comes first. Subscribers get replacements auto-shipped; one-time buyers can reorder at feelslikeom.shop anytime.",
  },
  {
    q: "Will this lower my water pressure?",
    a: "No. The 20-stage filter is designed with a wide flow path so you get full-pressure showers. Most customers actually report pressure feels better — we think it's the wide spray face, not magic.",
  },
  {
    q: "Does it remove chloramine?",
    a: "Chloramine is harder to reduce than free chlorine — it's more stable in water and doesn't off-gas. Our 20-stage stack reduces some chloramine, but expect partial reduction rather than complete removal, especially if you live in a chloramine-heavy city (parts of CA, Denver, DC, Philly).",
  },
  {
    q: "How does it help with hard water?",
    a: "The cartridge combines filtration and water-conditioning stages designed to help reduce chlorine, mineral buildup, and the drying effects associated with hard water. Many customers describe the water as feeling softer. Results vary with local water chemistry and flow; homes with extreme hardness may still benefit from whole-home treatment.",
  },
  {
    q: "What's the subscription like?",
    a: "Your first order ($80) includes the shower head and first filter. After that, a new filter ships every 6 months for $39 with free shipping. Skip, pause, change cadence, or cancel before the next renewal by contacting us from the email used at checkout.",
  },
  {
    q: "Return policy?",
    a: "60 days, full refund, no questions. If the water isn't better than what you had, we don't want your money.",
  },
  {
    q: "Is the housing safe?",
    a: "The housing is a polished chrome finish with a cream filter face. A California Prop 65 notice ships with the product — that's a broad disclosure required on most metal fixtures in California, not a safety concern specific to this product.",
  },
];

export default function ShowerFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-mist py-32 md:py-44 scroll-mt-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
        <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
          <Reveal>
            <p className="overline text-deep mb-6">Questions</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[10vw] md:text-[4.5vw] leading-[0.98]">
              Ask us
              <br />
              <span className="display-italic text-deep">anything.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 text-[15px] text-muted leading-relaxed">
              Still curious after this? {" "}
              <Link href="/contact" className="text-ink border-b border-ink/30">
                Get in touch
              </Link>{" "}
              — we’re here to help.
            </p>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <div className="divide-y divide-ink/15 border-y border-ink/15">
            {FAQ.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q}>
                  <button
                    className="w-full flex items-center justify-between gap-6 py-6 md:py-7 text-left group"
                    onClick={() => {
                      const next = isOpen ? null : i;
                      setOpen(next);
                      if (next !== null) track("faq_expand", { question: item.q, position: i + 1 });
                    }}
                    aria-expanded={isOpen}
                  >
                    <h3 className="display text-xl md:text-2xl text-ink group-hover:text-deep transition-colors m-0 font-normal">
                      {item.q}
                    </h3>
                    <span
                      className={`h-8 w-8 rounded-full border border-ink/30 flex items-center justify-center flex-shrink-0 transition-transform ${
                        isOpen ? "rotate-45 bg-deep text-bone border-deep" : "text-ink"
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pr-10 text-[15px] leading-relaxed text-muted max-w-2xl">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
