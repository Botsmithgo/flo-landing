import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { FAQSchema, BreadcrumbSchema } from "@/components/StructuredData";
import { SITE_URL } from "@/lib/site";

/**
 * /answers — the category-education layer the site was missing.
 *
 * Why this page exists
 * --------------------
 * Before this, every page on the site was brand-or-product shaped: home,
 * /about, /shower. That covers people who already know FLO. It covers nobody
 * searching "do shower filters actually work" or "shower filter vs water
 * softener" — which is most of the demand, and the query shape AI answer
 * engines fan out to.
 *
 * Two deliberate constraints on the copy below:
 *
 * 1. EVERY heading is phrased the way a person actually searches, and every
 *    answer leads with a direct response in roughly 40-60 words that stands on
 *    its own with no surrounding context. That is the unit an AI answer engine
 *    extracts. It is also, conveniently, how a skeptical human reads an FAQ.
 *
 * 2. NOTHING here repeats FLO's marketing statistics — no order counts, no
 *    star ratings, no perception-study percentages, no "deepest in category".
 *    Those live elsewhere on the site and are under review. This page is built
 *    only from water-treatment facts that hold regardless of how that review
 *    lands, so it cannot become wrong when those numbers are revised.
 *
 * The honesty is not a stylistic choice — "no, a shower filter will not soften
 * your water" is precisely the kind of specific, checkable, non-promotional
 * statement that AI answers quote, because it is safe to repeat.
 */

export const metadata: Metadata = {
  title: "Shower Filter Questions, Answered",
  description:
    "Straight answers about shower filters: what they remove, what they don't, how they differ from a water softener, and when the cartridge needs replacing.",
  alternates: { canonical: "/answers" },
  openGraph: {
    title: "Shower Filter Questions, Answered — Feels Like Om",
    description:
      "What a shower filter reduces, what it can't, and how it differs from a water softener. Plain answers, including the unflattering ones.",
    url: `${SITE_URL}/answers`,
    type: "article",
    images: [
      {
        url: "/product/bathroom-scene.jpg",
        width: 1344,
        height: 768,
        alt: "A luxury bathroom in warm morning light — Feels Like Om",
      },
    ],
  },
};

/**
 * Single source of truth for this page: rendered as visible copy AND emitted as
 * FAQPage JSON-LD from the same array, so the two can never drift apart.
 * Schema that disagrees with the visible page is a structured-data violation.
 */
