"use client";

import { motion } from "framer-motion";
import { useOffer } from "@/lib/offerStore";
import { buildCheckoutUrl } from "@/lib/checkout";
import { track } from "@/lib/analytics";

type StickyATCProps = {
  productName: string;
  price: number;          // single (one-time) price
  subscribePrice: number; // subscribe price
  msrp: number;           // strikethrough anchor
};

export default function StickyATC({ productName, price, subscribePrice, msrp }: StickyATCProps) {
  const { plan, color } = useOffer();

  const activePrice = plan === "subscribe" ? subscribePrice : price;
  const planLabel = plan === "subscribe" ? "/ subscribe" : "/ first order";
  const href = buildCheckoutUrl({ variant: { plan, color } });

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-bone/95 backdrop-blur-md border-t border-ink/10"
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] uppercase tracking-widest text-muted">{productName}</span>
          <span className="text-[15px] text-ink font-medium">
            <span className="line-through text-muted mr-2 text-[13px]">${msrp}</span>
            ${activePrice} <span className="text-[11px] text-muted">{planLabel}</span>
          </span>
        </div>
        <a
          href={href}
          onClick={() => track("begin_checkout", {
            plan,
            color,
            price: activePrice,
            value: activePrice,
            currency: "USD",
            source: "sticky_atc",
          })}
          className="btn-primary !py-3 !px-5 text-[12px] whitespace-nowrap"
        >
          Get yours
        </a>
      </div>
    </motion.div>
  );
}
