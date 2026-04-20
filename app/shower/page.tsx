import type { Metadata } from "next";
import ShowerHero from "@/components/sections/ShowerHero";
import ShowerProof from "@/components/sections/ShowerProof";
import ShowerProblem from "@/components/sections/ShowerProblem";
import ShowerScience from "@/components/sections/ShowerScience";
import ShowerStudy from "@/components/sections/ShowerStudy";
import ShowerBenefits from "@/components/sections/ShowerBenefits";
import ShowerComparison from "@/components/sections/ShowerComparison";
import ShowerReviews from "@/components/sections/ShowerReviews";
import ShowerOffer from "@/components/sections/ShowerOffer";
import ShowerFAQ from "@/components/sections/ShowerFAQ";
import HomeCTA from "@/components/sections/HomeCTA";
import StickyATC from "@/components/StickyATC";
import { PRODUCTS, buildCheckoutUrl } from "@/lib/checkout";

export const metadata: Metadata = {
  title: "Filtered Shower Head — 20-stage, lab-tested",
  description:
    "A 20-stage filtered shower head that reduces chlorine, heavy metals, and odor before they reach your hair and skin. Independently lab-tested. 60-day returns.",
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
      <ShowerHero />
      <ShowerProof />
      <ShowerProblem />
      <ShowerScience />
      <ShowerStudy />
      <ShowerBenefits />
      <ShowerComparison />
      <ShowerReviews />
      <ShowerOffer />
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