const ANSWERS: { q: string; a: string; more?: string }[] = [
  {
    q: "Do shower filters actually work?",
    a: "Yes, for a narrow and specific job. A shower filter reduces chlorine, sediment and some dissolved metals at the point where water leaves the pipe. Filters built on redox media convert free chlorine into chloride, a reaction that is well established in water treatment. What no shower filter does is change how hard your water is.",
    more: "The honest framing is that a shower filter is a last-few-feet device. It cannot undo what happened upstream, and it is not treating your household water — it is treating the water in one fixture, for the few seconds it is in contact with the media.",
  },
  {
    q: "What is the difference between a shower filter and a water softener?",
    a: "They solve unrelated problems. A water softener uses ion exchange to strip calcium and magnesium — the dissolved minerals that make water hard — usually for the entire house. A shower filter targets chlorine, sediment and some metals at a single fixture. A filter will not soften water, and a softener will not reduce chlorine.",
    more: "This is the single most common misunderstanding in the category, and it is worth being blunt about: if your complaint is limescale on the glass or soap that will not lather, a shower filter is not the fix. That is hardness, and hardness needs ion exchange.",
  },
  {
    q: "What is KDF-55, and why is it in shower filters?",
    a: "KDF-55 is a high-purity copper-zinc alloy used as filtration media. When water passes through it, a redox reaction transfers electrons and converts free chlorine into chloride — a dissolved salt that is far less reactive. It is one of the most widely used chlorine-reduction media in point-of-use water treatment.",
    more: "Copper-zinc alloy outperforms either metal on its own for this reaction, which is why the alloy is specified rather than plain copper or plain zinc. It is usually paired with other media, because no single material handles every category of contaminant.",
  },
  {
    q: "Does a shower filter remove chloramine?",
    a: "Partially, not completely. Chloramine is chlorine bonded to ammonia, and that bond makes it substantially harder to break down than free chlorine — it needs more contact time than water gets inside a shower head. Expect meaningful reduction rather than removal, and be sceptical of any filter claiming otherwise.",
    more: "Whether this matters to you depends on your utility. Chloramine is used by a minority of US water systems but serves a large share of the population, because the systems using it tend to be big ones. Your local water quality report will say which disinfectant you are on.",
  },
  {
    q: "Do I need a shower filter if my tap water is already safe to drink?",
    a: "Safe to drink and pleasant to shower in are different standards. Roughly 98% of US water utilities use chlorine or chloramine somewhere in treatment, and that disinfectant is the reason the water is microbiologically safe — it is doing its job. A shower filter is about reducing that disinfectant at the very last step.",
    more: "So the question is not whether your water is safe. It is whether you want the residual disinfectant in contact with your skin and hair for several minutes a day, every day. That is a preference, not a health emergency, and it is fair to treat it as one.",
  },
  {
    q: "Will a shower filter fix hard water?",
    a: "No. Water hardness is dissolved calcium and magnesium, and a shower filter does not remove them. Anything marketed as a shower head that softens water is either using the word loosely or is describing a different sensation — filtered water can feel different on the skin without being chemically softer.",
  },
  {
    q: "Will a shower filter reduce my water pressure?",
    a: "Any filter adds some flow restriction, because the water now has to pass through media. Whether you notice it depends on the design of the head and your home's existing pressure. A well-designed filtered head should feel like a normal shower; a clogged or long-overdue cartridge is the usual cause of a real drop.",
    more: "If pressure falls off noticeably over time rather than on day one, that is almost always the cartridge reaching the end of its life, not a fault in the fixture.",
  },
  {
    q: "How often should you replace a shower filter cartridge?",
    a: "Most shower filter cartridges are rated in both months and gallons, and whichever limit arrives first is the one that counts. A household with several long daily showers reaches the gallon limit well before the calendar limit. Local water quality also changes how quickly media is consumed.",
    more: "Treat the rating as a maximum under typical conditions rather than a guarantee. Falling pressure or the return of a chlorine smell are the practical signals that the cartridge is spent.",
  },
  {
    q: "Can you install a shower filter yourself?",
    a: "In almost all cases, yes. A filtered shower head threads onto the same standard shower arm your existing head uses, so installation is unscrewing the old head, wrapping the threads with thread-seal tape and screwing on the new one by hand. No tools and no plumber for a standard fitting.",
    more: "The exceptions are non-standard setups — an integrated fixture, a rail-mounted handheld, or a European thread. If you are unsure what you have, a photo of the connection is usually enough for a supplier to tell you before you buy.",
  },
  {
    q: "Is a filtered shower head worth it?",
    a: "It depends entirely on what you are hoping it fixes. If you want less chlorine contact on skin and hair, that is what the category does. If you want limescale gone, softer-lathering soap, or a treatment for a diagnosed skin condition, a shower filter is the wrong purchase and no amount of marketing changes that.",
  },
];

/** Comparison table content — tables outperform prose for "X vs Y" queries. */
const COMPARISON = [
  {
    what: "What it targets",
    filter: "Chlorine, sediment, some dissolved metals",
    softener: "Calcium and magnesium (hardness)",
    whole: "Varies by system — often sediment, chlorine, taste",
  },
  {
    what: "Where it sits",
    filter: "On one shower arm",
    softener: "At the main line, for the whole house",
    whole: "At the main line, for the whole house",
  },
  {
    what: "Softens water?",
    filter: "No",
    softener: "Yes — that is its only job",
    whole: "Only if it includes a softening stage",
  },
  {
    what: "Reduces chlorine?",
    filter: "Yes — that is the primary job",
    softener: "No",
    whole: "Usually, depending on media",
  },
  {
    what: "Install",
    filter: "By hand, no tools, minutes",
    softener: "Plumber, permanent connection",
    whole: "Plumber, permanent connection",
  },
  {
    what: "Works for renters?",
    filter: "Yes — it unscrews and leaves with you",
    softener: "Rarely",
    whole: "Rarely",
  },
];

