"use client";

import { type Filters, counts } from "@/lib/catalog";
import type { Taxonomy } from "@/lib/content/types";
import { cn } from "@/lib/utils";

type Counts = ReturnType<typeof counts>;

function Chip({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] tracking-wide transition-colors duration-300",
        active ? "border-flame bg-ember text-cream" : "border-border text-mist hover:border-cream/50 hover:text-cream"
      )}
    >
      {label}
      <span className={cn("text-[11px] tabular-nums", active ? "text-cream/80" : "text-ash")}>{count}</span>
    </button>
  );
}

/**
 * Sticky filter bar: Format segmented control + Industry chips, each with
 * counts and defaulting to All. On mobile each row scrolls sideways.
 */
export default function FilterBar({
  filters,
  counts: c,
  taxonomy,
  onChange,
}: {
  filters: Filters;
  counts: Counts;
  taxonomy: Taxonomy;
  onChange: (next: Filters) => void;
}) {
  return (
    <div className="sticky top-14 z-30 -mx-5 border-y border-border/70 bg-ink/85 px-5 py-3 backdrop-blur-xl md:top-20 md:mx-0 md:px-0">
      <div className="space-y-2.5">
        <div className="flex items-center gap-3">
          <p className="w-16 shrink-0 text-[11px] uppercase tracking-wider text-ash">Format</p>
          <div role="group" aria-label="Filter by format" className="no-scrollbar flex gap-2 overflow-x-auto">
            <Chip active={!filters.format} onClick={() => onChange({ ...filters, format: null })} label="All" count={c.total} />
            {taxonomy.formats.map((f) => (
              <Chip key={f.key} active={filters.format === f.key} onClick={() => onChange({ ...filters, format: f.key })} label={f.label} count={c.format[f.key]} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p className="w-16 shrink-0 text-[11px] uppercase tracking-wider text-ash">Industry</p>
          <div role="group" aria-label="Filter by industry" className="no-scrollbar flex gap-2 overflow-x-auto">
            <Chip active={!filters.industry} onClick={() => onChange({ ...filters, industry: null })} label="All" count={c.total} />
            {taxonomy.industries.map((i) => (
              <Chip key={i.key} active={filters.industry === i.key} onClick={() => onChange({ ...filters, industry: i.key })} label={i.label} count={c.industry[i.key]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
