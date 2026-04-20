"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SkipToOffer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      // Show after hero (~80% of first viewport) and hide when offer section reaches viewport
      const scrolled = window.scrollY;
      const past = scrolled > window.innerHeight * 0.8;
      const offer = document.getElementById("offer");
      const near = offer ? offer.getBoundingClientRect().top < window.innerHeight * 1.2 : false;
      setVisible(past && !near);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#offer"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hidden md:inline-flex fixed bottom-6 right-6 z-30 items-center gap-2 px-5 py-3 rounded-full bg-deep text-bone text-[12px] tracking-widest uppercase shadow-lg shadow-ink/20 hover:bg-ink transition-colors"
        >
          Skip to offer
          <span aria-hidden>↓</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
