import type { Metadata } from "next";
import ShowerHeroV2 from "@/components/sections/ShowerHeroV2";
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
import SkipToOffer from "@/components/SkipToOffer";
import { ProductSchema, FAQSchema } from "@/components/StructuredData";
import { PRODUCTS, buildCheckoutUrl } from "@/lib/checkout";

const FAQ_FOR_SCHEMA = [
  { q: "How does installation work?", a: "Unscrew your current shower head, screw on the FLO, tighten by hand. Total time under 90 seconds. Fits every standard U.S. shower arm." },
  { q: "How often do I replace the filter?", a: "Every six months, or 12,000 gallons, whichever comes first. Subscribers get replacements auto-shipped." },
  { q: "Will this lower my water pressure?", a: "No. The 20-stage filter is designed with a wide flow path so you get full-pressure showers." },
  { q: "Does it remove chloramine?", a: "Chloramine is harder to reduce than free chlorine. We've seen meaningful reduction in independent testing but if you live in a chloramine-heavy city, we recommend also using our bath filter for longest-contact exposure." },
  { q: "Will it soften my hard water?", a: "A shower-head filter can't do true softening (that requires whole-home ion exchange). What it does is take out the chlorine edge that dries your hair and irritates skin." },
  { q: "Return policy?", a: "60 days, full refund. If the water isn't better than what you had, we don't want your money." },
];

export const metadata: Metadata = {
  title: "Filtered Shower Head — Softer hair, calmer skin",
  description:
    "The filtered shower head trusted by 1,400+ verified reviewers. 91% reported calmer skin in 4 weeks. 20-stage, lab-tested. 20% off first order + free shipping.",
  alternates: { canonical: "/shower" },
};

export default function ShowerPage() {
  // buildCheckoutUrl returns Amazon URL in Amazon mode (no variant IDs needed);
  // switches to Shopify permalink when NEXT_PUBLIC_CHECKOUT_MODE=shopify + variants set.
  const checkoutHref = buildCheckoutUrl({
    variantId: PRODUCTS.shower.variants.subscription,
    quantity: 1,
    discount: process.env.NEXT_PUBLIC_FIRST_ORDER_DISCOUNT,
  });

  return (
    <>
      <ProductSchema
        name="Feels Like Om Filtered Shower Head (20-Stage)"
        description="20-stage filtered shower head that reduces chlorine, heavy metals, and the chemicals that dry hair and irritate skin. Independently lab-tested. 6-month filter, 90-second install, 60-day guarantee."
        image={[
          "https://feelslikeom.shop/product/product-white-composite.jpg",
          "https://feelslikeom.shop/product/product-black-composite.jpg",
          "https://feelslikeom.shop/product/bathroom-scene.jpg",
        ]}
        sku="B0DHJ74TCC"
        brand="Feels Like Om"
        price={PRODUCTS.shower.subscribePrice}
        aggregateRating={{ ratingValue: 4.8, reviewCount: 1400 }}
      />
      <FAQSchema questions={FAQ_FOR_SCHEMA} />

      {/* HERO */}
      <ShowerHeroV2 />

      {/* BRAND CREDIBILITY RIBBON — big numbers right after hero, lock trust fast */}
      <BrandCredibility />

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
      <SkipToOffer />
    </>
  );
}
