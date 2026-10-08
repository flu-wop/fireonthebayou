"use client";

/**
 * ScrollToTop
 * -----------
 * 1. A small round "back to top" button that fades in once you're a screen
 *    and a half down, on every page. Glides up through Lenis.
 * 2. Resets scroll to the top on every route change, so a new page never
 *    opens halfway down (Lenis can otherwise keep the old position).
 * Sits under the mobile menu (z-40) and above page content.
 */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

export default function ScrollToTop() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const lenis = useLenis(({ scroll }) => setShow(scroll > window.innerHeight * 1.5));

  // Fallback for when Lenis is off (reduced motion) or not ready yet.
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.5);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
    // Only on navigation, not when the Lenis instance changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis && !reduce) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    // Move focus back to the top of the page for keyboard users.
    document.querySelector<HTMLElement>("header a, header button")?.focus({ preventScroll: true });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      tabIndex={show ? 0 : -1}
      className={`fixed bottom-5 right-5 z-30 grid h-11 w-11 place-items-center rounded-full border border-border bg-ink/80 text-cream backdrop-blur-md transition-all duration-500 ease-cinematic hover:border-flame hover:text-flame md:bottom-8 md:right-8 md:h-12 md:w-12 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
