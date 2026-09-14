import type { Metadata } from "next";
import { PolicyPage, PolicySection } from "@/components/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Feels Like Om collects and uses customer information.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage eyebrow="Your information" title="Privacy policy.">
      <PolicySection title="Information we collect">
        <p>We collect information you provide when you place an order, contact us, request a water report, or join our email list. This may include your name, email address, shipping address, order details, ZIP code, and messages.</p>
        <p>Our site may also collect device, browser, referral, advertising, and usage information through cookies and similar technologies.</p>
      </PolicySection>

      <PolicySection title="How we use it">
        <p>We use this information to process and fulfill orders, provide customer support, manage subscriptions, improve the site, measure advertising, prevent fraud, and send marketing only when you have opted in.</p>
      </PolicySection>

      <PolicySection title="Payments and service providers">
        <p>Payments are processed by Stripe and eligible payment partners such as Amazon Pay or Klarna. Feels Like Om does not store complete card details. We share information with service providers only as needed for payment, fulfillment, analytics, advertising, communications, and site operations.</p>
      </PolicySection>

      <PolicySection title="Your choices">
        <p>You can unsubscribe from marketing emails at any time using the link in an email. You may also contact us to request access, correction, or deletion of personal information, subject to legal and operational retention requirements.</p>
      </PolicySection>

      <PolicySection title="Data security and retention">
        <p>We use reasonable safeguards and retain information only as long as needed for the purposes described here, including order support, fraud prevention, accounting, and legal obligations.</p>
      </PolicySection>
    </PolicyPage>
  );
}
