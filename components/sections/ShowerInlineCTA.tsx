"use client";

import Reveal from "@/components/Reveal";
import { useOffer } from "@/lib/offerStore";
import { PRODUCTS, buildCheckoutUrl } from "@/lib/checkout";
import { track } from "@/lib/analytics";

/**
 * Mid-page inline CTA — sits between Benefits and Honesty sections.
 * Catches buyers who're convinced by section 5 (Benefits) so they don't have
 * to scroll through six more sections of social proof to find the close.
 * Reads plan/color from offerStore so the click respects the user's hero choice.
 */
export default function ShowerInlineCTA() {
  const { plan, color } = useOffer();
  const activePrice = plan === "subscribe" ? PRODUCTS.shower.subscribePrice : PRODUCTS.shower.price;
  const planLabel = plan === "subscribe" ? "Subscribe" : "First order";
  const href = buildCheckoutUrl({ variant: { plan, color } });

  return (
    <section className="bg-bone py-16 md:py-24 border-t border-ink/5">
      <div className="mx-auto max-w-[900px] px-5 md:px-10 text-center">
        <Reveal>
          <p className="overline text-deep mb-3">Ready when you are</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="display text-[8vw] md:text-[3.2vw] leading-[1.05] text-ink mb-5">
            Softer hair. Calmer skin.<br className="hidden md:inline" />{" "}
            <span className="italic text-deep">By your next shower.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="text-[15px] md:text-[16px] text-muted max-w-xl mx-auto leading-relaxed mb-8">
            Free shipping. 60-day full refund if you don&apos;t feel it in your
            hair and skin. Skip or cancel anytime.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <a
            href={href}
            onClick={() =>
              track("begin_checkout", {
                plan,
                color,
                price: activePrice,
                value: activePrice,
                currency: "USD",
                source: "inline_cta",
              })
            }
            className="btn-primary inline-flex items-center gap-2 !px-8 !py-4 text-[14px] md:text-[15px]"
          >
            Get yours — ${activePrice} · {planLabel}
            <span aria-hidden>→</span>
          </a>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-5 text-[11px] tracking-widest uppercase text-muted">
            Free shipping · 60-day returns · Skip or cancel anytime
          </p>
        </Reveal>
      </div>
    </section>
  );
}
