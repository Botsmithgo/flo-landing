"use client";

import { useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { track } from "@/lib/analytics";

/**
 * Top videos from the Feels Like Om TikTok (@feelslikeom.shop), self-hosted as
 * 540p H.264 MP4s in /public/ugc (preload="none", so nothing downloads until a
 * card is tapped). The TikTok embed player errored on iPhone (2026-10-12), so we
 * serve our own posts directly.
 *
 * These are brand-account posts made with creators, so the section is labelled
 * "from our TikTok", never "real customers, not our ads" (FTC endorsement rules).
 *
 * View counts were read from TikTok on 2026-10-12. One video per creator. Posters live in /public/ugc.
 */
const VIDEOS = [
  { id: "7528596974069746975", views: "1.4M", hook: "Dry, itchy skin after showering" },
  { id: "7529031516001815838", views: "965K", hook: "Clean enough to drink, not for your skin" },
  { id: "7528254919862684958", views: "616K", hook: "Dandruff that won't quit" },
  { id: "7519729037015649567", views: "358K", hook: "Friends notice the difference" },
];

const PROFILE = "https://www.tiktok.com/@feelslikeom.shop";

function VideoCard({ id, views, hook }: (typeof VIDEOS)[number]) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  function play() {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    // play() inside the tap handler so iOS treats it as user-initiated (sound allowed)
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
    track("tiktok_click", { source: "ugc_card", video_id: id });
  }

  return (
    <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-ink ring-1 ring-ink/10">
      <video
        ref={videoRef}
        src={`/ugc/${id}.mp4`}
        poster={`/ugc/${id}.webp`}
        preload="none"
        playsInline
        controls={started}
        className="absolute inset-0 h-full w-full object-cover"
        aria-label={hook}
      />
      {!started && (
        <button
          type="button"
          onClick={play}
          aria-label={`Play video: ${hook}`}
          className="group absolute inset-0 text-left"
        >
          <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[12px] font-semibold text-ink">
            {views} views
          </span>
          <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-105">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 text-ink" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="absolute inset-x-3 bottom-3 text-[14px] font-medium leading-snug text-white">
            {hook}
          </span>
        </button>
      )}
    </div>
  );
}

export default function CustomerUGC() {
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <div>
            <Reveal>
              <p className="overline text-deep mb-5">From our TikTok</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="display text-[10vw] md:text-[4.4vw] leading-[0.98] max-w-3xl">
                5 million views.
                <br />
                <span className="display-italic text-deep">See it in a real shower.</span>
              </h2>
            </Reveal>
          </div>
          <a
            href={PROFILE}
            target="_blank"
            rel="noreferrer"
            onClick={() => track("tiktok_click", { source: "ugc_profile" })}
            className="rounded-full border border-ink/15 px-4 py-2 text-[13px] font-medium text-ink hover:border-ink/40"
          >
            @feelslikeom.shop on TikTok →
          </a>
        </div>

        {/* Phone: swipe row. Desktop: four across. */}
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
          {VIDEOS.map((v) => (
            <div key={v.id} className="w-[68vw] max-w-[300px] flex-none snap-start md:w-auto md:max-w-none">
              <VideoCard {...v} />
            </div>
          ))}
        </div>

        <p className="mt-6 text-[12px] text-muted">
          Videos from the Feels Like Om TikTok account, made with creators we work with. Individual results vary.
        </p>
      </div>
    </section>
  );
}
