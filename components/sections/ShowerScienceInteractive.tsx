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
          {/* LEFT — copy (7/12, wider so it breathes) */}
          <div className="lg:col-span-7">
            <Reveal>
              <p className="overline text-deep mb-6">Om-3 Filtration Technology</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                className="display leading-[0.98]"
                style={{ fontSize: "clamp(36px, 5.2vw, 68px)" }}
              >
                Shower physics
                <br />
                are different.
                <br />
                <span className="display-italic text-deep">So we built for them.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 text-[15px] md:text-[16px] leading-relaxed text-muted max-w-xl space-y-4">
                <p>
                  Most shower filters are drinking-filter chemistry in a
                  shower-head shell — built for cool water, long contact time,
                  single-pass treatment.
                </p>
                <p>
                  Showers are the opposite. <span className="text-ink">105°F water.
                  Eight gallons a minute. One-second contact per stage.</span>
                </p>
                <p>
                  So we engineered our own system. Three filtration phases.
                  Twenty stages of media. Each chosen for hot, high-flow,
                  short-contact water — not a desk experiment. That&apos;s Om-3.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 rounded-sm bg-bone/50 border border-ink/10 p-5 md:p-6 max-w-xl">
                <p className="overline text-deep mb-3">Independently tested</p>
                <p className="text-[13px] md:text-[14px] leading-relaxed text-ink/80">
                  KDF-55 reduces free chlorine up to 95% at rated flow.
                  Calcium sulfite maintains performance to 110°F.
                  Lab reports available on request.
                </p>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — capped image (5/12, max-w so it doesn't dominate) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-sm bg-ink p-4 md:p-6 max-w-[460px] mx-auto" data-surface="dark">
              <FilterCutawayInteractive />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
