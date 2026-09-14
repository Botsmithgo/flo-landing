import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order received",
  description: "Your Feels Like Om order has been received.",
  robots: { index: false, follow: false },
};

export default function OrderConfirmedPage() {
  return (
    <section className="min-h-[75vh] bg-bone pt-40 md:pt-48 pb-24 flex items-center">
      <div className="mx-auto w-full max-w-[820px] px-5 md:px-10 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-deep text-bone flex items-center justify-center" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4 4L19 7" />
          </svg>
        </div>
        <p className="overline text-deep mt-8 mb-5">Order received</p>
        <h1 className="display text-[13vw] sm:text-[72px] md:text-[88px] leading-[0.95] text-ink">
          Your shower ritual<br />starts soon.
        </h1>
        <p className="mt-8 text-[16px] md:text-[18px] leading-relaxed text-muted max-w-xl mx-auto">
          Check the email used at checkout for your receipt and order updates.
          We&apos;ll send tracking as soon as your order leaves fulfillment.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/shower#faq" className="btn-secondary text-ink border-ink/30">
            Installation and care
          </Link>
          <Link href="/contact" className="btn-primary">
            Contact support
          </Link>
        </div>
        <p className="mt-8 text-[12px] text-muted">
          No account was created. Subscription customers can manage future renewals using the secure link provided by Feels Like Om.
        </p>
      </div>
    </section>
  );
}
