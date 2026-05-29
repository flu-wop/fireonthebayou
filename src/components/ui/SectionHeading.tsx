"use client";

/**
 * SectionHeading
 * --------------
 * The recurring "eyebrow + giant display headline" unit used to open most
 * sections. Keeps typographic rhythm consistent site-wide.
 */
import Reveal from "@/components/effects/Reveal";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export default function SectionHeading({
  eyebrow,
  title,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow mb-5 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-flame/60" />
            {eyebrow}
          </p>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-light leading-[0.95] tracking-tight text-cream">
          {title}
        </h2>
      </Reveal>
    </div>
  );
}
