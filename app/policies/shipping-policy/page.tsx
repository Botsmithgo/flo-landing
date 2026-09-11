import type { Metadata } from "next";
import Link from "next/link";
import DocumentPage from "../_DocumentPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery",
  description:
    "How Feels Like Om orders ship. Subscription orders include free shipping; one-time orders show delivery options and the final total at checkout.",
  alternates: { canonical: "/policies/shipping-policy" },
};

export default function Shipping() {
  return (
    <DocumentPage
      overline="The details"
      title="On its way"
      italic="to your everyday."
      crumb="Shipping"
      href="/policies/shipping-policy"
    >
      <section>
        <h2>Shipping</h2>
        <p>
          Subscription orders include free shipping. For one-time orders, the
          available delivery options and the final total are shown at checkout
          before you pay.
        </p>
        <p>
          Delivery timing depends on your address and fulfillment. If you need
          your order by a particular date, contact us before ordering so we can
          check whether it is realistic.
        </p>
      </section>

      <section>
        <h2>Order help</h2>
        <p>
          Email{" "}
          <a href="mailto:hello@feelslikeom.shop">hello@feelslikeom.shop</a> with
          your order number for tracking or delivery questions. A human answers.
        </p>
      </section>

      <section>
        <h2>Refills</h2>
        <p>
          Your subscription confirmation lists the timing of future cartridge
          orders — that schedule is the authoritative one for your account.
          Email us if you need a shipment moved, paused or cancelled.
        </p>
      </section>

      <section>
        <h2>Amazon orders</h2>
        <p>
          If you bought through Amazon, shipping and tracking are handled there.
          Start with the options on your Amazon order. See also our{" "}
          <Link href="/policies/refund-policy">returns policy</Link>.
        </p>
      </section>
    </DocumentPage>
  );
}
