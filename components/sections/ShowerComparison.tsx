import Reveal from "@/components/Reveal";

// Honest table — FLO wins most, but not all. NSF cert + finish range are
// genuine Jolie advantages we acknowledge. That honesty makes the rows
// where we DO win more credible.
const ROWS: [string, string, string, string][] = [
  ["Price (first order)", "$134.99", "$169", "$25–60"],
  ["Subscription filter", "$39 / 6 mo", "$33 / 3 mo", "Varies wildly"],
  ["Media stack", "20-stage", "10-stage", "2–5 stage"],
  ["Filter life", "6 months / 12,000 gal", "3 months", "1–3 months"],
  ["Hot-water performance", "Calcium sulfite", "Calcium sulfite", "Rarely"],
  ["NSF/ANSI 177 certified", "Not yet", "Yes", "No"],
  ["Finish options", "2 colors", "5 colors", "Varies"],
  ["4-week customer study", "200 customers", "Not published", "Not published"],
  ["U.S. support", "Yes", "Yes", "Seller-dependent"],
];

export default function ShowerComparison() {
  return (
    <section className="bg-water py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <Reveal>
          <p className="overline text-deep mb-6">Honest comparison</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display text-[10vw] md:text-[5.5vw] leading-[0.98] max-w-3xl">
            We&apos;ll tell you where the
            <br />
            <span className="display-italic text-deep">competition wins, too.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-16 overflow-x-auto no-scrollbar">
            <table className="w-full text-left min-w-[640px]">
              <thead>
                <tr className="border-b border-ink/20">
                  <th className="py-5 pr-6 overline text-muted font-normal"></th>
                  <th className="py-5 px-6 overline text-deep font-normal">Feels Like Om</th>
                  <th className="py-5 px-6 overline text-muted font-normal">Category leader</th>
                  <th className="py-5 px-6 overline text-muted font-normal">Generic Amazon</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row[0]} className="border-b border-ink/10">
                    <td className="py-5 pr-6 text-[14px] text-muted">{row[0]}</td>
                    <td className="py-5 px-6 text-[15px] text-ink font-medium">{row[1]}</td>
                    <td className="py-5 px-6 text-[14px] text-muted">{row[2]}</td>
                    <td className="py-5 px-6 text-[14px] text-muted">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mt-10 text-[13px] text-muted max-w-2xl leading-relaxed">
            Comparison reflects publicly listed specs as of April 2026.
            &ldquo;Category leader&rdquo; = Jolie Filtered Showerhead. Where competitors
            match or exceed FLO, we note it. We&apos;ll update this table quarterly.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
