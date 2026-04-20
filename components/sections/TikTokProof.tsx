"use client";

import Script from "next/script";
import Reveal from "@/components/Reveal";

const TIKTOKS = [
  {
    id: "7476519012743056670",
    cite: "https://www.tiktok.com/@feelslikeom.shop/video/7476519012743056670",
    hook: "Hard water might be tough on your pipes — but it&apos;s tougher on your hair.",
    label: "Top performer",
  },
  {
    id: "7529031516001815838",
    cite: "https://www.tiktok.com/@feelslikeom.shop/video/7529031516001815838",
    hook: "Give your shower the same standards as your skincare.",
    label: "Most shared",
  },
  {
    id: "7473352116153715998",
    cite: "https://www.tiktok.com/@feelslikeom.shop/video/7473352116153715998",
    hook: "Side effects may include: silky hair, clear skin, endless compliments.",
    label: "Breakout hit",
  },
];

export default function TikTokProof() {
  return (
    <>
      <section className="bg-bone py-24 md:py-32 border-y border-ink/10">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
              <div>
                <p className="overline text-deep mb-6 flex items-center gap-3">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                  Seen on TikTok
                </p>
                <h2 className="display text-[10vw] md:text-[5vw] leading-[0.98] max-w-3xl">
                  The shower head that
                  <br />
                  <span className="display-italic text-deep">went viral on TikTok.</span>
                </h2>
                <p className="mt-6 text-[15px] md:text-[16px] text-muted max-w-lg leading-relaxed">
                  5 million views. 100,000 orders. No press release required.
                </p>
              </div>
              <a
                href="https://www.tiktok.com/@feelslikeom.shop"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary self-start md:self-end"
              >
                @feelslikeom.shop →
              </a>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {TIKTOKS.map((t, i) => (
              <Reveal key={t.id} delay={i * 0.08}>
                <div className="relative rounded-sm bg-mist/50 p-5">
                  <div className="flex items-center justify-between mb-4 text-[11px] tracking-widest uppercase">
                    <span className="text-deep font-medium">{t.label}</span>
                    <span className="text-muted">#{i + 1}</span>
                  </div>
                  <blockquote
                    className="tiktok-embed"
                    cite={t.cite}
                    data-video-id={t.id}
                    style={{ maxWidth: "605px", minWidth: "280px", margin: 0 }}
                  >
                    <section>
                      <a href={t.cite}>@feelslikeom.shop</a>
                    </section>
                  </blockquote>
                  <p
                    className="mt-4 text-[14px] leading-relaxed text-ink italic"
                    dangerouslySetInnerHTML={{ __html: `&ldquo;${t.hook}&rdquo;` }}
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <Script src="https://www.tiktok.com/embed.js" strategy="afterInteractive" />
    </>
  );
}
