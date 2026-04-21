import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-ink text-bone/80 relative" data-surface="dark">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 pt-24 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
          <div className="col-span-2">
            <Link href="/" className="inline-block" aria-label="Feels Like Om — Home">
              <Image
                src="/logo.png"
                alt="Feels Like Om"
                width={645}
                height={158}
                className="h-[38px] md:h-[44px] w-auto invert brightness-[1.08]"
              />
            </Link>
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-bone/60">
              Cleaner water for softer hair, calmer skin, and quieter mornings.
              A small ritual — repeated daily.
            </p>
          </div>

          <div>
            <p className="overline text-bone/50 mb-4">Shop</p>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/shower" className="hover:text-bone transition-colors">Filtered Shower Head</Link></li>
              <li><Link href="/shower#offer" className="hover:text-bone transition-colors">Subscribe &amp; Save</Link></li>
              <li><Link href="/shower#science" className="hover:text-bone transition-colors">How it works</Link></li>
            </ul>
          </div>

          <div>
            <p className="overline text-bone/50 mb-4">Company</p>
            <ul className="space-y-2 text-[14px]">
              <li><Link href="/about" className="hover:text-bone transition-colors">Our Story</Link></li>
              <li><a href="mailto:hello@feelslikeom.shop" className="hover:text-bone transition-colors">Contact</a></li>
              <li><a href="https://feelslikeom.shop/policies/shipping-policy" className="hover:text-bone transition-colors">Shipping</a></li>
              <li><a href="https://feelslikeom.shop/policies/refund-policy" className="hover:text-bone transition-colors">Returns</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-bone/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-[12px] text-bone/50">
          <p>&copy; {new Date().getFullYear()} Feels Like Om. All rights reserved.</p>
          <p className="max-w-md leading-relaxed text-[11px]">
            <strong className="text-bone/70">⚠ Prop 65 Warning (California):</strong> This product
            can expose you to chemicals including lead, which is known to the State of California
            to cause cancer and birth defects or other reproductive harm.{" "}
            <a href="https://www.p65warnings.ca.gov" className="underline">P65Warnings.ca.gov</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
