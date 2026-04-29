"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useOffer } from "@/lib/offerStore";

type StickyATCProps = {
  productName: string;
  price: number;          // single (one-time) price
  subscribePrice: number; // subscribe price
  msrp: number;           // strikethrough anchor
};

export default function StickyATC({ productName, price, subscribePrice, msrp }: StickyATCProps) {
  const { plan, color } = useOffer();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > window.innerHeight * 0.8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activePrice = plan === "subscribe" ? subscribePrice : price;
  const planLabel = plan === "subscribe" ? "/ subscribe" : "/ first order";
  const href = `/checkout?plan=${plan}&color=${color}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-bone/95 backdrop-blur-md border-t border-ink/10"
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] uppercase tracking-widest text-muted">{productName}</span>
              <span className="text-[15px] text-ink font-medium">
                <span className="line-through text-muted mr-2 text-[13px]">${msrp}</span>
                ${activePrice} <span className="text-[11px] text-muted">{planLabel}</span>
              </span>
            </div>
            <a
              href={href}
              className="btn-primary !py-3 !px-5 text-[12px] whitespace-nowrap"
            >
              Add to cart
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
