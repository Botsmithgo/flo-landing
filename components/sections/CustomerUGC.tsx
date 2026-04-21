"use client";

import Script from "next/script";
import Reveal from "@/components/Reveal";
import { track } from "@/lib/analytics";

/**
 * Customer-generated TikToks — NOT brand ads. Real customers reacting to FLO.
 *
 * Drop URLs into env vars NEXT_PUBLIC_UGC_TIKTOK_1/2/3.
 * Component auto-hides if no URLs are configured.
 *
 * Format: full TikTok URL like:
 *   https://www.tiktok.com/@username/video/1234567890123456789
 */

function extractVideoId(url: string): string | null {
  const m = url.match(/\/video\/(\d+)/);
  return m ? m[1] : null;
}

const RAW_URLS = [
  process.env.NEXT_PUBLIC_UGC_TIKTOK_1,
  process.env.NEXT_PUBLIC_UGC_TIKTOK_2,
  process.env.NEXT_PUBLIC_UGC_TIKTOK_3,
].filter((u): u is string => Boolean(u));

const VIDEOS = RAW_URLS.map((url) => ({ url, id: extractVideoId(url) })).filter(
  (v): v is { url: string; id: string } => v.id !== null
);

export default function CustomerUGC() {
  // Auto-hide section if no UGC URLs configured
  if (VIDEOS.length === 0) return null;

  return (
    <>
      <section className="bg-water py-28 md:py-36">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <Reveal>
            <p className="overline text-deep mb-6">Real customers</p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="display text-[10vw] md:text-[5vw] leading-[0.98] max-w-3xl mb-12 md:mb-16">
              Not our ads.
              <br />
              <span className="display-italic text-deep">Just real reactions.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {VIDEOS.map((v, i) => (
              <Reveal key={v.id} delay={i * 0.08}>
                <div
                  className="relative bg-bone rounded-sm p-5"
                  onClick={() => track("tiktok_click", { source: "ugc", video_id: v.id })}
                >
                  <div className="flex items-center justify-between mb-4 text-[11px] tracking-widest uppercase">
                    <span className="text-deep font-medium">Customer #{i + 1}</span>
                    <span className="text-muted">TikTok</span>
                  </div>
                  <blockquote
                    className="tiktok-embed"
                    cite={v.url}
                    data-video-id={v.id}
                    style={{ maxWidth: "605px", minWidth: "280px", margin: 0 }}
                  >
                    <section>
                      <a href={v.url}>View on TikTok</a>
                    </section>
                  </blockquote>
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
