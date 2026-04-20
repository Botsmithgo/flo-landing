import HomeHero from "@/components/sections/HomeHero";
import HomePromise from "@/components/sections/HomePromise";
import HomeProducts from "@/components/sections/HomeProducts";
import HomeFounder from "@/components/sections/HomeFounder";
import HomeTestimonials from "@/components/sections/HomeTestimonials";
import HomeCTA from "@/components/sections/HomeCTA";

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
