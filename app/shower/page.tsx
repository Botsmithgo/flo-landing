import type { Metadata } from "next";
import ShowerHeroV2 from "@/components/sections/ShowerHeroV2";
import ShowerProof from "@/components/sections/ShowerProof";
import TikTokProof from "@/components/sections/TikTokProof";
import ShowerProblem from "@/components/sections/ShowerProblem";
import ShowerStudy from "@/components/sections/ShowerStudy";
import ShowerOffer from "@/components/sections/ShowerOffer";
import ShowerBenefits from "@/components/sections/ShowerBenefits";
import ShowerScience from "@/components/sections/ShowerScience";
import ShowerReviews from "@/components/sections/ShowerReviews";
import ShowerComparison from "@/components/sections/ShowerComparison";
import ShowerFAQ from "@/components/sections/ShowerFAQ";
import HomeCTA from "@/components/sections/HomeCTA";
import StickyATC from "@/components/StickyATC";
import { PRODUCTS, buildCheckoutUrl } from "@/lib/checkout";

export const metadata: Metadata = {
  title: "Filtered Shower Head — Softer hair, calmer skin",
  description:
    "The filtered shower head trusted by 1,400+ verified reviewers. 91% reported calmer skin in 4 weeks. 20-stage, lab-tested. 20% off first order + free shipping.",
  alternates: { canonical: "/shower" },
};

export default function ShowerPage() {
  const checkoutHref = PRODUCTS.shower.variants.subscription
    ? buildCheckoutUrl({
        variantId: PRODUCTS.shower.variants.subscription,
        quantity: 1,
        discount: process.env.NEXT_PUBLIC_FIRST_ORDER_DISCOUNT,
      })
    : "#offer";

  return (
    <>
      {/* HERO — benefit-forward, product + price + proof visible in one viewport */}
      <ShowerHeroV2 />

      {/* TRUST STRIPE — stars + press, immediately */}
      <ShowerProof />

      {/* TIKTOK SOCIAL PROOF — the 1M+ viewer hook */}
      <TikTokProof />

      {/* PROBLEM — now they're ready to care why */}
      <ShowerProblem />

      {/* STUDY — hard proof, numeric, above offer */}
      <ShowerStudy />

      {/* OFFER — MOVED UP: they're ready to buy by here */}
      <ShowerOffer />

      {/* Everything below is for the skeptics who keep reading */}
      <ShowerBenefits />
      <ShowerScience />
      <ShowerReviews />
      <ShowerComparison />
      <ShowerFAQ />
      <HomeCTA />

      <StickyATC
        productName="Shower Filter"
        price={PRODUCTS.shower.price}
        subscribePrice={PRODUCTS.shower.subscribePrice}
        href={checkoutHref}
      />
    </>
  );
}
