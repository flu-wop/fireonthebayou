import type { Taxon, Taxonomy } from "@/lib/content/types";

/**
 * Pure helpers for the portfolio catalog (safe in client components). The
 * records themselves come from src/lib/content (database, falling back to
 * data/fotb-catalog.json); formats and industries are editable, so every
 * helper takes the taxonomy instead of importing constants.
 */
export type CatalogProject = {
  slug: string;
  title: string;
  client: string;
  industries: string[];
  formats: string[];
  youtubeIds: string[];
  /** Has a screening-room write-up at /work/<slug>. */
  writeup: boolean;
  featured: boolean;
};

export type Filters = { format: string | null; industry: string | null };

export function parseFilters(p: { get(name: string): string | null }, tax: Taxonomy): Filters {
  const f = p.get("format");
  const i = p.get("industry");
  return {
    format: tax.formats.some((x) => x.key === f) ? f : null,
    industry: tax.industries.some((x) => x.key === i) ? i : null,
  };
}

export function filterCatalog<T extends CatalogProject>(items: T[], f: Filters): T[] {
  return items.filter((p) => (!f.format || p.formats.includes(f.format)) && (!f.industry || p.industries.includes(f.industry)));
}

export function counts(items: CatalogProject[], tax: Taxonomy) {
  const tally = (list: Taxon[], field: "formats" | "industries") =>
    Object.fromEntries(list.map((t) => [t.key, items.filter((p) => p[field].includes(t.key)).length])) as Record<string, number>;
  return {
    total: items.length,
    format: tally(tax.formats, "formats"),
    industry: tally(tax.industries, "industries"),
    noFormat: items.filter((p) => p.formats.length === 0).length,
    noVideo: items.filter((p) => p.youtubeIds.length === 0).length,
  };
}

export const labelFor = (list: Taxon[], key: string) => list.find((t) => t.key === key)?.label ?? key;
export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
