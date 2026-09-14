import type { Metadata } from "next";
import { PolicyPage, PolicySection } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Purchase, promotion, and subscription terms for Feels Like Om.",
};

export default function TermsPage() {
  return (
    <PolicyPage eyebrow="Purchase terms" title="Terms of service.">
      <PolicySection title="First-order offer">
        <p>The advertised $80 first-order price is available to eligible new customers and is applied automatically at checkout. It is limited to one redemption per customer, household, and payment method, cannot be combined with another promotion, and may be withdrawn or changed for future orders.</p>
      </PolicySection>

      <PolicySection title="Subscriptions">
        <p>When you choose Subscribe &amp; Save, you authorize Feels Like Om to charge the payment method selected at checkout for scheduled replacement filters. The current offer is $80 today, followed by $39 every six months, plus any applicable tax. Shipping is included for U.S. subscription orders.</p>
        <p>You may skip, pause, or cancel before the next order is processed. Changes apply to future renewals.</p>
      </PolicySection>

      <PolicySection title="Product expectations">
        <p>Water quality and personal-care results vary by household, local water chemistry, installation, and use. The shower filter is not a medical treatment. Product details, care instructions, and stated limitations form part of these terms.</p>
      </PolicySection>

      <PolicySection title="Orders and pricing">
        <p>Prices are shown in U.S. dollars. Applicable taxes are calculated at checkout. We may cancel or refund an order affected by an obvious pricing error, suspected fraud, unavailable inventory, or an address we cannot serve.</p>
      </PolicySection>

      <PolicySection title="Returns">
        <p>Website purchases are covered by the return policy published on this site. Purchases made through Amazon or TikTok Shop follow the marketplace&apos;s policies.</p>
      </PolicySection>
    </PolicyPage>
  );
}
