import Reveal from "@/components/Reveal";

// Tighten section padding so the whole Problem beat fits in one viewport on a 1080p screen

const CONTAMINANTS = [
  {
    n: "Chlorine",
    line:
      "The same chemical that keeps public pools safe. Mandated in every US municipal supply. Ten minutes a day, twice a day, adds up to 60 hours a year on your skin.",
  },
  {
    n: "Chloramine",
    line:
      "Used by roughly two-thirds of US public water systems (per CDC data). Unlike chlorine, it doesn't off-gas — you breathe it in for the length of your shower.",
  },
  {
    n: "Heavy metals",
    line:
      "Roughly 9 million US homes still have lead service lines (EPA, 2024). Traces leach every day you shower.",
  },
  {
    n: "Sediment",
    line:
      "Iron, rust, particulates. Picked up between the plant and your shower head — ten to twenty miles of pipe, some of it original to the 1950s.",
  },
];

export default function ShowerProblem() {
  return (
    <section className="bg-ink text-bone py-24 md:py-32" data-surface="dark">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="overline text-bone/60 mb-5">What your tap water actually contains</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            className="display leading-[0.98] max-w-5xl"
            style={{ fontSize: "clamp(36px, 5vw, 68px)" }}
          >
            You&apos;re not just rinsing off.
            <br />
            <span className="display-italic text-sage">You&apos;re rinsing in.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-7 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-bone/70">
            Your water meets the EPA&apos;s drinking standard. But &ldquo;safe to drink&rdquo;
            is the wrong question — the EPA sets no standard for what twenty minutes of
            daily contact does to your hair and skin. What comes out of your shower passes
            every legal test. Your scalp isn&apos;t impressed.
          </p>
        </Reveal>

        <div className="mt-14 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 md:gap-y-10 border-t border-bone/10 pt-10 md:pt-12">
          {CONTAMINANTS.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.08}>
              <div className="pt-5 border-t border-bone/15">
                <p className="display text-2xl md:text-[28px] text-sage leading-tight mb-3">{c.n}</p>
                <p className="text-[13px] md:text-[14px] leading-relaxed text-bone/65 max-w-md">{c.line}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.5}>
          <p
            className="mt-12 display italic text-bone leading-tight max-w-2xl"
            style={{ fontSize: "clamp(18px, 2vw, 26px)" }}
          >
            The EPA tests your water. No one tests what it does to you.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
