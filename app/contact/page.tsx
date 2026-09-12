import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import { SOCIAL_IMAGE } from "@/lib/social";
import { CONTACT_EMAIL } from "@/lib/contact";
import ContactForm from "./ContactForm";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Questions about your shower filter, installation, or an order? Get in touch with the Feels Like Om team.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "A little help. A little Om. — Feels Like Om",
    description: "Product questions, order help, and everything in between. We're here to help.",
    url: `${SITE_URL}/contact`, type: "website", images: [SOCIAL_IMAGE],
  },
  twitter: { card: "summary_large_image", title: "Contact Feels Like Om", images: [SOCIAL_IMAGE.url] },
};

export default function ContactPage() {
  return (
    <section className={styles.page} data-surface="light">
      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className="overline text-deeper">Here for you</p>
          <h1 className="display">A little help.<br /><em>A little Om.</em></h1>
          <p className={styles.description}>Choosing your filter, settling it into your shower, or checking on an order. Whatever&apos;s on your mind, let&apos;s talk.</p>
          <div className={styles.direct}>
            <span className="overline text-deeper">Prefer email?</span>
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL} <span aria-hidden="true">↗</span></a>
          </div>
          <div className={styles.help}>
            <span className="overline text-deeper">A good place to start</span>
            <Link href="/shower#faq">Common questions <span aria-hidden="true">↗</span></Link>
            <p>Writing about an order? Include your order number and where you purchased so we can find the right details.</p>
          </div>
        </div>
        <div className={styles.card}>
          <p className="overline text-deeper">Get in touch</p>
          <h2 className="display">We&apos;re listening.</h2>
          <ContactForm deliveryEnabled={process.env.CONTACT_FORM_ENABLED === "true"} />
        </div>
      </div>
    </section>
  );
}
