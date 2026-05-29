"use client";

/**
 * Navbar
 * ------
 * Fixed, transparent-on-hero navbar that fades in a blurred dark backdrop once
 * you scroll past the fold. Mobile = full-screen overlay menu. Active link gets
 * an ember underline.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navLinks, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Backdrop appears after a short scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-cinematic",
        scrolled
          ? "border-b border-border/60 bg-ink/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="frame flex h-20 items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ember-pulse rounded-full bg-ember" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-flame" />
          </span>
          <span className="font-display text-xl tracking-tight text-cream">
            Fire on the Bayou
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "relative font-mono text-[12px] uppercase tracking-widest transition-colors duration-300",
                    active ? "text-flame" : "text-mist hover:text-cream"
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px bg-flame transition-all duration-500 ease-cinematic",
                      active ? "w-full" : "w-0"
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile hamburger */}
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={cn(
              "h-px w-6 bg-cream transition-all duration-300",
              open && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "h-px w-6 bg-cream transition-all duration-300",
              open && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink/98 px-8 backdrop-blur-2xl md:hidden"
          >
            <ul className="space-y-6">
              {navLinks.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-5xl font-light text-cream"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <p className="mt-16 font-mono text-xs uppercase tracking-widest text-ash">
              {site.location}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
