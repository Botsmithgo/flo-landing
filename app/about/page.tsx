import type { Metadata } from "next";
import AboutContent from "./AboutContent";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story — True beauty starts with clean water",
  description:
    "Feels Like Om builds filters that quiet the chemistry of your daily water. Our story, our principles, and why water is the most overlooked ingredient in your routine.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Our Story — Feels Like Om",
    description:
      "How a small company came to build a 20-stage filtered shower head. Our principles: claim less, deliver more.",
    type: "website",
    url: `${SITE_URL}/about`,
    images: [
      {
        url: "/product/hero-lifestyle.jpg",
        width: 1200,
        height: 800,
        alt: "Soft water falling in a moody bathroom — Feels Like Om",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Story — Feels Like Om",
    description:
      "How a small company came to build a 20-stage filtered shower head.",
    images: ["/product/hero-lifestyle.jpg"],
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Our Story", url: "/about" },
        ]}
      />
      <AboutContent />
    </>
  );
}
