import Reveal from "@/components/Reveal";

const STATS = [
  { n: "100K+", l: "Orders shipped" },
  { n: "4.8★", l: "Average rating" },
  { n: "5M+", l: "Views on TikTok" },
  { n: "60 days", l: "Money-back guarantee" },
];

export default function BrandCredibility() {
  return (
    <section className="bg-bone py-20 md:py-24 border-y border-ink/10">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
            {STATS.map((s, i) => (
              <div
                key={s.l}
                className={`text-center md:text-left ${
                  i < STATS.length - 1 ? "md:border-r md:border-ink/10 md:pr-6" : ""
                }`}
              >
                <p className="display text-[11vw] md:text-[5vw] lg:text-[4vw] leading-none text-deep">
                  {s.n}
                </p>
                <p className="mt-3 text-[11px] md:text-[12px] tracking-widest uppercase text-muted">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
