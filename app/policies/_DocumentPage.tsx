import type { ReactNode } from "react";
import Reveal from "@/components/Reveal";
import { BreadcrumbSchema } from "@/components/StructuredData";

/**
 * Shared shell for the plain-language policy pages.
 *
 * These routes did not exist on the deployed branch, yet the global footer
 * linked to both of them from every page on the site — so shipping and returns,
 * the two pages a buyer checks immediately before paying, were returning 404 to
 * customers and to Googlebot alike.
 */
export default function DocumentPage({
  overline,
  title,
  italic,
  crumb,
  href,
  children,
}: {
  overline: string;
  title: string;
  italic: string;
  crumb: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: crumb, url: href },
        ]}
      />
      <section className="bg-ink text-bone">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 pt-40 md:pt-52 pb-20 md:pb-28">
          <p className="overline text-bone/60 mb-6">{overline}</p>
          <h1 className="display text-[12vw] md:text-[7vw] leading-[0.95] max-w-4xl">
            {title}
            <br />
            <span className="display-italic text-sage">{italic}</span>
          </h1>
        </div>
      </section>

      <section className="bg-bone py-24 md:py-36">
        <div className="mx-auto max-w-[820px] px-5 md:px-10">
          <Reveal>
            <div className="space-y-10 text-[17px] md:text-[18px] leading-[1.75] text-ink/80 [&_h2]:display [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-ink [&_h2]:mb-4 [&_a]:text-deep [&_a]:underline [&_a]:underline-offset-4">
              {children}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
