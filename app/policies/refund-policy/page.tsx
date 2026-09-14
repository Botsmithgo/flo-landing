import type { Metadata } from "next";
import { PolicyPage, PolicySection } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Returns and Refunds",
  description: "The Feels Like Om 60-day return and refund policy.",
};

export default function RefundPolicyPage() {
  return (
    <PolicyPage eyebrow="60-day guarantee" title="Returns, without the runaround.">
      <PolicySection title="Try it for 60 days">
        <p>You may install and try your Feels Like Om shower filter. If it is not right for you, contact us within 60 days of delivery to request a return.</p>
      </PolicySection>

      <PolicySection title="Starting a return">
        <p>Use our contact page and include your order number, purchase channel, and reason for returning. Wait for return instructions before sending the product. Include the shower head, filter, and original accessories when possible.</p>
      </PolicySection>

      <PolicySection title="Return shipping">
        <p>Feels Like Om covers return shipping when an item arrives damaged, defective, or incorrect. For preference-based returns, the customer is responsible for return shipping.</p>
      </PolicySection>

      <PolicySection title="Refund timing">
        <p>Approved refunds are issued to the original payment method after the returned item is received or otherwise resolved by our support team. Banks and payment providers may take five to ten business days to post the credit.</p>
      </PolicySection>

      <PolicySection title="Subscriptions">
        <p>You can cancel future replacement-filter renewals at any time before the next order is processed. An order that has already entered fulfillment follows the return process above.</p>
      </PolicySection>

      <PolicySection title="Amazon and TikTok Shop orders">
        <p>Orders placed through Amazon or TikTok Shop must be returned through the marketplace where the purchase was completed, using that marketplace&apos;s return process.</p>
      </PolicySection>
    </PolicyPage>
  );
}
