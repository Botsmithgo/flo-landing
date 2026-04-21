import Reveal from "@/components/Reveal";

const BENEFITS = [
  { n: "01", title: "Softer-feeling hair", line: "Without the chlorine edge, your hair dries lighter. Most people feel it by day 7." },
  { n: "02", title: "Calmer skin", line: "Users commonly report less post-shower tightness. In our 4-week study, 91% reported reduced irritation." },
  { n: "03", title: "Less pressure loss", line: "A wide flow path across 20 stages — no pressure tax for the filtration." },
  { n: "04", title: "Three-minute install", line: "Unscrews your old head, screws the new one on. No plumber. No tools." },
  { n: "05", title: "Six-month cartridge", line: "One filter per half-year of daily showers. Replacements auto-ship with your subscription." },
  { n: "06", title: "Fits standard thread", line: "Compatible with every standard U.S. shower arm. Takes a hand-tight seal." },
  { n: "07", title: "Modern, classy design", line: "Polished chrome or matte black. Sits flush on the wall, reads like something you'd see in a hotel bathroom." },
];

export default function ShowerBenefits() {
  return (
    <section className="bg-bone py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="overline text-deep mb-6">What changes</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display text-[10vw] md:text-[5.5vw] leading-[0.98] max-w-4xl">
            Six quiet shifts,
            <br />
            <span className="display-italic text-deep">by the end of week one.</span>
          </h2>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
          {BENEFITS.map((b, i) => (
            <Reveal key={b.n} delay={i * 0.06}>
              <div className="pt-6 border-t border-ink/15">
                <div className="flex items-baseline gap-4 mb-5">
                  <span className="overline text-deep">{b.n}</span>
                </div>
                <h3 className="display text-[26px] md:text-[30px] text-ink leading-tight mb-4">{b.title}</h3>
                <p className="text-[14px] md:text-[15px] leading-relaxed text-muted">{b.line}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
