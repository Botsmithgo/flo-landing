"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Message = {
  text: string;
  icon: React.ReactNode;
};

const MESSAGES: Message[] = [
  {
    text: "Free shipping on every subscription order",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    text: "60-day money-back guarantee",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L4 6 v6 c0 5 3.5 9 8 10 c4.5-1 8-5 8-10 V6 z" />
        <path d="M9 12 l2 2 4-4" />
      </svg>
    ),
  },
  {
    text: "100,000+ orders shipped · 4.8★ average rating",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2 L15 9 22 10 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 10 9 9 z" />
      </svg>
    ),
  },
  {
    text: "20% off your first filter — automatic at checkout",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11 V7 a2 2 0 0 0 -2 -2 H5 a2 2 0 0 0 -2 2 v4 a3 3 0 0 1 0 6 v4 a2 2 0 0 0 2 2 h14 a2 2 0 0 0 2 -2 v-4 a3 3 0 0 1 0 -6z" />
        <path d="M9 9 l6 6 M9 15 h.01 M15 9 h.01" />
      </svg>
    ),
  },
];

const ROTATE_MS = 4500;

export default function AnnouncementBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const current = MESSAGES[i];

  return (
    <div className="relative z-50 bg-deep text-bone overflow-hidden">
      {/* Subtle moving sheen */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "linear-gradient(110deg, transparent 30%, rgba(247,243,236,0.10) 50%, transparent 70%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0%", "-100% 0%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative mx-auto max-w-[1400px] px-5 md:px-10 h-9 flex items-center justify-center">
        {/* Left dot indicator */}
        <div className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5">
          {MESSAGES.map((_, idx) => (
            <span
              key={idx}
              className={`block h-1 rounded-full transition-all duration-500 ${
                idx === i ? "w-4 bg-bone" : "w-1 bg-bone/35"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2.5 text-[11px] md:text-[12px] tracking-[0.13em] uppercase font-medium"
          >
            <span className="text-bone/85">{current.icon}</span>
            <span>{current.text}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
