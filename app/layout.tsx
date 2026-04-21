import type { Metadata } from "next";
import { fraunces, interTight } from "@/lib/fonts";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
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
    title: "Feels Like Om — Cleaner water, softer skin.",
    description:
      "A 20-stage filtered shower head. Reduces chlorine, heavy metals, and the chemicals that dry your hair and irritate your skin. Trusted by 100,000+ customers.",
    type: "website",
    siteName: "Feels Like Om",
    url: SITE_URL,
    images: [
      {
        url: "/product/bathroom-scene.jpg",
        width: 1344,
        height: 768,
        alt: "A luxury bathroom in warm morning light — Feels Like Om",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Feels Like Om",
    description:
      "Filtered shower head for softer hair and calmer skin. 100K+ orders, 4.8★ avg rating.",
    images: ["/product/bathroom-scene.jpg"],
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
        <SmoothScroll>
          <Nav />
          <main className="relative">{children}</main>
          <Footer />
        </SmoothScroll>
        <WaterReportPopup />
      </body>
    </html>
  );
}
