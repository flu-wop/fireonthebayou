import { getClients, getCrew, getProjects, getServices, getTestimonials } from "@/lib/content";
import { HERO_POSTER_PATH, HERO_REEL_PATH, OG_IMAGE_PATH, FOUNDER_PHOTO_PATH, clientLogoPath, crewPortraitPath, dirHasMedia, getMediaOverrides, postStillPath, projectPosterPath, resolveWith, servicePhotoPath, testimonialPosterPath, type MediaMap } from "@/lib/media";


/**
 * Media manifest — every image / video slot on the site, with the exact size
 * and the place to put the file. /placeholders and Admin > Placeholders report
 * from it, and the admin upload buttons use `upload` for the target size.
 *
 * "filled": a file (uploaded in admin, or in /public) or a YouTube ID is set.
 * "fallback": something acceptable stands in (a project poster that falls back
 * to the YouTube thumbnail). "empty": a labeled placeholder is showing.
 */
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
  /** How an admin upload button should treat this slot. */
  upload?: { path: string; kind: "image" | "svg" | "video"; width?: number; height?: number };
  /** For YouTube-ID slots: where to edit it in admin. */
  editHref?: string;
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
  "Founder portrait",
  "Photography",
  "Service stills",
  "Post-Production stills",
] as const;

export async function buildManifest(): Promise<Slot[]> {
  const map: MediaMap = await getMediaOverrides();
  const [projects, clients, testimonials, crew, services] = await Promise.all([getProjects(), getClients(), getTestimonials(), getCrew(), getServices()]);
  const slots: Slot[] = [];
  const has = (p: string) => resolveWith(map, p) !== null;
  const fileSlot = (s: Omit<Slot, "status" | "where"> & { path: string }): Slot => ({ ...s, where: `/public${s.path}`, status: has(s.path) ? "filled" : "empty" });
  const img = (path: string, w: number, h: number) => ({ path, kind: "image" as const, width: w, height: h });

  slots.push(fileSlot({ id: "hero-reel", group: "Hero reel", label: "Hero reel", size: "1920×1080", format: "MP4, H.264, muted loop, 15 MB or less (the YouTube reel plays until it arrives)", path: HERO_REEL_PATH, upload: { path: HERO_REEL_PATH, kind: "video" } }));
  slots.push(fileSlot({ id: "hero-poster", group: "Hero poster", label: "Hero poster", size: "1920×1080", format: "JPG", path: HERO_POSTER_PATH, upload: img(HERO_POSTER_PATH, 1920, 1080) }));
  slots.push(fileSlot({ id: "og-image", group: "Link-preview image", label: "Link-preview image", size: "1200×630", format: "JPG", path: OG_IMAGE_PATH, upload: img(OG_IMAGE_PATH, 1200, 630) }));

  for (const c of clients) {
    const p = clientLogoPath(c.key);
    slots.push(fileSlot({ id: `logo-${c.key}`, group: "Client logos", label: c.data.name, size: "SVG, ~96 px tall", format: "SVG, white on transparent", path: p, upload: { path: p, kind: "svg" } }));
  }

  for (const r of projects) {
    const d = r.data;
    const poster = projectPosterPath(d.slug);
    const hasId = d.youtubeIds.length > 0;
    slots.push({
      id: `poster-${d.slug}`, group: "Project posters", label: d.title, size: "1280×720", format: "JPG (falls back to the YouTube thumbnail)",
      where: `/public${poster}`, status: has(poster) ? "filled" : hasId ? "fallback" : "empty", upload: img(poster, 1280, 720),
    });
    slots.push({
      id: `video-${d.slug}`, group: "Project videos", label: d.title, size: "YouTube video", format: "YouTube ID",
      where: "Project > YouTube ID(s)", status: hasId ? "filled" : "empty", editHref: `/admin/content/project/${encodeURIComponent(d.slug)}`,
    });
  }

  for (const t of testimonials) {
    slots.push({ id: `tvideo-${t.key}`, group: "Testimonial videos", label: t.data.client, size: "YouTube video", format: "YouTube ID", where: "Testimonial > YouTube ID", status: t.data.youtubeId ? "filled" : "empty", editHref: `/admin/content/testimonial/${encodeURIComponent(t.key)}` });
    const p = testimonialPosterPath(t.key);
    slots.push(fileSlot({ id: `tposter-${t.key}`, group: "Testimonial posters", label: t.data.client, size: "1280×720", format: "JPG", path: p, upload: img(p, 1280, 720) }));
  }

  for (const c of crew) {
    const p = crewPortraitPath(c.key);
    slots.push(fileSlot({ id: `crew-${c.key}`, group: "Crew portraits", label: c.data.name, size: "1000×1250 (4:5)", format: "JPG", path: p, upload: img(p, 1000, 1250) }));
  }
  slots.push(fileSlot({ id: "founder", group: "Founder portrait", label: "Founder portrait (Studio page)", size: "1000×1250 (4:5)", format: "JPG", path: FOUNDER_PHOTO_PATH, upload: img(FOUNDER_PHOTO_PATH, 1000, 1250) }));

  slots.push({
    id: "photography", group: "Photography", label: "Photography set (from David)", size: "2000 px on the long edge, any aspect", format: "JPG or WebP",
    where: "/public/images/photography/", status: dirHasMedia(map, "/images/photography") ? "filled" : "empty",
    upload: { path: `/images/photography/${Date.now()}.jpg`, kind: "image", width: 2000, height: 2000 },
  });

  for (const s of services) {
    const p = servicePhotoPath(s.key);
    slots.push(fileSlot({ id: `service-${s.key}`, group: "Service stills", label: s.data.title, size: "1600×1067 (3:2)", format: "JPG", path: p, upload: img(p, 1600, 1067) }));
  }
  for (let n = 1; n <= 4; n++) {
    const p = postStillPath(n);
    slots.push(fileSlot({ id: `post-${n}`, group: "Post-Production stills", label: `Post-Production still ${n}`, size: "1600×1067 (3:2)", format: "JPG", path: p, upload: img(p, 1600, 1067) }));
  }
  return slots;
}

export function summarize(slots: Slot[]) {
  const total = slots.length;
  const empty = slots.filter((s) => s.status === "empty").length;
  const fallback = slots.filter((s) => s.status === "fallback").length;
  return { total, empty, fallback, filled: total - empty - fallback };
}


