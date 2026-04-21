import Reveal from "@/components/Reveal";

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
    <section className="bg-ink text-bone py-32 md:py-44" data-surface="dark">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="overline text-bone/60 mb-6">What your tap water actually contains</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display text-[11vw] md:text-[6vw] leading-[0.98] max-w-5xl">
            You&apos;re not just rinsing off.
            <br />
            <span className="display-italic text-sage">You&apos;re rinsing in.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-10 max-w-2xl text-[16px] md:text-[17px] leading-relaxed text-bone/70">
            Your water meets the EPA&apos;s drinking standard. But &ldquo;safe to drink&rdquo;
            is the wrong question — the EPA sets no standard for what twenty minutes of
            daily contact does to your hair and skin. What comes out of your shower passes
            every legal test. Your scalp isn&apos;t impressed.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 md:gap-y-12 border-t border-bone/10 pt-14">
          {CONTAMINANTS.map((c, i) => (
            <Reveal key={c.n} delay={i * 0.08}>
              <div className="pt-6 border-t border-bone/15">
                <p className="display text-3xl md:text-[36px] text-sage leading-tight mb-4">{c.n}</p>
                <p className="text-[14px] md:text-[15px] leading-relaxed text-bone/65 max-w-md">{c.line}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.5}>
          <p className="mt-20 display italic text-2xl md:text-[32px] text-bone leading-tight max-w-2xl">
            The EPA tests your water. No one tests what it does to you.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
