"use client";

/**
 * Button — shared ecosystem button, fire-tuned.
 * Variants: "ember" (hot fill), "outline" (hairline), "ghost" (text only).
 * Renders as <Link> when `href` is passed, otherwise a <button>.
 */
import Link from "next/link";
import { cn } from "@/lib/utils";
import Magnetic from "@/components/effects/Magnetic";
import type { ReactNode } from "react";

type Variant = "ember" | "outline" | "ghost";

const base =
  "group inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-mono text-[12px] uppercase tracking-widest transition-all duration-500 ease-cinematic";

const variants: Record<Variant, string> = {
  ember:
    "bg-ember text-cream hover:bg-flame ember-bloom hover:shadow-[0_0_60px_-10px_rgba(255,122,60,0.7)]",
  outline:
    "border border-border text-cream hover:border-flame hover:text-flame",
  ghost: "text-mist hover:text-flame",
};

export default function Button({
  children,
  href,
  variant = "ember",
  className,
  magnetic = true,
  onClick,
  type,
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  magnetic?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const content = (
    <span className="flex items-center gap-3">
      {children}
      <span className="inline-block transition-transform duration-500 ease-cinematic group-hover:translate-x-1">
        →
      </span>
    </span>
  );

  const inner = href ? (
    <Link href={href} className={cn(base, variants[variant], className)}>
      {content}
    </Link>
  ) : (
    <button
      type={type ?? "button"}
      onClick={onClick}
      className={cn(base, variants[variant], className)}
    >
      {content}
    </button>
  );

  return magnetic ? <Magnetic strength={0.25}>{inner}</Magnetic> : inner;
}
