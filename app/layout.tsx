import { SOCIAL_IMAGE } from "@/lib/social";
import type { Metadata } from "next";
import { fraunces, interTight } from "@/lib/fonts";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
// Lenis-based SmoothScroll removed — native scroll is faster on 120Hz devices
// and avoids trackpad double-inertia. Component file kept for easy revert.
// import SmoothScroll from "@/components/SmoothScroll";
import Analytics from "@/components/Analytics";
import WaterReportPopup from "@/components/WaterReportPopup";
import ScrollDepthTracker from "@/components/ScrollDepthTracker";
import { OrganizationSchema, WebSiteSchema } from "@/components/StructuredData";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Feels Like Om — Cleaner water for softer hair, calmer skin.",
    template: "%s — Feels Like Om",
  },
  description:
    "A 20-stage filtered shower head that reduces chlorine, heavy metals, and the chemicals that dry your hair and irritate your skin. A small ritual, repeated daily.",
  keywords: [
    "filtered shower head",
    "shower filter",
    "chlorine filter shower",
    "hard water shower head",
    "wellness shower",
    "Feels Like Om",
    "FLO shower filter",
  ],
  openGraph: {
    title: "Feels Like Om — Your daily reset.",
    description:
      "A little more Om in every shower. Discover our 20-stage filtered shower head in polished chrome or matte black.",
    type: "website",
    siteName: "Feels Like Om",
    url: SITE_URL,
    images: [SOCIAL_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Feels Like Om",
    description:
      "A little more Om in every shower. Discover the Feels Like Om filtered shower head.",
    images: [SOCIAL_IMAGE.url],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${interTight.variable} antialiased`}>
      <body className="min-h-screen bg-bone text-ink grain">
        <Analytics />
        <OrganizationSchema />
        <WebSiteSchema />
        <ScrollDepthTracker />
        <Nav />
        <main className="relative">{children}</main>
        <Footer />
        <WaterReportPopup />
      </body>
    </html>
  );
}
