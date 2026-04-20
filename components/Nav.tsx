"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/shower", label: "The Shower Filter" },
  { href: "/about", label: "Story" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled ? "bg-bone/85 backdrop-blur-md border-b border-ink/5" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 md:px-10 h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="display text-[22px] md:text-[26px] text-ink tracking-tight">
              Feels Like Om
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[13px] tracking-wide transition-colors ${
                    active ? "text-ink" : "text-ink/70 hover:text-ink"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-px bg-deep"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/shower#offer"
              className="hidden md:inline-flex text-[12px] tracking-[0.15em] uppercase px-4 py-2 rounded-full bg-deep text-bone hover:bg-ink transition-colors"
            >
              Shop
            </Link>
            <button
              aria-label="Menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col gap-[5px] w-8 h-8 items-center justify-center"
            >
              <span className={`block w-5 h-px bg-ink transition-transform duration-300 ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`block w-5 h-px bg-ink transition-transform duration-300 ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 md:hidden bg-bone pt-24 px-8"
          >
            <nav className="flex flex-col gap-6">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={link.href}
                    className="display text-4xl text-ink"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="pt-8"
              >
                <Link href="/shower#offer" className="btn-primary">
                  Shop Now
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
