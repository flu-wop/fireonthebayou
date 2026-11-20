import { slugify } from "@/lib/slugs";
import { extractYouTubeId } from "@/lib/youtube-validate";
import type { Kind, ProjectData, Taxonomy } from "./types";

/**
 * Form definitions for every editable kind. One generic editor renders any of
 * them, so adding a field is a one-line change here.
 */
export type FieldType = "text" | "textarea" | "number" | "bool" | "lines" | "multi" | "youtube" | "select" | "url" | "image";
export type Field = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  required?: boolean;
  /** For multi: which taxonomy list. For select: fixed options. */
  taxonomy?: "formats" | "industries";
  options?: string[];
  rows?: number;
};

export type KindMeta = {
  label: string;
  plural: string;
  /** Public page that shows this content (for preview links). */
  previewPage: string;
  fields: Field[];
  /** Display title for lists. */
  title: (d: Record<string, unknown>) => string;
  /** Key for a new record. */
  keyFor: (d: Record<string, unknown>) => string;
  /** True when the key (URL slug) can't change after creation. */
  keyLocked?: boolean;
  description?: string;
};

const order: Field = { name: "order", label: "Order", type: "number", help: "Lower numbers come first." };

export const KINDS: Partial<Record<Kind, KindMeta>> = {
  project: {
    label: "Project",
    plural: "Projects",
    previewPage: "/work",
    description: "Every project on the Work page. Industries and formats come from the lists under Taxonomy.",
    title: (d) => String(d.title ?? ""),
    keyFor: (d) => slugify(String(d.title ?? "")),
    keyLocked: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "client", label: "Client", type: "text", required: true },
      { name: "industries", label: "Industries", type: "multi", taxonomy: "industries" },
      { name: "formats", label: "Formats", type: "multi", taxonomy: "formats" },
      { name: "youtubeIds", label: "YouTube video IDs", type: "youtube", help: "One per line. Paste an ID or a full YouTube link. Each is checked before saving. Several IDs make a set of videos." },
      { name: "featured", label: "Featured on Work (max 6)", type: "bool" },
      order,
      { name: "w_category", label: "Screening room: category", type: "select", options: ["", "Commercial", "Brand Film", "Music Video", "Documentary"], help: "Fill any screening-room field to give this project its own page at /work/<slug>." },
      { name: "w_award", label: "Screening room: award line", type: "text" },
      { name: "w_year", label: "Screening room: year", type: "text" },
      { name: "w_blurb", label: "Screening room: one-line description", type: "text" },
      { name: "w_logline", label: "Screening room: logline", type: "textarea", rows: 2, help: "Wrap crimson words in *asterisks*." },
      { name: "w_approachHeading", label: "Screening room: approach heading", type: "text" },
      { name: "w_approachBody", label: "Screening room: approach", type: "textarea", rows: 6, help: "Paragraphs separated by a blank line." },
      { name: "w_references", label: "Screening room: references", type: "lines", help: "One per line." },
      { name: "w_credits", label: "Screening room: credits", type: "lines", help: "One per line as Role | Name." },
      { name: "w_filmLabels", label: "Screening room: video labels", type: "lines", help: "One per line as YouTubeID | Label (shown on the part switcher)." },
    ],
  },
  testimonial: {
    label: "Testimonial",
    plural: "Testimonials",
    previewPage: "/testimonials",
    description: "Nine video slots. The last one is shared: Freeman or Brother Martin.",
    title: (d) => String(d.client ?? ""),
    keyFor: (d) => slugify(String(d.client ?? "")),
    keyLocked: true,
    fields: [
      { name: "client", label: "Client", type: "text", required: true },
      { name: "youtubeId", label: "YouTube video ID", type: "youtube", help: "Paste an ID or a full link. Leave empty until the video exists." },
      { name: "quote", label: "Pull quote (optional)", type: "textarea", rows: 2 },
      order,
    ],
  },
  client: {
    label: "Client",
    plural: "Clients and logos",
    previewPage: "/",
    description: "Feeds the home-page logo banner and the Studio wall. Upload logos under Placeholders (SVG, white on transparent).",
    title: (d) => String(d.name ?? ""),
    keyFor: (d) => slugify(String(d.name ?? "")),
    keyLocked: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "banner", label: "Show in the home-page banner", type: "bool" },
      { name: "wall", label: "Show on the Studio logo wall", type: "bool" },
      order,
    ],
  },
  crew: {
    label: "Crew member",
    plural: "Crew",
    previewPage: "/about",
    title: (d) => String(d.name ?? ""),
    keyFor: (d) => slugify(String(d.name ?? "")),
    keyLocked: true,
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role", type: "text", required: true },
      { name: "note", label: "One-line bio", type: "text" },
      { name: "href", label: "Link (optional)", type: "url" },
      order,
    ],
  },
  service: {
    label: "Service",
    plural: "Services",
    previewPage: "/services",
    title: (d) => String(d.title ?? ""),
    keyFor: (d) => slugify(String(d.title ?? "")),
    keyLocked: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "blurb", label: "Description", type: "textarea", rows: 4, required: true },
      { name: "capabilities", label: "Capabilities", type: "lines", help: "One per line." },
      order,
    ],
  },
  process_step: {
    label: "Process step",
    plural: "Process steps",
    previewPage: "/process",
    title: (d) => String(d.title ?? ""),
    keyFor: (d) => slugify(String(d.title ?? "")),
    keyLocked: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", rows: 4, required: true },
      order,
    ],
  },
  post_step: {
    label: "Post-Production step",
    plural: "Post-Production tab",
    previewPage: "/process",
    description: "The steps on the Post-Production tab of Process. Its heading and intro are under Settings.",
    title: (d) => String(d.title ?? ""),
    keyFor: (d) => slugify(String(d.title ?? "")),
    keyLocked: true,
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea", rows: 4, required: true },
      order,
    ],
  },
  faq: {
    label: "Question",
    plural: "FAQ",
    previewPage: "/process",
    title: (d) => String(d.q ?? ""),
    keyFor: (d) => slugify(String(d.q ?? "")).slice(0, 60),
    keyLocked: true,
    fields: [
      { name: "q", label: "Question", type: "text", required: true },
      { name: "a", label: "Answer", type: "textarea", rows: 4, required: true },
      order,
    ],
  },
};

