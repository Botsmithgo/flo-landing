"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

type Review = {
  stars: number;
  amazon: boolean;
  name: string;
  title: string;
  body: string;
};

/**
 * Real Amazon review excerpts from /Users/admin/Downloads/Reviews.xlsx
 * imported 2026-04-29. Embedded workbook images were intentionally omitted.
 * Excerpts are trimmed for length and compliance clarity.
 */
const REVIEWS: Review[] = [
  {
    stars: 5,
    amazon: true,
    name: "R. Rodas",
    title: "I can honestly feel a huge difference",
    body:
      "My skin feels noticeably softer, my hair is smoother, and even my face feels cleaner and more refreshed after every shower. It’s gentle but still has great water pressure. Installation was super quick and easy, and the design looks modern in my bathroom.",
  },
  {
    stars: 5,
    amazon: true,
    name: "Lisa",
    title: "Showering finally feels soothing",
    body:
      "My skin and hair react to everything. Since using the Feels Like Om filtered showerhead, my skin feels calmer, my hair is noticeably less dry, and showering finally feels soothing instead of stressful. I also wanted to note that it has great pressure.",
  },
  {
    stars: 5,
    amazon: true,
    name: "Bryan Swords",
    title: "Beautiful in my bathroom",
    body:
      "I am absolutely loving my Feels Like Om Shower Filter. Not only does it look beautiful in my bathroom, but it has transformed my shower experience. My skin feels softer, my hair is smoother, and I can actually feel the difference in water quality.",
  },
  {
    stars: 5,
    amazon: true,
    name: "Leyla",
    title: "Amazing for dry hair and skin",
    body:
      "I purchased this shower filter because my hair was extremely dry and nothing I tried seemed to help. After using it for two weeks, my hair feels much softer, smoother, and healthier. It also helps my skin feel less itchy and my hair shinier.",
  },
  {
    stars: 5,
    amazon: true,
    name: "Savanah Raquel",
    title: "Worth it",
    body:
      "My husband and I have been looking into shower head filters. This was a quick and easy install, and our water pressure changed dramatically. I have very dry skin, especially in winter, and after a month my skin isn’t itchy from the water anymore.",
  },
];

export default function AmazonReviewsGrid() {
  return (
    <section className="bg-bone py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 mb-14 md:mb-20 items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="overline text-deep mb-6">Amazon reviews</p>
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
                  {r.amazon && (
                    <span className="text-[10px] text-deep tracking-widest uppercase font-medium flex items-center gap-1">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 5l2 2 4-4" />
                      </svg>
                      Amazon
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

                {/* Footer — name + source */}
                <footer className="pt-4 border-t border-ink/10 flex items-center justify-between gap-3 text-[11px]">
                  <div className="flex flex-col">
                    <span className="text-ink font-medium">{r.name}</span>
                    <span className="text-muted">Amazon customer review</span>
                  </div>
                </footer>
              </motion.article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-14 text-center">
            <p className="text-[13px] text-muted">
              Showing 5 selected Amazon customer reviews, excerpted for length.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
