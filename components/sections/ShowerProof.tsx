import Reveal from "@/components/Reveal";

const PRESS = [
  "Vogue",
  "Byrdie",
  "Allure",
  "Well+Good",
  "Refinery29",
  "Harper's Bazaar",
];

export default function ShowerProof() {
  return (
    <section className="bg-bone py-20 md:py-28 border-y border-ink/10">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-14">
            <div className="flex-shrink-0">
              <div className="flex gap-0.5 text-deep text-xl">★★★★★</div>
              <p className="mt-2 text-[14px] text-ink">
                <span className="font-medium">4.8 / 5</span>
                <span className="text-muted"> &nbsp;·&nbsp; 1,400+ verified reviews</span>
              </p>
            </div>
            <div className="hidden md:block h-12 w-px bg-ink/20" />
            <div className="flex-1 overflow-hidden">
              <p className="overline text-muted mb-5">As featured in</p>
              <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
                {PRESS.map((p) => (
                  <span key={p} className="display text-lg md:text-xl text-ink/60 italic">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