export const CONTENT_KINDS = Object.keys(KINDS) as Kind[];

/** Settings (Owner only). */
export const SETTINGS_FIELDS: Field[] = [
  { name: "tagline", label: "Tagline (search results and link previews)", type: "text" },
  { name: "description", label: "Site description", type: "textarea", rows: 3 },
  { name: "heroLines", label: "Homepage headline", type: "lines", help: "One line per row; the last line is crimson." },
  { name: "heroSub", label: "Homepage supporting line", type: "text" },
  { name: "heroYoutubeId", label: "Hero reel YouTube ID", type: "youtube", help: "Plays until an MP4 is uploaded under Placeholders." },
  { name: "phone", label: "Phone (as shown)", type: "text" },
  { name: "phoneHref", label: "Phone (dial format, e.g. +15044002555)", type: "text" },
  { name: "email", label: "Public email", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "socials.instagram", label: "Instagram URL", type: "url" },
  { name: "socials.youtube", label: "YouTube URL", type: "url" },
  { name: "socials.facebook", label: "Facebook URL", type: "url" },
  { name: "socials.linkedin", label: "LinkedIn URL", type: "url" },
  { name: "founderName", label: "Founder name", type: "text" },
  { name: "founderRole", label: "Founder role", type: "text" },
  { name: "postHeading", label: "Post-Production tab heading", type: "text" },
  { name: "postIntro", label: "Post-Production tab intro", type: "textarea", rows: 3 },
];

export const SEO_FIELDS: Field[] = [
  { name: "title", label: "Title", type: "text", help: "Leave empty to use the default." },
  { name: "description", label: "Description", type: "textarea", rows: 3 },
  { name: "ogImage", label: "Link-preview image", type: "image", help: "1200×630. Leave empty to use the site-wide image." },
];
export const SEO_PAGES = [
  { path: "/", label: "Home" },
  { path: "/work", label: "Work" },
  { path: "/services", label: "Services" },
  { path: "/process", label: "Process" },
  { path: "/about", label: "Studio" },
  { path: "/testimonials", label: "Testimonials" },
  { path: "/contact", label: "Let's Talk" },
];

// ---- data <-> form conversion ----
const getPath = (o: Record<string, unknown>, path: string): unknown => path.split(".").reduce<unknown>((a, k) => (a && typeof a === "object" ? (a as Record<string, unknown>)[k] : undefined), o);
const setPath = (o: Record<string, unknown>, path: string, v: unknown) => {
  const ks = path.split(".");
  let cur = o;
  ks.slice(0, -1).forEach((k) => (cur = (cur[k] ??= {}) as Record<string, unknown>));
  cur[ks[ks.length - 1]] = v;
};
const splitLines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

/** Flatten a project (with its write-up) to form values. */
export function projectToForm(d: ProjectData): Record<string, unknown> {
  const w = d.writeup;
  return {
    ...d,
    w_category: w?.category ?? "",
    w_award: w?.award ?? "",
    w_year: w?.year ?? "",
    w_blurb: w?.blurb ?? "",
    w_logline: w?.logline ?? "",
    w_approachHeading: w?.approach?.heading ?? "",
    w_approachBody: (w?.approach?.body ?? []).join("\n\n"),
    w_references: w?.approach?.references ?? [],
    w_credits: (w?.credits ?? []).map((c) => `${c.role} | ${c.name}`),
    w_filmLabels: Object.entries(w?.filmLabels ?? {}).map(([id, l]) => `${id} | ${l}`),
  };
}

