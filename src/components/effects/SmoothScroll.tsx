"use client";

/**
 * SmoothScroll
 * ------------
 * Wraps the whole app in Lenis inertial smooth-scrolling. This is the single
 * biggest contributor to the "how is this so fluid" feeling — scroll gets a
 * weighted, glide-to-a-stop quality instead of the OS default jump.
 *
 * It also drives every scroll-linked parallax in the site: Lenis updates on
 * each animation frame, and Framer Motion's useScroll reads from it.
 *
 * Respects prefers-reduced-motion by simply not initializing.
 */
import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  // Reduced motion: no Lenis at all, so scrolling stays native.
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(q.matches);
    on();
    q.addEventListener("change", on);
    return () => q.removeEventListener("change", on);
  }, []);
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis
      root
      options={{
        // lerp = how "heavy" the glide feels. Lower = more inertia.
        lerp: 0.09,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
      }}
    >
      {children}
    </ReactLenis>
  );
}
