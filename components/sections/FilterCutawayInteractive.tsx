"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type Stage = {
  n: string;
  name: string;
  subtitle: string;
  body: string;
  /** Vertical % position of the dot on the cutaway image (0 = top, 100 = bottom) */
  dotY: number;
  /** Which side the label sits on (desktop) */
  side: "left" | "right";
  /** Vertical % position of the label */
  labelY: number;
};

const STAGES: Stage[] = [
  {
    n: "01",
    name: "Activated carbon",
    subtitle: "Odor & taste",
    body:
      "Coconut-shell carbon adsorbs lingering odor and VOCs. The polishing stage — not the hero, but it's what removes the chemical smell.",
    dotY: 22,
    side: "left",
    labelY: 8,
  },
  {
    n: "02",
    name: "KDF-55",
    subtitle: "Chlorine reduction",
    body:
      "Copper-zinc redox media. Converts free chlorine to chloride via electrochemical reaction. Independently tested at 85–95% chlorine reduction.",
    dotY: 38,
    side: "right",
    labelY: 28,
  },
  {
    n: "03",
    name: "Calcium sulfite",
    subtitle: "Hot-water performance",
    body:
      "Most dechlorination media lose effectiveness at shower temperatures (95–110°F). Calcium sulfite holds its performance — picks up what KDF leaves.",
    dotY: 60,
    side: "left",
    labelY: 56,
  },
  {
    n: "04",
    name: "Mineral stones",
    subtitle: "Conditioning feel",
    body:
      "Tourmaline and germanium stones release negative ions. Some users report a brighter, softer water feel — perceptual, not pH-altering.",
    dotY: 82,
    side: "right",
    labelY: 78,
  },
];