export type ParseResult = { data: Record<string, unknown>; errors: string[]; youtubeIds: string[] };

/** FormData -> record data (+ validation errors). */
export function parseForm(fields: Field[], fd: FormData, base: Record<string, unknown> = {}): ParseResult {
  const data: Record<string, unknown> = { ...base };
  const errors: string[] = [];
  const youtubeIds: string[] = [];
  for (const f of fields) {
    let v: unknown;
    const raw = fd.get(f.name);
    switch (f.type) {
      case "bool":
        v = fd.get(f.name) === "on";
        break;
      case "number":
        v = raw === null || raw === "" ? 0 : Number(raw);
        if (Number.isNaN(v)) errors.push(`${f.label} must be a number.`);
        break;
      case "multi":
        v = fd.getAll(f.name).map(String);
        break;
      case "lines":
        v = splitLines(String(raw ?? ""));
        break;
      case "youtube": {
        const lines = splitLines(String(raw ?? ""));
        const ids: string[] = [];
        for (const l of lines) {
          const id = extractYouTubeId(l);
          if (!id) errors.push(`"${l}" isn't a YouTube ID or link.`);
          else if (!ids.includes(id)) ids.push(id);
        }
        youtubeIds.push(...ids);
        // single-ID fields (testimonial, hero reel) store a string; project stores an array
        v = f.name === "youtubeIds" ? ids : ids[0] ?? (f.name === "heroYoutubeId" ? "" : null);
        break;
      }
      default:
        v = String(raw ?? "").trim();
    }
    if (f.required && (v === "" || v == null)) errors.push(`${f.label} is required.`);
    setPath(data, f.name, v);
  }
  return { data, errors, youtubeIds: [...new Set(youtubeIds)] };
}

/** Rebuild a project's nested write-up from the flattened w_* fields. */
export function projectFromForm(flat: Record<string, unknown>, key: string): ProjectData {
  const s = (k: string) => String(flat[k] ?? "").trim();
  const lines = (k: string) => (Array.isArray(flat[k]) ? (flat[k] as string[]) : []);
  const credits = lines("w_credits").map((l) => { const [role, ...rest] = l.split("|"); return { role: role.trim(), name: rest.join("|").trim() }; }).filter((c) => c.role && c.name);
  const labels = Object.fromEntries(lines("w_filmLabels").map((l) => { const [id, ...rest] = l.split("|"); return [id.trim(), rest.join("|").trim()]; }).filter(([id, l]) => id && l));
  const body = s("w_approachBody").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const hasWriteup = ["w_category", "w_award", "w_year", "w_blurb", "w_logline", "w_approachHeading"].some((k) => s(k)) || body.length > 0 || credits.length > 0;
  return {
    slug: key,
    title: s("title"),
    client: s("client"),
    industries: (flat.industries as string[]) ?? [],
    formats: (flat.formats as string[]) ?? [],
    youtubeIds: (flat.youtubeIds as string[]) ?? [],
    featured: Boolean(flat.featured),
    order: Number(flat.order) || 0,
    writeup: hasWriteup
      ? {
          category: (s("w_category") || "Commercial") as NonNullable<ProjectData["writeup"]>["category"],
          award: s("w_award") || undefined,
          year: s("w_year") || undefined,
          blurb: s("w_blurb") || undefined,
          logline: s("w_logline") || undefined,
          approach: s("w_approachHeading") || body.length ? { heading: s("w_approachHeading"), body, references: lines("w_references").length ? lines("w_references") : undefined } : undefined,
          credits: credits.length ? credits : undefined,
          filmLabels: Object.keys(labels).length ? labels : undefined,
        }
      : undefined,
  };
}

export function formValues(fields: Field[], data: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) out[f.name] = getPath(data, f.name);
  return out;
}

export const taxonomyToText = (t: Taxonomy["formats"]) => t.map((x) => `${x.key} | ${x.label}`).join("\n");
export function parseTaxonomy(text: string): { items: Taxonomy["formats"]; errors: string[] } {
  const errors: string[] = [];
  const items = splitLines(text).map((l) => {
    const [k, ...rest] = l.split("|");
    const label = rest.join("|").trim() || k.trim();
    const key = slugify(rest.length ? k : label);
    if (!key) errors.push(`"${l}" has no usable key.`);
    return { key, label };
  });
  const dupes = items.map((i) => i.key).filter((k, i, a) => a.indexOf(k) !== i);
  if (dupes.length) errors.push(`Duplicate key: ${dupes[0]}.`);
  return { items, errors };
}
