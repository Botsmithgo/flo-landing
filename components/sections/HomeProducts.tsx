"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Reveal from "@/components/Reveal";

const PRODUCTS = [
  {
    href: "/shower",
    eyebrow: "The daily one",
    title: "Filtered Shower Head",
    price: 139,
    subPrice: 125,
    line: "20-stage media stack. Reduces chlorine, heavy metals, odor, and sediment — at hot-shower temperatures.",
    bullets: ["6 months / 12,000 gallons per filter", "Installs in under 90 seconds", "Fits standard U.S. thread"],
    image: "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=1600&q=85",
  },
  {
    href: "/bath",
    eyebrow: "The slow one",
    title: "Bath Water Filter",
    price: 59,
    subPrice: 53,
    line: "A dechlorinating filter that clips to your tap and softens the water before it ever touches your skin.",
    bullets: ["Catches chlorine + sediment before fill", "No tools, no install", "Designed for long soaks"],
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600&q=85",
  },
] as const;

export default function HomeProducts() {
  return (
    <section className="bg-mist py-32 md:py-44">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <div className="flex items-end justify-between mb-20 md:mb-28">
          <Reveal>
            <div>
              <p className="overline text-deep mb-6">The collection</p>
              <h2 className="display text-[11vw] md:text-[6vw] leading-[0.98] max-w-2xl">
                Two filters.
                <br />
                <span className="display-italic text-deep">One quieter routine.</span>
              </h2>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-14">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.href} delay={0.15 * i} y={40}>
              <Link href={p.href} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-water">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </motion.div>
                  <div className="absolute top-5 left-5 overline text-bone bg-ink/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    {p.eyebrow}
                  </div>
                  <div className="absolute bottom-5 right-5 h-10 w-10 rounded-full bg-bone text-ink flex items-center justify-center group-hover:bg-deep group-hover:text-bone transition-colors">
                    →
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-12 gap-4 items-start">
                  <div className="col-span-8">
                    <h3 className="display text-[32px] md:text-[38px] leading-tight">{p.title}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted max-w-md">{p.line}</p>
                    <ul className="mt-5 space-y-1.5 text-[13px] text-ink/70">
                      {p.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="text-deep">·</span> {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-span-4 text-right">
                    <p className="overline text-muted mb-1">From</p>
                    <p className="display text-3xl text-ink">${p.subPrice}</p>
                    <p className="text-[11px] text-muted mt-1">with subscription</p>
                    <p className="text-[11px] text-muted line-through">${p.price} one-time</p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
