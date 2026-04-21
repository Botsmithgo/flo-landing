import Reveal from "@/components/Reveal";

const PROMISE = [
  {
    eyebrow: "Tested",
    title: "Based on real customer results",
    body: "In a 4-week customer study, 91% reported calmer skin and 87% experienced less hair frizz. Self-reported — not a clinical trial. Real people swapping one shower head.",
  },
  {
    eyebrow: "Formulated",
    title: "A real filtration stack",
    body: "A 20-stage filtration system. KDF-55 does the chlorine work. Calcium sulfite holds its performance in hot water. Activated carbon polishes the odor. The materials do the work — no decorative extras.",
  },
  {
    eyebrow: "Designed",
    title: "Made to disappear",
    body: "Polished chrome or matte black. Finished to sit flush on your shower arm and read like hotel bathroom hardware, not a gadget. Your shower was already beautiful.",
  },
];

export default function HomePromise() {
  return (
    <section className="bg-bone py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="overline text-muted mb-6">The promise</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display text-[8.5vw] md:text-[4.2vw] leading-[1.02] max-w-[960px]">
            Water is the most overlooked part of your routine.{" "}
            <span className="display-italic text-deep">Make it work for you.</span>
          </h2>
        </Reveal>

        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {PROMISE.map((item, i) => (
            <Reveal key={item.title} delay={0.1 * i}>
              <div className="pt-6 border-t border-ink/15">
                <p className="overline text-deep mb-6">{item.eyebrow}</p>
                <h3 className="display text-3xl md:text-[32px] mb-4 leading-tight">{item.title}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
