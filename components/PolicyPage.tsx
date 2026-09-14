import Link from "next/link";
import type { ReactNode } from "react";

export function PolicyPage({
  eyebrow,
  title,
  updated = "September 14, 2026",
  children,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <article className="bg-bone pt-36 md:pt-44 pb-24 md:pb-32">
      <div className="mx-auto max-w-[860px] px-5 md:px-10">
        <p className="overline text-deep mb-6">{eyebrow}</p>
        <h1 className="display text-[13vw] sm:text-[72px] md:text-[88px] leading-[0.95] text-ink">
          {title}
        </h1>
        <p className="mt-6 text-[13px] text-muted">Last updated {updated}</p>

        <div className="mt-14 md:mt-20 space-y-12 text-[15px] md:text-[16px] leading-[1.75] text-ink/80">
          {children}
        </div>

        <div className="mt-16 pt-8 border-t border-ink/15">
          <p className="text-[14px] text-muted">
            Need help?{" "}
            <Link href="/contact" className="text-ink border-b border-ink/30 hover:text-deep">
              Contact Feels Like Om
            </Link>
            .
          </p>
        </div>
      </div>
    </article>
  );
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="display text-3xl md:text-[38px] leading-tight text-ink mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
