/**
 * Structured data (JSON-LD) for SEO + rich results.
 * Google, Bing, and ChatGPT Search parse these for Product / FAQ / Review rich cards.
 */

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
      url: "https://feelslikeom.shop/shower",
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

export function OrganizationSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Feels Like Om",
    url: "https://feelslikeom.shop",
    logo: "https://feelslikeom.shop/logo.png",
    sameAs: ["https://www.tiktok.com/@feelslikeom.shop"],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
