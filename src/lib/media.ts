import { cache } from "react";
import publicFiles from "@/generated/public-files.json";
import { getDB } from "@/lib/db";
import { ensureTables } from "@/lib/content/schema";

/**
 * Media resolution. A slot is identified by its /public path (e.g.
 * "/images/work-rouses.jpg"). It resolves to an uploaded file (Vercel Blob URL,
 * from fotb_media) if one was assigned in admin, otherwise to the file in
 * /public, otherwise null (the caller shows a labeled placeholder).
 * /public is checked against a list generated at build time, never the
 * filesystem, so this works inside serverless functions.
 */
const PUBLIC = new Set<string>(publicFiles as string[]);

export const publicHas = (p: string) => PUBLIC.has(p);
export const publicDirHas = (dir: string) => {
  const d = dir.endsWith("/") ? dir : `${dir}/`;
  for (const f of PUBLIC) if (f.startsWith(d)) return true;
  return false;
};

export type MediaMap = Record<string, string>;

export const getMediaOverrides = cache(async (): Promise<MediaMap> => {
  const db = getDB();
  if (!db) return {};
  try {
    await ensureTables();
    const r = await db.execute("SELECT slot, url FROM fotb_media WHERE slot IS NOT NULL AND active = 1 ORDER BY id");
    const map: MediaMap = {};
    for (const row of r.rows) map[String(row.slot)] = String(row.url);
    return map;
  } catch (e) {
    console.error("[media] overrides unavailable", e instanceof Error ? e.message : e);
    return {};
  }
});

export function resolveWith(map: MediaMap, path: string): string | null {
  return map[path] ?? (PUBLIC.has(path) ? path : null);
}

export async function resolveMedia(path: string): Promise<string | null> {
  return resolveWith(await getMediaOverrides(), path);
}

export const dirHasMedia = (map: MediaMap, dir: string) =>
  publicDirHas(dir) || Object.keys(map).some((k) => k.startsWith(dir.endsWith("/") ? dir : `${dir}/`));

/** Slot paths (all under /public). */
export const clientLogoPath = (slug: string) => `/images/clients/${slug}.svg`;
export const projectPosterPath = (slug: string) => `/images/work-${slug}.jpg`;
export const projectPreviewPath = (slug: string) => `/video/work-${slug}.mp4`;
export const crewPortraitPath = (slug: string) => `/images/crew/${slug}.jpg`;
export const testimonialPosterPath = (slug: string) => `/images/testimonials/${slug}.jpg`;
export const servicePhotoPath = (slug: string) => `/images/services/${slug}.jpg`;
export const postStillPath = (n: number) => `/images/process/post-production-${n}.jpg`;
export const HERO_REEL_PATH = "/video/hero-reel.mp4";
export const HERO_POSTER_PATH = "/images/hero-poster.jpg";
export const OG_IMAGE_PATH = "/images/og-image.jpg";
export const FOUNDER_PHOTO_PATH = "/images/jason-villemarette.jpg";
