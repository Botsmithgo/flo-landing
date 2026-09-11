import type { Metadata } from "next";
import Link from "next/link";
import DocumentPage from "../_DocumentPage";

export const metadata: Metadata = {
  title: "Returns & Refunds",
  description:
    "Feels Like Om offers a 60-day return window. How to request return instructions, what to do before sending anything back, and how Amazon orders are handled.",
  alternates: { canonical: "/policies/refund-policy" },
};

export default function Returns() {
  return (
    <DocumentPage
      overline="A little reassurance"
      title="Find your fit."
      italic="Take your time."
      crumb="Returns"
      href="/policies/refund-policy"
    >
      <section>
        <h2>60-day returns</h2>
        <p>
          Feels Like Om offers a 60-day return window. If the shower head is not
          right for you, email{" "}
          <a href="mailto:hello@feelslikeom.shop?subject=Return%20request">
            hello@feelslikeom.shop
          </a>{" "}
          with your order number to request a return.
        </p>
      </section>

      <section>
        <h2>Before sending anything back</h2>
        <p>
          Contact us first for the correct return address, packaging
          instructions and any applicable return-shipping details. Keep your
          shipping receipt until the return is resolved.
        </p>
      </section>

      <section>
        <h2>Subscription orders</h2>
        <p>
          If you also want to stop future refills, say so in your message. A
          return request and a cancellation request are handled separately — we
          will confirm when each one has been processed.
        </p>
      </section>

      <section>
        <h2>Amazon purchases</h2>
        <p>
          If you purchased through Amazon, start with the return options on your
          Amazon order — that is the faster route. See also our{" "}
          <Link href="/policies/shipping-policy">shipping policy</Link>.
        </p>
      </section>
    </DocumentPage>
  );
}
