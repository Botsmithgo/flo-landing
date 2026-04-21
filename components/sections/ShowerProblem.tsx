import Reveal from "@/components/Reveal";

const WHAT_IS_IN_WATER = [
  { n: "Chlorine", line: "Added to kill microbes — but strips lipids and dries hair." },
  { n: "Chloramine", line: "A tougher chlorine cousin used in cities like L.A., DC, Philly." },
  { n: "Heavy metals", line: "Trace lead, copper, and iron from aging infrastructure." },
  { n: "Sediment", line: "Rust flecks and particulates that irritate on contact." },
];

export default function ShowerProblem() {
  return (
    <section className="bg-ink text-bone py-32 md:py-44" data-surface="dark">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="overline text-bone/60 mb-6">The problem you can&apos;t see</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display text-[11vw] md:text-[6vw] leading-[0.98] max-w-5xl">
            You&apos;re not just rinsing off.
            <br />
            <span className="display-italic text-sage">You&apos;re rinsing in.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-10 max-w-xl text-[16px] md:text-[17px] leading-relaxed text-bone/70">
            Municipal water has to travel through miles of pipe to get to you. By
            the time it hits the shower head, it&apos;s been chlorinated, treated,
            and picked up anything the pipes had to offer along the way.
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <p className="mt-6 display italic text-xl md:text-2xl text-sage max-w-2xl leading-snug">
            Tired of acne you can&apos;t explain, hair that keeps breaking,
            water with a smell you&apos;ve stopped noticing?
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 border-t border-bone/10 pt-14">
          {WHAT_IS_IN_WATER.map((w, i) => (
            <Reveal key={w.n} delay={i * 0.08}>
              <div>
                <p className="display text-3xl md:text-[38px] text-sage leading-tight">{w.n}</p>
                <p className="mt-4 text-[13px] leading-relaxed text-bone/60">{w.line}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
