/**
 * LegalBody — shared layout for the privacy and terms pages.
 * Readable measure, hairline section rules, site typography.
 */
import type { ReactNode } from "react";

export function LegalBody({ updated, children }: { updated: string; children: ReactNode }) {
  return (
    <section className="frame pb-28">
      <div className="max-w-3xl border-t border-border pt-10">
        <p className="font-mono text-[13px] tracking-wide text-ash">Last updated {updated}</p>
        <div className="mt-8 space-y-12">{children}</div>
      </div>
    </section>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-none text-cream">{title}</h2>
      <div className="mt-5 space-y-4 text-base leading-relaxed text-mist [&_a]:text-cream [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-flame [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}
