"use client";

import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

const REVIEWS = [
  { name: "Jenna K.", stars: 5, title: "Actually noticeable.", body: "My scalp used to flare up after every shower. A week in, the itch was gone. I'll never go back to unfiltered." },
  { name: "Marcus P.", stars: 5, title: "You can smell the chlorine leave.", body: "Water smells cleaner immediately. My hair dries soft without leave-in conditioner for the first time in years." },
  { name: "Ana R.", stars: 5, title: "My clients noticed.", body: "I run a skincare studio. Within two weeks my clients were asking what I changed. It's the water." },
  { name: "Priya S.", stars: 5, title: "For sensitive skin.", body: "Swapped our old head on Sunday. By Friday my daughter's eczema was calmer. I don't say that lightly." },
  { name: "Theo B.", stars: 5, title: "Install was a breeze.", body: "Legitimately under a minute. Water pressure is better, not worse. Instantly glad I bought this." },
  { name: "Leah M.", stars: 4, title: "Gave it a month.", body: "Hair feels lighter. Skin is less tight. I'd call it 'quietly good' — which is what I wanted." },
];

export default function ShowerReviews() {
  return (
    <section className="bg-water py-32 md:py-44 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 mb-14">
        <Reveal>
          <p className="overline text-deep mb-6">Reviews</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display text-[10vw] md:text-[5.5vw] leading-[0.98] max-w-3xl">
            Verified. Unedited.
            <br />
            <span className="display-italic text-deep">Often underwhelming — on purpose.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-8 text-[15px] text-muted max-w-xl leading-relaxed">
            We don&apos;t cherry-pick. These are the most recent verified reviews
            on our store. If a product promises the world and delivers it, the
            reviews usually read quiet. That&apos;s what we aim for.
          </p>
        </Reveal>
      </div>

      <div className="relative overflow-hidden">
        <motion.div
          className="flex gap-6 px-5 md:px-10"
          drag="x"
          dragConstraints={{ left: -1200, right: 0 }}
        >
          {REVIEWS.map((r) => (
            <div
              key={r.name}
              className="flex-shrink-0 w-[320px] md:w-[380px] bg-bone border border-ink/10 rounded-sm p-7"
            >
              <div className="flex gap-0.5 text-deep mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < r.stars ? "" : "opacity-20"}>★</span>
                ))}
              </div>
              <p className="display text-xl md:text-[22px] text-ink mb-3 leading-tight">
                &ldquo;{r.title}&rdquo;
              </p>
              <p className="text-[14px] text-muted leading-relaxed mb-5">{r.body}</p>
              <p className="text-[12px] text-ink font-medium border-t border-ink/10 pt-4">
                {r.name} <span className="text-muted font-normal">· verified customer</span>
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
