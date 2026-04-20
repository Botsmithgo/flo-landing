import type { Metadata } from "next";
import ShowerHeroV2 from "@/components/sections/ShowerHeroV2";
import ShowerProof from "@/components/sections/ShowerProof";
import TikTokProof from "@/components/sections/TikTokProof";
import ShowerProblem from "@/components/sections/ShowerProblem";
import ShowerStudy from "@/components/sections/ShowerStudy";
import BrandCredibility from "@/components/sections/BrandCredibility";
import ShowerBeforeAfter from "@/components/sections/ShowerBeforeAfter";
import ShowerOffer from "@/components/sections/ShowerOffer";
import ShowerBenefits from "@/components/sections/ShowerBenefits";
import RitualMoment from "@/components/sections/RitualMoment";
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
      {/* HERO */}
      <ShowerHeroV2 />

      {/* BRAND CREDIBILITY RIBBON — big numbers right after hero, lock trust fast */}
      <BrandCredibility />

      {/* TRUST STRIPE — stars + press */}
      <ShowerProof />

      {/* TIKTOK SOCIAL PROOF — the viral hook */}
      <TikTokProof />

      {/* PROBLEM */}
      <ShowerProblem />

      {/* STUDY — hard proof, numeric */}
      <ShowerStudy />

      {/* BEFORE/AFTER — strongest visual proof, right before the ask */}
      <ShowerBeforeAfter />

      {/* OFFER */}
      <ShowerOffer />

      {/* Everything below is for the skeptics who keep reading */}
      <ShowerBenefits />

      {/* Editorial breathing moment — clean bathroom atmosphere */}
      <RitualMoment />

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
