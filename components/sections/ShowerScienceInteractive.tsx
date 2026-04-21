import Reveal from "@/components/Reveal";
import FilterCutawayInteractive from "@/components/sections/FilterCutawayInteractive";

/**
 * /shower version of the filter interactive — wraps FilterCutawayInteractive
 * in a dark editorial panel with a tight "how it works" header. No CTA
 * (visitor is already on the shopping page; offer is in hero + sticky ATC).
 */
export default function ShowerScienceInteractive() {
  return (
    <section id="science" className="bg-mist py-32 md:py-44 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          {/* LEFT — section header */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="overline text-deep mb-6">How it works</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                className="display leading-[0.98]"
                style={{ fontSize: "clamp(36px, 5.4vw, 68px)" }}
              >
                Inside
                <br />
                <span className="display-italic text-deep">the filter.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 text-[15px] md:text-[16px] leading-relaxed text-muted max-w-md">
                Twenty stages of filter media, chosen for how showers actually
                behave — hot, high flow, short contact time. Hover any dot to see
                what each media does.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-10 rounded-sm bg-bone/50 border border-ink/10 p-5 md:p-6">
                <p className="overline text-deep mb-2">What it won&apos;t do</p>
                <p className="text-[14px] leading-relaxed text-ink/80">
                  A shower-head filter can&apos;t soften hard water — that requires
                  whole-home ion exchange. What it can do is take the chlorine edge
                  off, leaving water that <em className="italic">feels</em> softer.
                </p>
              </div>
            </Reveal>
          </div>

          {/* RIGHT — the interactive cutaway in a dark editorial panel */}
          <div className="lg:col-span-7">
            <div className="relative rounded-sm bg-ink p-5 md:p-8" data-surface="dark">
              <FilterCutawayInteractive />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
