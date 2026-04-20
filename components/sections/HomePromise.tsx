import Reveal from "@/components/Reveal";

const PROMISE = [
  {
    eyebrow: "Tested",
    title: "Independently verified",
    body: "Our media is benchmarked by third-party labs — not marketing claims. We publish the numbers, not the vibes.",
  },
  {
    eyebrow: "Formulated",
    title: "A media stack, not a novelty",
    body: "KDF-55 for chlorine reduction. Calcium sulfite for hot-water performance. Activated carbon for odor. The media does the work.",
  },
  {
    eyebrow: "Made quietly",
    title: "Designed to disappear",
    body: "Brass where it matters, soft lines everywhere else. It looks like it belongs in the bathroom you already loved.",
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
          <h2 className="display text-[10vw] md:text-[5.5vw] leading-[0.98] max-w-4xl">
            Water is the quietest ingredient in your routine.{" "}
            <span className="display-italic text-deep">Make it count.</span>
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
