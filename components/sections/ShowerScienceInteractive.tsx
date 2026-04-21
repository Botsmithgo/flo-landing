import Reveal from "@/components/Reveal";
import FilterCutawayInteractive from "@/components/sections/FilterCutawayInteractive";

/**
 * /shower version of the filter interactive — wider copy column, capped
 * image size so the interactive doesn't dominate the viewport.
 *
 * Frames the filter's REAL differentiator: "most shower filters are
 * drinking-filter chemistry; we built for shower physics (hot, high-flow,
 * short contact)." That POV flip + the branded 'Om-3' name = positioning
 * that doesn't exist elsewhere in the category.
 */
export default function ShowerScienceInteractive() {
  return (
    <section id="science" className="bg-mist py-32 md:py-44 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          {/* LEFT — copy (6/12) */}
          <div className="lg:col-span-6">
            <Reveal>
              <p className="overline text-deep mb-6">20-Stage Filtration</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                className="display leading-[0.98]"
                style={{ fontSize: "clamp(36px, 5.2vw, 68px)" }}
              >
                Engineered for how
                <br />
                <span className="display-italic text-deep">showers actually behave.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 text-[15px] md:text-[16px] leading-relaxed text-muted max-w-xl space-y-4">
                <p>
                  Most shower filters use drinking-filter chemistry — built
                  for cool water, long contact time, single-pass treatment.
                </p>
                <p>
                  Showers are the opposite. <span className="text-ink">105°F water.
                  Eight gallons a minute. One-second contact per stage.</span>
                </p>
                <p>
                  So we built our own stack — twenty stages of media for hot,
                  high-flow, short-contact water. KDF-55 and calcium sulfite
                  carry most of the chlorine reduction. Activated carbon and
                  zeolite polish the rest. Mineral stones add a softer-feeling
                  finish.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 rounded-sm bg-bone/50 border border-ink/10 p-5 md:p-6 max-w-xl">
                <p className="overline text-deep mb-3">What it won&apos;t do</p>
                <p className="text-[13px] md:text-[14px] leading-relaxed text-ink/80">
                  A shower-head filter can&apos;t soften hard water — that
                  requires whole-home ion exchange. What it <em className="italic">can</em> do
                  is take the chlorine edge off, leaving water that <em className="italic">feels</em> softer.
                </p>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — image (6/12, wider panel with more breathing room) */}
          <div className="lg:col-span-6">
            <div className="relative rounded-sm bg-ink p-6 md:p-8 max-w-[560px] mx-auto" data-surface="dark">
              <FilterCutawayInteractive />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
