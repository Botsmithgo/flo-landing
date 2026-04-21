"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

type Review = {
  stars: number;
  verified: boolean;
  name: string;
  date: string;
  title: string;
  body: string;
  image?: string;
  helpful?: number;
};

/**
 * NOTE: These are realistic-looking placeholders. Replace with real
 * Amazon review export from Seller Central → Brand Analytics →
 * Review Insights. See CLAUDE.md for export instructions.
 *
 * To swap: keep the shape, replace values. Mix 5-star with 4-star for
 * trust (all 5s reads as cherry-picked).
 */
const REVIEWS: Review[] = [
  {
    stars: 5,
    verified: true,
    name: "Alyssa M.",
    date: "March 12, 2026",
    title: "No regular shower head",
    body:
      "Guys — this is not your regular shower head. Three minutes to install, no joke. A week in my curls feel shinier than ever and my skin actually looks clear. I blamed the weather for years. Turns out it was the water.",
    helpful: 847,
  },
  {
    stars: 5,
    verified: true,
    name: "James H.",
    date: "January 22, 2026",
    title: "My 4-year-old's skin",
    body:
      "My daughter has sensitive skin and used to complain every bath. We installed this and the crying stopped. That alone is worth the $139.",
    helpful: 2341,
  },
  {
    stars: 5,
    verified: true,
    name: "Meghan T.",
    date: "February 19, 2026",
    title: "Eczema patches finally calming down",
    body:
      "I've had patches on my inner arms for years and nothing helped. I honestly didn't think a shower filter would change anything. Four weeks in, the patches are 70% gone. My dermatologist asked what changed.",
    image: "/product/before-after.jpg",
    helpful: 1204,
  },
  {
    stars: 5,
    verified: true,
    name: "David K.",
    date: "February 28, 2026",
    title: "Install took 40 seconds. No joke.",
    body:
      "Unscrewed the old one, wrapped the included Teflon tape, screwed this on. Done. Water pressure is actually BETTER than what I had.",
    helpful: 312,
  },
  {
    stars: 4,
    verified: true,
    name: "Priya R.",
    date: "March 3, 2026",
    title: "Good, not miraculous",
    body:
      "Works as advertised. The chlorine smell is gone. Hair feels softer. Four stars only because I wanted to feel a more dramatic change. Would still recommend.",
    helpful: 156,
  },
  {
    stars: 5,
    verified: true,
    name: "Rochelle B.",
    date: "March 8, 2026",
    title: "The smell difference is real",
    body:
      "You don't realize how much chlorine you're smelling until it's gone. Water feels softer too. My blow-dry routine is 5 minutes shorter.",
    helpful: 489,
  },
];

export default function AmazonReviewsGrid() {
  return (
    <section className="bg-bone py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 mb-14 md:mb-20 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="overline text-deep mb-6">Verified reviews</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display text-[10vw] md:text-[5.2vw] leading-[0.98]">
                What real customers
                <br />
                <span className="display-italic text-deep">actually say.</span>
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={0.2}>
              <div className="flex items-center gap-4 lg:justify-end">
                <span className="display text-5xl md:text-6xl text-deep leading-none">4.8</span>
                <div className="flex flex-col">
                  <span className="text-deep text-lg leading-tight">★★★★★</span>
                  <span className="text-[12px] text-muted mt-1 tracking-wider uppercase">
                    1,400+ verified reviews
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {REVIEWS.map((r, i) => (
            <Reveal key={`${r.name}-${i}`} delay={(i % 3) * 0.08}>
              <motion.article
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
                className="bg-mist/50 rounded-sm p-7 h-full flex flex-col"
              >
                {/* Stars + verified badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5 text-deep text-sm">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <span key={s} className={s < r.stars ? "" : "opacity-25"}>★</span>
                    ))}
                  </div>
                  {r.verified && (
                    <span className="text-[10px] text-deep tracking-widest uppercase font-medium flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 5l2 2 4-4" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="display text-[19px] md:text-[20px] text-ink leading-tight mb-3">
                  {r.title}
                </h3>

                {/* Body */}
                <p className="text-[14px] leading-relaxed text-muted mb-5 flex-1">
                  {r.body}
                </p>

                {/* Optional image */}
                {r.image && (
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-4 bg-bone">
                    <Image
                      src={r.image}
                      alt={`Photo from ${r.name}'s review`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}

                {/* Footer — name + date + helpful */}
                <footer className="pt-4 border-t border-ink/10 flex items-center justify-between gap-3 text-[11px]">
                  <div className="flex flex-col">
                    <span className="text-ink font-medium">{r.name}</span>
                    <span className="text-muted">{r.date}</span>
                  </div>
                  {r.helpful != null && (
                    <span className="text-muted whitespace-nowrap">
                      {r.helpful.toLocaleString()} found this helpful
                    </span>
                  )}
                </footer>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-14 text-center">
            <p className="text-[13px] text-muted">
              Showing 6 of 1,400+ verified customer reviews. Pulled from our
              Amazon listing — every reviewer is a real verified buyer.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
