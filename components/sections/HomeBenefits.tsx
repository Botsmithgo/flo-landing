import styles from "./HomeBenefits.module.css";

const BENEFITS = [
  {
    title: "60-day money-back guarantee",
    detail: "Find your Om. Or get your money back.",
    icon: "shield",
  },
  {
    title: "Free U.S. shipping",
    detail: "On every order over $49.",
    icon: "truck",
  },
  {
    title: "Installs in minutes",
    detail: "No tools. No plumber. Just you.",
    icon: "wrench",
  },
] as const;

function BenefitIcon({ type }: { type: typeof BENEFITS[number]["icon"] }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {type === "shield" && <><path d="M12 3 4.5 6v5c0 4.5 3.1 7.8 7.5 10 4.4-2.2 7.5-5.5 7.5-10V6L12 3Z" /><path d="m8.5 11.5 2.5 2.5 4.5-4.5" /></>}
      {type === "truck" && <><path d="M3 6h11v11H3zM14 10h4l3 4v3h-7" /><circle cx="6.5" cy="17.5" r="2" fill="var(--bone)" /><circle cx="17.5" cy="17.5" r="2" fill="var(--bone)" /></>}
      {type === "wrench" && <path d="M14.7 6.3a5 5 0 0 0-6.2 6.2l-5 5a2.1 2.1 0 0 0 3 3l5-5a5 5 0 0 0 6.2-6.2l-3.3 3.3-3-3 3.3-3.3Z" />}
    </svg>
  );
}

export default function HomeBenefits() {
  return (
    <div className={styles.section}>
      <ul className={styles.cards} aria-label="The FLO promise">
        {BENEFITS.map(({ title, detail, icon }) => (
          <li className={styles.card} key={icon}>
            <span className={styles.icon}><BenefitIcon type={icon} /></span>
            <div><h2>{title}</h2><p>{detail}</p></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
