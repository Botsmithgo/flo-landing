"use client";

import { useRef, useState, type FormEvent } from "react";
import { CONTACT_EMAIL, CONTACT_TOPICS } from "@/lib/contact";
import styles from "./contact.module.css";

export default function ContactForm({ deliveryEnabled }: { deliveryEnabled: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const statusRef = useRef<HTMLDivElement>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = event.currentTarget;
    const fields = Object.fromEntries(new FormData(form));
    if (fields.botcheck) return;
    const subject = `FLO — ${fields.topic}`;
    const message = `Name: ${fields.name}\nEmail: ${fields.email}\nOrder: ${fields.order || "Not provided"}\n\n${fields.message}`;
    // Until the receiving inbox is verified, offer a real email draft rather
    // than pretending an unconfigured form has sent a message.
    if (!deliveryEnabled) {
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      return;
    }
    setState("sending");
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${CONTACT_EMAIL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          _url: "https://www.feelslikeom.shop/contact",
          name: fields.name,
          email: fields.email,
          topic: fields.topic,
          order: fields.order,
          message: fields.message,
          _honey: "",
        }),
        signal: AbortSignal.timeout(20000),
      });
      const result = await response.json();
      if (!response.ok || (result.success !== true && result.success !== "true")) throw new Error("Submission failed");
      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <div className={styles.row}>
        <label htmlFor="contact-name">Your name<input id="contact-name" name="name" autoComplete="name" required maxLength={100} /></label>
        <label htmlFor="contact-email">Email address<input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      </div>
      <label htmlFor="contact-topic">What can we help with?<select id="contact-topic" name="topic" defaultValue="Product question">{CONTACT_TOPICS.map(topic => <option key={topic}>{topic}</option>)}</select></label>
      <label htmlFor="contact-order">Order number <span className={styles.optional}>(optional)</span><input id="contact-order" name="order" maxLength={100} placeholder="Website or Amazon order number" /></label>
      <label htmlFor="contact-message">Your message<textarea id="contact-message" name="message" required minLength={10} maxLength={5000} rows={5} placeholder="Tell us a little about what's going on…" /></label>
      <div className={styles.honeypot} aria-hidden="true"><label>Leave this empty<input name="botcheck" tabIndex={-1} autoComplete="off" /></label></div>
      <p className={styles.note}>Please don&apos;t include payment details or passwords.</p>
      {!deliveryEnabled && <p className={styles.note}>Opens your email app with your message ready to send.</p>}
      <button className="btn-primary" type="submit" disabled={state === "sending"} aria-busy={state === "sending"}>
        {state === "sending" ? "Sending…" : deliveryEnabled ? "Send message" : "Continue in email"}<span aria-hidden="true">→</span>
      </button>
      <div ref={statusRef} tabIndex={-1} role="status" aria-live="polite" className={styles.status}>
        {state === "success" && <p>Thanks for reaching out. Your message has been submitted. We&apos;ll reply to the email address you provided.</p>}
        {state === "error" && <p>We couldn&apos;t confirm your submission. Your message is still here. Try again, or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p>}
      </div>
    </form>
  );
}
