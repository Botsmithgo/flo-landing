import Reveal from "@/components/Reveal";

const TRUTHS = [
  {
    n: "Yes.",
    title: "It is built for hard-water showers.",
    body: "The cartridge includes filtration and water-conditioning stages designed to help with chlorine, mineral buildup, and the drying effects associated with hard water. Results vary by local water chemistry; extreme hardness may still call for whole-home treatment.",
  },
  {
    n: "No.",
    title: "It won't remove fluoride.",
    body: "Shower contact time is too short for meaningful fluoride reduction. If that's your priority, you need a point-of-use drinking filter, not a shower filter.",
  },
  {
    n: "No.",
    title: "It's not a drug.",
    body: "It won't cure eczema, dandruff, or dermatitis. We think it helps with the drying edge of chlorinated water, and many customers report calmer skin — but that's observation, not clinical evidence.",
  },
];

export default function ShowerHonesty() {
  return (
    <section className="bg-ink text-bone py-32 md:py-44" data-surface="dark">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="overline text-bone/60 mb-6">Clear expectations</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display text-[10vw] md:text-[5vw] leading-[0.98]">
                What it does.
                <br />
                <span className="display-italic text-sage">What it doesn&apos;t.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-[15px] md:text-[16px] leading-relaxed text-bone/70 max-w-md">
                Most wellness brands oversell. We&apos;d rather explain exactly where
                the filter helps, where results vary, and where another kind of
                treatment may be a better fit.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 space-y-8">
            {TRUTHS.map((t, i) => (
              <Reveal key={t.title} delay={i * 0.08}>
                <div className="pt-6 border-t border-bone/15 grid grid-cols-12 gap-4">
                  <div className="col-span-2 md:col-span-1">
                    <p className="display italic text-3xl text-sage leading-none">{t.n}</p>
                  </div>
                  <div className="col-span-10 md:col-span-11">
                    <h3 className="display text-xl md:text-[24px] text-bone mb-3 leading-tight">{t.title}</h3>
                    <p className="text-[14px] md:text-[15px] leading-relaxed text-bone/70">{t.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.4}>
              <p className="mt-12 pt-8 border-t border-bone/15 display italic text-2xl md:text-3xl text-bone/90 leading-tight max-w-xl">
                We&apos;d rather tell you the truth than sell you the story.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
