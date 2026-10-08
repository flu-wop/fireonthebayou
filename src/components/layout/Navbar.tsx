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
import { useLenis } from "lenis/react";
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

  // Lock scroll (native + Lenis) while the mobile menu is open.
  const lenis = useLenis();
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) lenis?.stop();
    else lenis?.start();
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [open, lenis]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-cinematic",
        scrolled
          ? "border-b border-border/60 bg-ink/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="frame flex h-20 items-center justify-between short:h-14">
        {/* Wordmark */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/fotb-logo.png"
            alt="Fire on the Bayou"
            width={297}
            height={107}
            className="h-9 w-auto transition-opacity duration-300 group-hover:opacity-85 md:h-12 short:h-8"
          />
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
                    "relative font-mono text-[13px] tracking-wide transition-colors duration-300",
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
          <li>
            <Link
              href="/consult"
              className={cn(
                "rounded-full border px-5 py-2 font-mono text-[13px] tracking-wide transition-colors duration-300",
                pathname?.startsWith("/consult")
                  ? "border-flame text-flame"
                  : "border-flame/60 text-cream hover:border-flame hover:bg-[#E21A52]/10"
              )}
            >
              Book a consult
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          aria-label={open ? "Close menu" : "Menu"}
          aria-expanded={open}
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

    </header>

      {/* Mobile overlay menu — a sibling of <header>, not a child: the header's
          backdrop-blur would otherwise trap this fixed overlay inside it. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            data-lenis-prevent
            className="fixed inset-0 z-40 flex flex-col justify-center overflow-y-auto bg-ink px-8 pb-10 pt-24 md:hidden short:justify-start short:pt-20"
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
                    className="font-display text-5xl font-light text-cream short:text-3xl"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="mt-12 flex flex-wrap gap-3">
              <Link
                href="/consult"
                onClick={() => setOpen(false)}
                className="rounded-full bg-ember px-6 py-3 font-mono text-[13px] tracking-wide text-cream"
              >
                Book a consult
              </Link>
              <a
                href={site.merch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-6 py-3 font-mono text-[13px] tracking-wide text-cream"
              >
                Merch ↗
              </a>
            </div>
            <p className="mt-12 font-mono text-xs tracking-wide text-ash">
              {site.location}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
