import type { Metadata } from "next";
import { fraunces, interTight } from "@/lib/fonts";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import Analytics from "@/components/Analytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://feelslikeom.shop"),
  title: {
    default: "Feels Like Om — Cleaner water for softer hair, calmer skin.",
    template: "%s — Feels Like Om",
  },
  description:
    "Independently-tested shower and bath filters that reduce chlorine, heavy metals, and the chemicals that dry your hair and irritate your skin. A small ritual, repeated daily.",
  keywords: [
    "filtered shower head",
    "shower filter",
    "bath water filter",
    "chlorine filter shower",
    "hard water shower head",
    "wellness shower",
    "Feels Like Om",
    "FLO shower filter",
  ],
  openGraph: {
    title: "Feels Like Om — Cleaner water, softer skin.",
    description:
      "Filtered shower head and bath water filter for softer hair, calmer skin, and a quieter daily ritual.",
    type: "website",
    siteName: "Feels Like Om",
  },
  twitter: {
    card: "summary_large_image",
    title: "Feels Like Om",
    description:
      "Filtered shower head and bath filter for softer hair and calmer skin.",
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
        <SmoothScroll>
          <Nav />
          <main className="relative">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
