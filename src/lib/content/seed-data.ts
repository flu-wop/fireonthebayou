import catalogJson from "../../../data/fotb-catalog.json";
import { projectSlug } from "@/lib/catalog-meta";
import { crew } from "@/lib/crew";
import { faq } from "@/lib/faq";
import { postProduction, processSteps } from "@/lib/process";
import { projects as writeups } from "@/lib/projects";
import { services } from "@/lib/services";
import { site } from "@/lib/site";
import { slugify } from "@/lib/slugs";
import { testimonials } from "@/lib/testimonials";
import type { Kind, ProjectData, SiteSettings, Taxonomy, Writeup } from "./types";

/**
 * The seed: what the site shows before the database is populated, and what
 * `npm run seed` / the admin "Seed from files" button loads into Turso.
 * Sources: data/fotb-catalog.json (projects) plus the existing lib/*.ts files.
 */
type Row = { title: string; client: string; industries: string[]; formats: string[]; youtubeIds: string[] };
export type SeedRecord = { kind: Kind; key: string; data: unknown };

export const DEFAULT_TAXONOMY: Taxonomy = {
  formats: [
    { key: "tv", label: "TV Commercial" },
    { key: "social", label: "Social Content" },
    { key: "long", label: "Long Format" },
  ],
  industries: [
    { key: "food", label: "Food & Beverage" },
    { key: "medical", label: "Medical" },
    { key: "general", label: "General" },
    { key: "education", label: "Education" },
    { key: "lifestyle", label: "Lifestyle" },
    { key: "tourism", label: "Tourism" },
    { key: "environmental", label: "Environmental" },
    { key: "hospitality", label: "Hospitality" },
  ],
};

/** The six projects shown above the grid by default. */
const FEATURED = ["aucoin-hart", "rouses", "sazerac-house", "acme-oyster-house", "audubon", "blue-runner"];

export const DEFAULT_SETTINGS: SiteSettings = {
  tagline: site.tagline,
  description: site.description,
  heroLines: [...site.heroLines],
  heroSub: site.heroSub,
  heroYoutubeId: "6Kcbz2qkj8g",
  phone: site.phone,
  phoneHref: site.phoneHref,
  email: site.email,
  address: site.address,
  socials: { ...site.socials },
  founderName: site.founder.name,
  founderRole: site.founder.role,
  postHeading: postProduction.heading,
  postIntro: postProduction.intro,
};

function writeupFor(slug: string): Writeup | undefined {
  const p = writeups.find((w) => w.slug === slug);
  if (!p) return undefined;
  return {
    category: p.category,
    year: p.year,
    award: p.award,
    blurb: p.blurb,
    logline: p.logline,
    approach: p.approach,
    credits: p.credits,
    filmLabels: Object.fromEntries((p.films ?? []).map((f) => [f.youtubeId, f.label])),
  };
}

export function seedRecords(): SeedRecord[] {
  const out: SeedRecord[] = [];
  const rows = catalogJson as Row[];
  const key = (label: string, list: { key: string; label: string }[]) => list.find((t) => t.label === label)?.key;

  rows.forEach((r, i) => {
    const slug = projectSlug(r.title);
    const data: ProjectData = {
      slug,
      title: r.title,
      client: r.client,
      industries: r.industries.map((l) => key(l, DEFAULT_TAXONOMY.industries)).filter(Boolean) as string[],
      formats: r.formats.map((l) => key(l, DEFAULT_TAXONOMY.formats)).filter(Boolean) as string[],
      youtubeIds: r.youtubeIds,
      featured: FEATURED.includes(slug),
      order: i + 1,
      writeup: writeupFor(slug),
    };
    out.push({ kind: "project", key: slug, data });
  });

  const clients = [...new Set(rows.map((r) => r.client.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  clients.forEach((name, i) => out.push({ kind: "client", key: slugify(name), data: { name, banner: true, wall: true, order: i + 1 } }));

  testimonials.forEach((t, i) => out.push({ kind: "testimonial", key: t.slug, data: { client: t.client, youtubeId: t.youtubeId, quote: t.quote, order: i + 1 } }));
  crew.forEach((c, i) => out.push({ kind: "crew", key: c.slug, data: { name: c.name, role: c.role, note: c.note, href: c.href, order: i + 1 } }));
  services.forEach((s, i) => out.push({ kind: "service", key: slugify(s.title), data: { title: s.title, blurb: s.blurb, capabilities: s.capabilities, order: i + 1 } }));
  processSteps.forEach((s, i) => out.push({ kind: "process_step", key: slugify(s.title), data: { title: s.title, description: s.description, order: i + 1 } }));
  postProduction.steps.forEach((s, i) => out.push({ kind: "post_step", key: slugify(s.title), data: { title: s.title, description: s.description, order: i + 1 } }));
  faq.forEach((f, i) => out.push({ kind: "faq", key: slugify(f.q).slice(0, 60), data: { q: f.q, a: f.a, order: i + 1 } }));
  out.push({ kind: "setting", key: "site", data: DEFAULT_SETTINGS });
  out.push({ kind: "setting", key: "taxonomy", data: DEFAULT_TAXONOMY });
  return out;
}