export default function FilterCutawayInteractive() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      {/* DESKTOP — image with hotspots + side-positioned labels */}
      <div className="hidden lg:block relative aspect-[4/5]">
        {/* Image container (centered, ~55% width to leave room for labels on both sides) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[55%]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[70%] h-[70%] rounded-full bg-deep/30 blur-[100px]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[55%] h-[55%] rounded-full border border-bone/10 ripple" />
            <div className="absolute w-[55%] h-[55%] rounded-full border border-bone/8 ripple" style={{ animationDelay: "1.8s" }} />
          </div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-4"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/product/filter-cutaway.png"
                alt="20-stage filter cutaway showing media bands"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 35vw"
              />
            </div>
          </motion.div>

          {/* Hotspot dots positioned over the image */}
          {STAGES.map((s, i) => (
            <button
              key={`dot-${i}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => setActive(active === i ? null : i)}
              aria-label={`Stage ${s.n}: ${s.name}`}
              className={`absolute z-10 ${s.side === "left" ? "left-[15%]" : "right-[15%]"}`}
              style={{ top: `${s.dotY}%`, transform: "translate(-50%, -50%)" }}
            >
              <span className="relative flex">
                {/* Pulsing ping */}
                <span
                  className={`absolute inline-flex h-full w-full rounded-full bg-deep opacity-40 ${active === i ? "animate-ping" : "animate-pulse"}`}
                />
                {/* Solid dot */}
                <span
                  className={`relative inline-flex h-3 w-3 rounded-full transition-all ${
                    active === i ? "bg-bone ring-2 ring-deep scale-125" : "bg-deep ring-2 ring-bone/30"
                  }`}
                />
              </span>
            </button>
          ))}
        </div>

        {/* Connecting lines — SVG overlay covering full panel */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          {STAGES.map((s, i) => {
            const dotXPct = s.side === "left" ? 22.5 + 15 * 0.55 / 2 : 100 - (22.5 + 15 * 0.55 / 2);
            // Image is 55% wide centered → image left edge at 22.5%, right edge at 77.5%
            // Dot offset: 15% from inside edge → left dot at 22.5 + 15%*0.55 = 30.75%, right dot at 100-30.75 = 69.25%
            const dotXReal = s.side === "left" ? 30.75 : 69.25;
            const labelXReal = s.side === "left" ? 14 : 86;
            const lineColor = active === i ? "var(--color-bone)" : "rgba(247,243,236,0.25)";
            return (
              <line
                key={`line-${i}`}
                x1={`${dotXReal}%`}
                y1={`${s.dotY}%`}
                x2={`${labelXReal}%`}
                y2={`${s.labelY + 4}%`}
                stroke={lineColor}
                strokeWidth={active === i ? "1.2" : "1"}
                strokeDasharray={active === i ? "0" : "3 3"}
                style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
              />
            );
          })}
          {/* Force re-render — bonus dotXPct ref to silence unused */}
          <line x1={0} y1={0} x2={0} y2={0} stroke="transparent" data-x={STAGES.map((s) => (s.side === "left" ? 0 : 0)).join(",")} />
        </svg>

        {/* Side-positioned label cards */}
        {STAGES.map((s, i) => {
          const isActive = active === i;
          return (
            <motion.div
              key={`label-${i}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={`absolute z-20 w-[26%] ${s.side === "left" ? "left-[2%]" : "right-[2%]"}`}
              style={{ top: `${s.labelY}%` }}
              animate={{ scale: isActive ? 1.02 : 1 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={`rounded-sm transition-all p-3 cursor-pointer ${
                  isActive ? "bg-bone shadow-lg shadow-ink/40" : "bg-bone/10 backdrop-blur-sm hover:bg-bone/20"
                }`}
              >
                <p className={`overline text-[9px] mb-1 ${isActive ? "text-deep" : "text-bone/60"}`}>
                  Stage {s.n}
                </p>
                <p className={`display text-[15px] leading-tight ${isActive ? "text-ink" : "text-bone"}`}>
                  {s.name}
                </p>
                <p className={`text-[10.5px] mt-1.5 leading-snug ${isActive ? "text-muted" : "text-bone/55"}`}>
                  {s.subtitle}
                </p>
                <AnimatePresence>
                  {isActive && (
                    <motion.p
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="text-[11px] leading-relaxed text-ink/75 overflow-hidden"
                    >
                      {s.body}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}

        {/* Hover hint — subtle, fades after first interaction */}
        <AnimatePresence>
          {active === null && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase text-bone/50"
            >
              Hover the dots →
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* MOBILE — image stacked, labels in 2x2 grid below */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/5] mb-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-[70%] h-[70%] rounded-full bg-deep/30 blur-[100px]" />
          </div>
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-8"
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
          >
            <div className="relative w-full h-full">
              <Image
                src="/product/filter-cutaway.png"
                alt="20-stage filter cutaway showing media bands"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </motion.div>

          {/* Mobile dots (smaller, centered) */}
          {STAGES.map((s, i) => (
            <button
              key={`mdot-${i}`}
              onClick={() => setActive(active === i ? null : i)}
              aria-label={`Stage ${s.n}: ${s.name}`}
              className="absolute left-1/2"
              style={{ top: `${s.dotY}%`, transform: "translate(-50%, -50%)" }}
            >
              <span className="relative flex">
                <span className={`absolute inline-flex h-full w-full rounded-full bg-deep opacity-40 ${active === i ? "animate-ping" : "animate-pulse"}`} />
                <span className={`relative inline-flex h-2.5 w-2.5 rounded-full transition-all ${active === i ? "bg-bone ring-2 ring-deep scale-125" : "bg-deep ring-2 ring-bone/30"}`} />
              </span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {STAGES.map((s, i) => {
            const isActive = active === i;
            return (
              <button
                key={`mlabel-${i}`}
                onClick={() => setActive(active === i ? null : i)}
                className={`text-left p-3 rounded-sm border transition-all ${
                  isActive ? "border-deep bg-bone text-ink" : "border-bone/15 bg-ink-2 text-bone hover:border-bone/30"
                }`}
              >
                <p className={`overline text-[9px] mb-1 ${isActive ? "text-deep" : "text-bone/60"}`}>
                  Stage {s.n}
                </p>
                <p className={`display text-[14px] leading-tight ${isActive ? "text-ink" : "text-bone"}`}>
                  {s.name}
                </p>
                <p className={`text-[10px] mt-1 ${isActive ? "text-muted" : "text-bone/55"}`}>{s.subtitle}</p>
                <AnimatePresence>
                  {isActive && (
                    <motion.p
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-[11px] leading-relaxed text-ink/75 overflow-hidden"
                    >
                      {s.body}
                    </motion.p>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
