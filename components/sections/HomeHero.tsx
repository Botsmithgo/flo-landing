import Image from "next/image";
import Link from "next/link";
import styles from "./HomeHero.module.css";

export default function HomeHero() {
  return (
    <section className={styles.hero} data-surface="light">
      <div className={styles.art}>
        <Image
          src="/product/flo-background.webp"
          alt="Feels Like Om chrome shower head on a warm cream studio background"
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <p className={`overline ${styles.overline}`}>
          A ritual of quieter water
        </p>
        <h1 className={`display ${styles.title}`}>
          {/* The trailing space matters: without it every text extractor
              (Googlebot, GPTBot, screen readers) concatenates the two lines
              into "Pure waterfor a pure you." — <br /> contributes no
              whitespace to the accessibility tree or to extracted text. */}
          Pure water{" "}
          <br />
          for a <span className="display-italic text-deeper">pure you.</span>
        </h1>
        <p className={styles.description}>
          A 20-stage filter — engineered for the water you shower in every day.
        </p>
        <div className={styles.actions}>
          <Link href="/shower" className={`btn-primary ${styles.primary}`}>
            Upgrade your shower <span aria-hidden>→</span>
          </Link>
          <Link href="/about" className={styles.story}>
            Read the story
          </Link>
        </div>
        <div className={styles.trust}>
          <span className={styles.trustItem}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 1l1.8 4 4.2.4-3.2 2.8 1 4.2L7 10l-3.8 2.4 1-4.2L1 5.4l4.2-.4L7 1z"
                fill="currentColor"
              />
            </svg>
            100,000+ orders shipped
          </span>
          <span>Free U.S. shipping over $49</span>
          <span>60-day returns</span>
        </div>
      </div>
      <span className={styles.scrollCue} aria-hidden="true">
        ↓
      </span>
    </section>
  );
}
