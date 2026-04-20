"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const MESSAGES = [
  "Free shipping on subscription",
  "60-day money-back guarantee",
  "100,000+ orders shipped",
  "20% off your first filter",
];

const ROTATE_MS = 4200;

export default function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("flo_announce_dismissed") === "1") {
      setDismissed(true);
    }
    const id = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  function dismiss() {
    setDismissed(true);
    try { sessionStorage.setItem("flo_announce_dismissed", "1"); } catch {}
  }

  if (dismissed) return null;

  return (
    <div className="relative z-50 bg-deep text-bone">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 h-9 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] md:text-[12px] tracking-[0.14em] uppercase text-center"
          >
            <span className="mr-2 text-bone/70">✦</span>
            {MESSAGES[i]}
            <span className="ml-2 text-bone/70">✦</span>
          </motion.p>
        </AnimatePresence>
        <button
          onClick={dismiss}
          aria-label="Dismiss announcement"
          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-bone/70 hover:text-bone transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M1 1 L9 9 M9 1 L1 9" />
          </svg>
        </button>
      </div>
    </div>
  );
}
