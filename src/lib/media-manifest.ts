import fs from "node:fs";
import path from "node:path";
import catalogJson from "../../data/fotb-catalog.json";
import { projectSlug } from "@/lib/catalog-meta";
import { crew } from "@/lib/crew";
import { services } from "@/lib/services";
import { slugify } from "@/lib/slugs";
import { testimonials } from "@/lib/testimonials";

/**
 * Media manifest — every image / video slot on the site, with the exact size
 * and the place to put the file. MediaSlot reads it to label placeholders and
 * /placeholders (later: Admin > Placeholders) reports from it.
 *
 * A slot is "filled" when its file exists under /public (or its YouTube ID is
 * set), "fallback" when something acceptable stands in (a project poster that
 * falls back to the YouTube thumbnail), and "empty" otherwise.
 */
type CatalogRow = { title: string; client: string; youtubeIds: string[] };
const catalog = catalogJson as CatalogRow[];

export type SlotStatus = "filled" | "fallback" | "empty";
export type Slot = {
  id: string;
  group: string;
  label: string;
  size: string;
  format: string;
  /** Where the file goes (public path) or the field that holds the ID. */
  where: string;
  status: SlotStatus;
};

export const GROUP_ORDER = [
  "Hero reel",
  "Hero poster",
  "Link-preview image",
  "Client logos",
  "Project posters",
  "Project videos",
  "Testimonial videos",
  "Testimonial posters",
  "Crew portraits",
  "Photography",
  "Service stills",
  "Post-Production stills",
] as const;

export function publicFileExists(publicPath: string): boolean {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", publicPath.replace(/^\//, "")));
  } catch {
    return false;
  }
}

export function directoryHasFiles(publicDir: string): boolean {
  try {
    return fs.readdirSync(path.join(process.cwd(), "public", publicDir.replace(/^\//, ""))).some((f) => !f.startsWith("."));
  } catch {
    return false;
  }
}

export const clientLogoPath = (client: string) => `/images/clients/${slugify(client)}.svg`;
export const projectPosterPath = (title: string) => `/images/work-${projectSlug(title)}.jpg`;
export const crewPortraitPath = (slug: string) => `/images/crew/${slug}.jpg`;
export const testimonialPosterPath = (slug: string) => `/images/testimonials/${slug}.jpg`;
export const servicePhotoPath = (title: string) => `/images/services/${slugify(title)}.jpg`;
export const postStillPath = (n: number) => `/images/process/post-production-${n}.jpg`;

/** Distinct client names in the catalog, alphabetical — the logo list. */
export function catalogClients(): string[] {
  return [...new Set(catalog.map((p) => p.client.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

export function buildManifest(): Slot[] {
  const slots: Slot[] = [];
  const add = (s: Omit<Slot, "status"> & { status: SlotStatus }) => slots.push(s);
  const fileStatus = (p: string): SlotStatus => (publicFileExists(p) ? "filled" : "empty");

  add({ id: "hero-reel", group: "Hero reel", label: "Hero reel", size: "1920×1080", format: "MP4, H.264, muted loop, 15 MB or less", where: "/public/video/hero-reel.mp4", status: fileStatus("/video/hero-reel.mp4") });
  add({ id: "hero-poster", group: "Hero poster", label: "Hero poster", size: "1920×1080", format: "JPG", where: "/public/images/hero-poster.jpg", status: fileStatus("/images/hero-poster.jpg") });
  add({ id: "og-image", group: "Link-preview image", label: "Link-preview image", size: "1200×630", format: "JPG", where: "/public/images/og-image.jpg", status: fileStatus("/images/og-image.jpg") });

  for (const client of catalogClients()) {
    const p = clientLogoPath(client);
    add({ id: `logo-${slugify(client)}`, group: "Client logos", label: client, size: "SVG, any width, ~96 px tall", format: "SVG, white on transparent", where: `/public${p}`, status: fileStatus(p) });
  }

  for (const row of catalog) {
    const slug = projectSlug(row.title);
    const poster = projectPosterPath(row.title);
    const hasId = row.youtubeIds.length > 0;
    add({
      id: `poster-${slug}`,
      group: "Project posters",
      label: row.title,
      size: "1280×720",
      format: "JPG (falls back to the YouTube thumbnail)",
      where: `/public${poster}`,
      status: publicFileExists(poster) ? "filled" : hasId ? "fallback" : "empty",
    });
    add({
      id: `video-${slug}`,
      group: "Project videos",
      label: row.title,
      size: "YouTube video",
      format: "YouTube ID",
      where: "Project > YouTube ID(s)",
      status: hasId ? "filled" : "empty",
    });
  }

  for (const t of testimonials) {
    add({ id: `tvideo-${t.slug}`, group: "Testimonial videos", label: t.client, size: "YouTube video", format: "YouTube ID", where: "src/lib/testimonials.ts > youtubeId", status: t.youtubeId ? "filled" : "empty" });
    const p = testimonialPosterPath(t.slug);
    add({ id: `tposter-${t.slug}`, group: "Testimonial posters", label: t.client, size: "1280×720", format: "JPG", where: `/public${p}`, status: fileStatus(p) });
  }

  for (const c of crew) {
    const p = crewPortraitPath(c.slug);
    add({ id: `crew-${c.slug}`, group: "Crew portraits", label: c.name, size: "1000×1250 (4:5)", format: "JPG", where: `/public${p}`, status: fileStatus(p) });
  }

  add({ id: "photography", group: "Photography", label: "Photography set (from David)", size: "2000 px on the long edge, any aspect", format: "JPG or WebP", where: "/public/images/photography/", status: directoryHasFiles("/images/photography") ? "filled" : "empty" });

  for (const s of services) {
    const p = servicePhotoPath(s.title);
    add({ id: `service-${slugify(s.title)}`, group: "Service stills", label: s.title, size: "1600×1067 (3:2)", format: "JPG", where: `/public${p}`, status: fileStatus(p) });
  }
  for (let n = 1; n <= 4; n++) {
    const p = postStillPath(n);
    add({ id: `post-${n}`, group: "Post-Production stills", label: `Post-Production still ${n}`, size: "1600×1067 (3:2)", format: "JPG", where: `/public${p}`, status: fileStatus(p) });
  }
  return slots;
}

export function summarize(slots: Slot[]) {
  const total = slots.length;
  const empty = slots.filter((s) => s.status === "empty").length;
  const fallback = slots.filter((s) => s.status === "fallback").length;
  return { total, empty, fallback, filled: total - empty - fallback };
}
