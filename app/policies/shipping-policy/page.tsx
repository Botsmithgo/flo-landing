import type { Metadata } from "next";
import { PolicyPage, PolicySection } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Shipping times, tracking, and delivery support for Feels Like Om orders.",
};

export default function ShippingPolicyPage() {
  return (
    <PolicyPage eyebrow="Customer care" title="Shipping policy.">
      <PolicySection title="Where we ship">
        <p>We currently ship to valid addresses in the United States. Contact us before ordering if you need delivery somewhere else.</p>
      </PolicySection>

      <PolicySection title="Shipping cost">
        <p>U.S. orders over $49 ship free. Subscription orders include free U.S. shipping on the first order and scheduled replacement-filter deliveries.</p>
      </PolicySection>

      <PolicySection title="Processing and delivery">
        <p>Most orders leave our fulfillment network within one to two business days. Standard delivery typically takes three to seven business days after shipment. These are estimates rather than guaranteed delivery dates.</p>
        <p>You will receive tracking information at the email address entered during checkout as soon as it becomes available.</p>
      </PolicySection>

      <PolicySection title="Address changes">
        <p>Contact us immediately if an address is incorrect. We will make the change when the order has not entered fulfillment, but we cannot guarantee changes after processing begins.</p>
      </PolicySection>

      <PolicySection title="Delayed, lost, or damaged orders">
        <p>If tracking has not moved for five business days, or your order arrives damaged or incomplete, contact us with your order number and photos when relevant. We will investigate and make it right.</p>
      </PolicySection>
    </PolicyPage>
  );
}
