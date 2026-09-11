import type { Metadata } from "next";
import HomeHero from "@/components/sections/HomeHero";
import HomePromise from "@/components/sections/HomePromise";
import HomeProducts from "@/components/sections/HomeProducts";
import HomeFounder from "@/components/sections/HomeFounder";
import HomeTestimonials from "@/components/sections/HomeTestimonials";
import HomeCTA from "@/components/sections/HomeCTA";

/**
 * The homepage was the ONLY route shipping without a canonical — /about and
 * /shower both had one. Google then has to guess between the apex, the www
 * host, and any ?utm_* variant an ad or an email lands on.
 *
 * Deliberately declared here rather than in app/layout.tsx: a layout-level
 * canonical is inherited by every child route that doesn't override
 * `alternates`, which would quietly point future pages at "/" and drop them
 * from the index.
 */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomePromise />
      <HomeProducts />
      <HomeFounder />
      <HomeTestimonials />
      <HomeCTA />
    </>
  );
}
