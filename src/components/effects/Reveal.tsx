"use client";

/**
 * Reveal
 * ------
 * Scroll-TRIGGERED reveal. Children fade + rise into place the first time they
 * enter the viewport. Use for headings, paragraphs, rows — the staggered
 * choreography of a page load / scroll-down.
 *
 * Props:
 *  - delay:  stagger offset in seconds
 *  - y:      starting vertical offset in px
 *  - as:     element tag (defaults to div)
 */
import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Reveal({
  children,
  delay = 0,
  y,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={
        y !== undefined
          ? {
              hidden: { opacity: 0, y, filter: "blur(6px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
              },
            }
          : variants
      }
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
