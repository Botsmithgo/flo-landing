"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useId, useState } from "react";

type TooltipProps = {
  label: string;
  children: ReactNode;
  className?: string;
  side?: "top" | "bottom";
};

/**
 * Accessible tooltip trigger — shows on hover (desktop) and tap (mobile).
 * Keyboard-accessible via focus. Tooltip content is role=tooltip with aria-describedby.
 */
export default function Tooltip({ label, children, className = "", side = "top" }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center justify-center h-5 w-5 rounded-full border border-current/30 text-[10px] font-medium leading-none hover:bg-current/10 focus:outline-none focus:ring-2 focus:ring-current/40 transition-colors"
      >
        <span aria-hidden>i</span>
        <span className="sr-only">More info</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={id}
            role="tooltip"
            initial={{ opacity: 0, y: side === "top" ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: side === "top" ? 6 : -6 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${side === "top" ? "bottom-full mb-2" : "top-full mt-2"} left-1/2 -translate-x-1/2 w-64 z-40 rounded-sm bg-ink text-bone text-[12px] leading-relaxed p-3 shadow-lg shadow-ink/30 pointer-events-none`}
          >
            {children}
            <span
              className={`absolute ${side === "top" ? "top-full" : "bottom-full rotate-180"} left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-ink`}
            />
            <span className="sr-only">{label}</span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
