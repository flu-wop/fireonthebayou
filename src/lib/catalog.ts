import catalogJson from "../../data/fotb-catalog.json";
import { projectSlug } from "@/lib/catalog-meta";
import { getProject as getWriteup, type Project as Writeup } from "@/lib/projects";

/**
 * The portfolio catalog — one record per project, built from
 * data/fotb-catalog.json (Izzie's lists; the source of truth). Pure data, no
 * filesystem, so it is safe in client components. Phase 4 moves the same
 * shape into the database; this file stays as the fallback seed reader.
 */
type Row = { title: string; client: string; industries: string[]; formats: string[]; youtubeIds: string[]; note: string };

export const FORMATS = [
  { key: "tv", label: "TV Commercial" },
  { key: "social", label: "Social Content" },
  { key: "long", label: "Long Format" },
] as const;

export const INDUSTRIES = [
  { key: "food", label: "Food & Beverage" },
  { key: "medical", label: "Medical" },
  { key: "general", label: "General" },
  { key: "education", label: "Education" },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "tourism", label: "Tourism" },
  { key: "environmental", label: "Environmental" },
  { key: "hospitality", label: "Hospitality" },
] as const;

export type FormatKey = (typeof FORMATS)[number]["key"];
export type IndustryKey = (typeof INDUSTRIES)[number]["key"];

const formatByLabel = Object.fromEntries(FORMATS.map((f) => [f.label, f.key])) as Record<string, FormatKey>;
const industryByLabel = Object.fromEntries(INDUSTRIES.map((i) => [i.label, i.key])) as Record<string, IndustryKey>;

export type CatalogProject = {
  slug: string;
  title: string;
  client: string;
  industries: IndustryKey[];
  formats: FormatKey[];
  youtubeIds: string[];
  /** Has a screening-room write-up at /work/<slug>. */
  writeup: boolean;
};

export const catalog: CatalogProject[] = (catalogJson as Row[]).map((r) => {
  const slug = projectSlug(r.title);
  return {
    slug,
    title: r.title,
    client: r.client,
    industries: r.industries.map((l) => industryByLabel[l]).filter(Boolean),
    formats: r.formats.map((l) => formatByLabel[l]).filter(Boolean),
    youtubeIds: r.youtubeIds,
    writeup: Boolean(getWriteup(slug)),
  };
});

/** The six projects shown above the grid. Default pick; editable in admin (phase 4). */
export const FEATURED_SLUGS = ["aucoin-hart", "rouses", "sazerac-house", "acme-oyster-house", "audubon", "blue-runner"];

export const formatLabel = (k: FormatKey) => FORMATS.find((f) => f.key === k)!.label;
export const industryLabel = (k: IndustryKey) => INDUSTRIES.find((i) => i.key === k)!.label;

export type Filters = { format: FormatKey | null; industry: IndustryKey | null };

export function parseFilters(p: { get(name: string): string | null }): Filters {
  const f = p.get("format");
  const i = p.get("industry");
  return {
    format: FORMATS.some((x) => x.key === f) ? (f as FormatKey) : null,
    industry: INDUSTRIES.some((x) => x.key === i) ? (i as IndustryKey) : null,
  };
}

export function filterCatalog(items: CatalogProject[], f: Filters): CatalogProject[] {
  return items.filter((p) => (!f.format || p.formats.includes(f.format)) && (!f.industry || p.industries.includes(f.industry)));
}

export function counts(items: CatalogProject[] = catalog) {
  return {
    total: items.length,
    format: Object.fromEntries(FORMATS.map((f) => [f.key, items.filter((p) => p.formats.includes(f.key)).length])) as Record<FormatKey, number>,
    industry: Object.fromEntries(INDUSTRIES.map((i) => [i.key, items.filter((p) => p.industries.includes(i.key)).length])) as Record<IndustryKey, number>,
    noFormat: items.filter((p) => p.formats.length === 0).length,
    noVideo: items.filter((p) => p.youtubeIds.length === 0).length,
  };
}

export const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export function getCatalogProject(slug: string) {
  return catalog.find((p) => p.slug === slug);
}

export type { Writeup };
