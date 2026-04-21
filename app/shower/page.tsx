import type { Metadata } from "next";
import ShowerHeroV2 from "@/components/sections/ShowerHeroV2";
import BrandCredibility from "@/components/sections/BrandCredibility";
import ShowerResults from "@/components/sections/ShowerResults";
import ShowerProblem from "@/components/sections/ShowerProblem";
import ShowerScienceInteractive from "@/components/sections/ShowerScienceInteractive";
import ShowerBenefits from "@/components/sections/ShowerBenefits";
import ShowerHonesty from "@/components/sections/ShowerHonesty";
import AmazonReviewsGrid from "@/components/sections/AmazonReviewsGrid";
import CustomerUGC from "@/components/sections/CustomerUGC";
import TikTokProof from "@/components/sections/TikTokProof";
import ShowerComparison from "@/components/sections/ShowerComparison";
import ShowerFAQ from "@/components/sections/ShowerFAQ";
import RitualMoment from "@/components/sections/RitualMoment";
import HomeCTA from "@/components/sections/HomeCTA";
import StickyATC from "@/components/StickyATC";
import { ProductSchema, FAQSchema } from "@/components/StructuredData";
import { PRODUCTS } from "@/lib/checkout";

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
    "The filtered shower head trusted by 1,400+ verified reviewers. 91% reported calmer skin in a 4-week customer study. 20-stage filtration. 20% off first order + free shipping.",
  alternates: { canonical: "/shower" },
};

export default function ShowerPage() {
  // Route to FLO's own /checkout page (branded order summary + email capture
  // before Stripe/Amazon payment redirect)
  const checkoutHref = "/checkout?plan=subscribe&color=chrome";

  return (
    <>
      <ProductSchema
        name="Feels Like Om Filtered Shower Head (20-Stage)"
        description="20-stage filtered shower head that reduces chlorine, heavy metals, and the chemicals that dry hair and irritate skin. 6-month filter, three-minute install, 60-day guarantee."
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

      {/* HERO — inline offer + buy CTA above the fold */}
      <ShowerHeroV2 />

      {/* 1. TRUST RIBBON — quick numeric trust hit */}
      <BrandCredibility />

      {/* 2. RESULTS — consolidated panel: comparison image + 4-week study stats */}
      <ShowerResults />

      {/* 3. PROBLEM — research-backed agitation (EPA, CDC, EWG framed) */}
      <ShowerProblem />

      {/* 4. SCIENCE — interactive exploded filter with hover glossary */}
      <ShowerScienceInteractive />

      {/* 5. BENEFITS — six tangible shifts */}
      <ShowerBenefits />

      {/* 6. HONESTY — radical transparency, converts skeptics */}
      <ShowerHonesty />

      {/* 7. AMAZON REVIEWS — long-form verified proof */}
      <AmazonReviewsGrid />

      {/* 8. CUSTOMER UGC — auto-hides until URLs are added */}
      <CustomerUGC />

      {/* 9. TIKTOK — demoted to 'social cluster' at bottom; view count is
            already in BrandCredibility, this is supplementary reach proof now */}
      <TikTokProof />

      {/* 10. COMPARISON vs Jolie */}
      <ShowerComparison />

      {/* 11. FAQ — objection handling */}
      <ShowerFAQ />

      {/* 12. RITUAL MOMENT — cinematic breath before the final ask */}
      <RitualMoment />

      {/* 13. CLOSING CTA */}
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