export default function AnswersPage() {
  return (
    <>
      <FAQSchema questions={ANSWERS.map(({ q, a }) => ({ q, a }))} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Answers", url: "/answers" },
        ]}
      />

      {/* Hero */}
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 pt-40 md:pt-52 pb-20 md:pb-28">
          <p className="overline text-bone/60 mb-6">Answers</p>
          <h1 className="display text-[12vw] md:text-[7.5vw] leading-[0.95] max-w-5xl">
            Straight answers,
            <br />
            <span className="display-italic text-sage">
              including the unflattering ones.
            </span>
          </h1>
          <p className="mt-10 max-w-2xl text-[17px] md:text-[19px] leading-[1.7] text-bone/70">
            Most of what is written about shower filters is written to sell one.
            This page is what we would tell a friend who asked — what the
            category actually does, what it cannot do, and when you should not
            buy one at all.
          </p>
        </div>
      </section>

      {/* Comparison table — the highest-intent question in the category */}
      <section className="bg-mist py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal>
            <p className="overline text-deep mb-6">The one people get wrong</p>
            <h2 className="display text-4xl md:text-6xl leading-[1.05] max-w-3xl text-ink">
              Shower filter vs water softener vs{" "}
              <span className="display-italic text-deep">whole-house</span>
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            {/* Wide content scrolls inside its own container so the page body
                never scrolls horizontally on a phone. */}
            <div className="mt-12 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-[15px] md:text-[16px]">
                <caption className="sr-only">
                  Comparison of shower filters, water softeners and whole-house
                  filtration by what they target, where they install, and who
                  they suit.
                </caption>
                <thead>
                  <tr className="border-b border-ink/20">
                    <th scope="col" className="py-4 pr-6 font-normal text-muted">
                      &nbsp;
                    </th>
                    <th scope="col" className="py-4 pr-6 font-medium text-ink">
                      Shower filter
                    </th>
                    <th scope="col" className="py-4 pr-6 font-medium text-ink">
                      Water softener
                    </th>
                    <th scope="col" className="py-4 font-medium text-ink">
                      Whole-house filter
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.what} className="border-b border-ink/10">
                      <th
                        scope="row"
                        className="py-5 pr-6 font-normal text-muted align-top"
                      >
                        {row.what}
                      </th>
                      <td className="py-5 pr-6 text-ink/85 align-top">
                        {row.filter}
                      </td>
                      <td className="py-5 pr-6 text-ink/85 align-top">
                        {row.softener}
                      </td>
                      <td className="py-5 text-ink/85 align-top">{row.whole}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The answers themselves */}
      <section className="bg-bone py-24 md:py-36">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 grid grid-cols-1 lg:grid-cols-12 gap-14 md:gap-20">
          <div className="lg:col-span-4 lg:sticky lg:top-28 self-start">
            <Reveal>
              <p className="overline text-deep mb-6">Asked and answered</p>
              <p className="display italic text-3xl md:text-4xl leading-tight text-deep">
                &ldquo;Claim less. Deliver more.&rdquo;
              </p>
              <p className="mt-8 text-[16px] leading-[1.7] text-ink/70 max-w-sm">
                If an answer below talks you out of buying a shower filter, it
                has done its job. The worst outcome for us is someone buying one
                to fix a problem it was never going to fix.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <dl className="space-y-14 md:space-y-16">
              {ANSWERS.map(({ q, a, more }, i) => (
                <Reveal key={q} delay={Math.min(i * 0.03, 0.15)}>
                  <div className="border-t border-ink/15 pt-8">
                    {/* H2 phrased as the query, not as a brand line. This is
                        what a search engine and an answer engine match on. */}
                    <dt>
                      <h2 className="text-[22px] md:text-[26px] leading-[1.3] font-medium text-ink max-w-2xl">
                        {q}
                      </h2>
                    </dt>
                    <dd className="mt-5 space-y-5 text-[17px] md:text-[18px] leading-[1.75] text-ink/80 max-w-2xl">
                      {/* Lead answer: self-contained, ~40-60 words. */}
                      <p>{a}</p>
                      {more && <p className="text-ink/65">{more}</p>}
                    </dd>
                  </div>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="bg-ink text-bone py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal>
            <h2 className="display text-4xl md:text-6xl leading-[1.05] max-w-3xl">
              Still not sure it is{" "}
              <span className="display-italic text-sage">for you?</span>
            </h2>
            <p className="mt-8 max-w-xl text-[17px] md:text-[18px] leading-[1.7] text-bone/70">
              Send a photo of your shower connection to{" "}
              <a
                className="underline underline-offset-4 hover:text-bone"
                href="mailto:hello@feelslikeom.shop"
              >
                hello@feelslikeom.shop
              </a>{" "}
              and a human will tell you whether ours fits — including when the
              answer is no.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link href="/shower" className="btn-primary">
                See the filter <span aria-hidden>→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-4 text-bone/70 hover:text-bone transition-colors"
              >
                Read the story
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
