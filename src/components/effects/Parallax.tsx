"use client";

/**
 * Parallax
 * --------
 * Scroll-LINKED parallax (continuously tied to scroll position, not a one-shot
 * trigger). As the element travels through the viewport, its children translate
 * on Y at a different rate than the page — creating real depth.
 *
 *  - speed > 0  : moves slower than scroll (recedes, "further away")
 *  - speed < 0  : moves faster than scroll (advances, "closer")
 *
 * Powered by Lenis under the hood via Framer Motion's useScroll.
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

export default function Parallax({
  children,
  speed = 0.3,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Track this element's progress from entering to leaving the viewport.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map 0->1 progress to a vertical drift. 200 * speed = total travel in px.
  const y = useTransform(scrollYProgress, [0, 1], [200 * speed, -200 * speed]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
