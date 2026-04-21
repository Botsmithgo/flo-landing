import Reveal from "@/components/Reveal";
import { FaceIcon, FollicleIcon, HairIcon, DropletIcon } from "@/components/icons/StudyIcons";

const STATS = [
  { n: "91%", l: "Reduced acne & skin irritation", Icon: FaceIcon },
  { n: "82%", l: "Noticed less dryness & breakage", Icon: FollicleIcon },
  { n: "87%", l: "Experienced less hair frizz", Icon: HairIcon },
  { n: "90%", l: "Felt better water pressure", Icon: DropletIcon },
];

export default function ShowerStudy() {
  return (
    <section className="bg-deeper text-bone py-32 md:py-44" data-surface="dark">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-start">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="overline text-bone/60 mb-6">Four-week study · all hair types</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display text-[10vw] md:text-[5vw] leading-[0.98]">
                What changes when
                <br />
                <span className="display-italic text-sage">the water changes.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-[15px] leading-relaxed text-bone/70 max-w-md">
                We asked 200 customers across all hair types to swap their standard
                shower head for a Feels Like Om filter and answer the same four
                questions each week for four weeks. These are the results they
                self-reported in week four.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-10 md:gap-14">
            {STATS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="pt-6 border-t border-bone/20">
                  <s.Icon className="text-sage mb-5" size={52} dark />
                  <p className="display text-[14vw] md:text-[6vw] leading-none text-sage">{s.n}</p>
                  <p className="mt-5 text-[14px] md:text-[15px] leading-snug text-bone/80 max-w-xs">{s.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.4}>
          <p className="mt-16 text-[11px] text-bone/50 max-w-xl leading-relaxed">
            *Results from a consumer perception study with all hair types after 4
            weeks. n=200. Results are self-reported and individual outcomes vary.
            Study methodology available on request.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
