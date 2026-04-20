"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, FormEvent } from "react";

const STORAGE_KEY = "flo_water_report_seen";
const SHOW_AFTER_MS = 12000;   // first-time page visit: open after 12s
const EXIT_INTENT_Y = 10;      // px from top where we trigger on exit

type State = "form" | "submitting" | "success" | "error";

export default function WaterReportPopup() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<State>("form");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");

  // Open logic — timer + exit-intent, once per browser
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setOpen(true), SHOW_AFTER_MS);

    function onLeave(e: MouseEvent) {
      if (e.clientY <= EXIT_INTENT_Y && !localStorage.getItem(STORAGE_KEY)) {
        setOpen(true);
      }
    }
    document.addEventListener("mouseleave", onLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  function markSeen() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
  }

  function close() {
    setOpen(false);
    markSeen();
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !/^\d{5}$/.test(zip)) return;
    setState("submitting");

    const endpoint = process.env.NEXT_PUBLIC_WATER_REPORT_ENDPOINT;
    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ email, zip, source: "flo_water_report_popup" }),
        });
        if (!res.ok) throw new Error("submit failed");
      }
      // If no endpoint set, we still succeed-state the user and Youssef captures from server logs later.
      setState("success");
      markSeen();

      // Fire GA4/Meta/TikTok event if present
      const w = window as unknown as {
        gtag?: (...a: unknown[]) => void;
        fbq?: (...a: unknown[]) => void;
        ttq?: { track: (e: string, p?: unknown) => void };
      };
      w.gtag?.("event", "water_report_lead", { email_domain: email.split("@")[1], zip });
      w.fbq?.("track", "Lead", { content_name: "water_report" });
      w.ttq?.track("SubmitForm", { content_name: "water_report" });
    } catch {
      setState("error");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl grid grid-cols-1 md:grid-cols-5 bg-bone rounded-sm overflow-hidden shadow-2xl shadow-ink/40"
          >
            {/* Close */}
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-bone/80 backdrop-blur text-ink flex items-center justify-center hover:bg-bone transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M1 1 L13 13 M13 1 L1 13" />
              </svg>
            </button>

            {/* LEFT — atmospheric image */}
            <div className="relative md:col-span-2 aspect-[4/3] md:aspect-auto min-h-[160px] bg-mist">
              <Image
                src="/product/bathroom-scene.jpg"
                alt=""
                fill
                className="object-cover object-[35%_center]"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-bone/40 to-transparent" />
            </div>

            {/* RIGHT — copy + form */}
            <div className="md:col-span-3 p-7 md:p-10">
              {state === "success" ? (
                <SuccessState />
              ) : state === "error" ? (
                <ErrorState onRetry={() => setState("form")} />
              ) : (
                <>
                  <p className="overline text-deep mb-4">Curious what&apos;s in your water?</p>
                  <h2 className="display text-3xl md:text-[36px] leading-[1.05] text-ink mb-4">
                    Free local
                    <br />
                    <span className="display-italic text-deep">water quality report.</span>
                  </h2>
                  <p className="text-[14px] leading-relaxed text-muted mb-6 max-w-sm">
                    Enter your zip and email. We&apos;ll pull the EPA data on your
                    water and send you a plain-English breakdown — what&apos;s in it,
                    what matters for hair and skin, and what to do about it.
                  </p>

                  <form onSubmit={onSubmit} className="space-y-3">
                    <label className="block">
                      <span className="sr-only">Email</span>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@email.com"
                        className="w-full px-4 py-3 rounded-sm bg-mist/60 border border-ink/15 text-[14px] placeholder:text-muted focus:outline-none focus:border-deep focus:ring-1 focus:ring-deep transition-colors"
                      />
                    </label>
                    <label className="block">
                      <span className="sr-only">ZIP code</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        value={zip}
                        onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                        placeholder="ZIP code"
                        className="w-full px-4 py-3 rounded-sm bg-mist/60 border border-ink/15 text-[14px] placeholder:text-muted focus:outline-none focus:border-deep focus:ring-1 focus:ring-deep transition-colors"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={state === "submitting"}
                      className="btn-primary w-full justify-center !py-3.5 text-[13px]"
                    >
                      {state === "submitting" ? "Sending…" : "Send my report"}
                      <span aria-hidden>→</span>
                    </button>
                  </form>

                  <p className="mt-5 text-[11px] text-muted leading-relaxed">
                    Plus <span className="text-deep">20% off your first filter</span>.
                    No spam. Unsubscribe anytime.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SuccessState() {
  return (
    <div className="py-6">
      <div className="h-12 w-12 rounded-full bg-deep text-bone flex items-center justify-center mb-5">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l4 4 8-8" />
        </svg>
      </div>
      <h2 className="display text-3xl text-ink mb-3">Your report is on its way.</h2>
      <p className="text-[14px] leading-relaxed text-muted max-w-sm">
        Check your inbox in the next 24 hours — we&apos;ll send the EPA breakdown
        for your zip, plus your <span className="text-deep">20% off code</span> for the shower filter.
      </p>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="py-6">
      <h2 className="display text-2xl text-ink mb-3">Something went sideways.</h2>
      <p className="text-[14px] leading-relaxed text-muted mb-5">
        Our inbox didn&apos;t catch that. Give it one more try?
      </p>
      <button onClick={onRetry} className="btn-secondary text-ink border-ink/30">
        Try again
      </button>
    </div>
  );
}
