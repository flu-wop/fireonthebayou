"use client";

/**
 * PageHeader — the tall, cinematic intro band atop each sub-page.
 * Eyebrow + huge display title + optional lede, on a subtle ember-tinted void.
 */
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: string;
}) {
  return (
    <header className="relative overflow-hidden pt-44 pb-20 md:pt-52 md:pb-28">
      {/* faint ember bloom behind the title */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-1/2 h-[420px] w-[820px] -translate-x-1/2 opacity-60"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(226,69,42,0.16) 0%, transparent 70%)",
        }}
      />
      <div className="frame relative">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-6 flex items-center gap-3"
        >
          <span className="inline-block h-px w-10 bg-flame/70" />
          {eyebrow}
        </motion.p>
        <h1 className="max-w-5xl font-display text-[clamp(3rem,9vw,8rem)] font-light leading-[0.9] tracking-tight text-cream">
          {title}
        </h1>
        {lede && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 max-w-2xl text-lg leading-relaxed text-mist"
          >
            {lede}
          </motion.p>
        )}
      </div>
    </header>
  );
}
