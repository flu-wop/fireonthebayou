"use client";

/**
 * Marquee
 * -------
 * An infinite, slow horizontal scroll of phrases separated by ember dots. Pure
 * CSS-free / Framer loop. Adds motion + editorial rhythm between sections.
 */
import { motion } from "framer-motion";

export default function Marquee({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  const row = [...items, ...items]; // duplicate for seamless loop
  return (
    <div className={`relative overflow-hidden border-y border-border py-6 ${className}`}>
      <motion.div
        className="flex w-max items-center gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-display text-2xl font-light tracking-tight text-mist md:text-3xl">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
