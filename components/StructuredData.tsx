/**
 * Structured data (JSON-LD) for SEO + rich results.
 * Google, Bing, and ChatGPT Search parse these for Product / FAQ / Review rich cards.
 *
 * All URLs are pinned to SITE_URL (lib/site.ts) so a domain change is a single
 * env var flip, not a 4-file find/replace.
 */

import { SITE_URL } from "@/lib/site";

type ProductSchemaProps = {
  name: string;
  description: string;
  image: string[];
  sku: string;
  brand: string;
  price: number;
  priceCurrency?: string;
  aggregateRating?: { ratingValue: number; reviewCount: number };
};

export function ProductSchema(p: ProductSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    image: p.image,
    sku: p.sku,
    brand: { "@type": "Brand", name: p.brand },
    offers: {
      "@type": "Offer",
      price: p.price.toFixed(2),
      priceCurrency: p.priceCurrency ?? "USD",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/shower`,
    },
    ...(p.aggregateRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: p.aggregateRating.ratingValue.toFixed(1),
        reviewCount: p.aggregateRating.reviewCount,
      },
    }),
  };
  return (
    <script
      type="application/ld+json"
      // Schema.org JSON-LD is safe to inline as strings; no XSS surface here.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

type FAQSchemaProps = {
  questions: { q: string; a: string }[];
};

export function FAQSchema({ questions }: FAQSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * WebSite schema — renders once globally. Enables Google sitelinks and gives
 * AI crawlers a canonical pointer to the site entity.
 * SearchAction is intentionally omitted (no /search route; schema shouldn't lie).
 */
export function WebSiteSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: "Feels Like Om",
    alternateName: "FLO",
    publisher: {
      "@type": "Organization",
      name: "Feels Like Om",
      url: SITE_URL,
    },
    inLanguage: "en-US",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * BreadcrumbList schema — rendered per-page. Improves rich-result eligibility
 * and gives crawlers explicit hierarchy signals.
 */
type BreadcrumbItem = { name: string; url: string };
export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * HowTo schema for the 3-minute install. Content derived verbatim from the
 * existing FAQ answer — no new claims introduced.
 */
export function HowToSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to install the Feels Like Om Filtered Shower Head",
    description:
      "Install the Feels Like Om filtered shower head in under 90 seconds. Fits every standard U.S. shower arm. No plumber, no tools.",
    totalTime: "PT90S",
    tool: [{ "@type": "HowToTool", name: "Your hand (no wrench required)" }],
    supply: [
      { "@type": "HowToSupply", name: "Feels Like Om shower head" },
      { "@type": "HowToSupply", name: "Teflon tape (included)" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Remove your current shower head",
        text: "Unscrew your existing shower head counter-clockwise by hand. Most come off without tools.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Wrap the shower arm threads",
        text: "Wrap the included Teflon tape around the exposed shower arm threads two or three times, clockwise.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Screw on the Feels Like Om",
        text: "Thread the new shower head onto the arm clockwise until snug.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Hand-tighten and test",
        text: "Tighten by hand until fully seated. Turn on the water and check for leaks — retighten if needed.",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Feels Like Om",
    alternateName: "FLO",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "A 20-stage filtered shower head that reduces chlorine, heavy metals, and the chemicals that dry your hair and irritate your skin. A small ritual, repeated daily.",
    foundingDate: "2022",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Venice",
      addressRegion: "CA",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "hello@feelslikeom.shop",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://www.tiktok.com/@feelslikeom.shop",
      "https://www.amazon.com/dp/B0DHJ74TCC",
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
