import { dbConfigured, getDB } from "@/lib/db";
import { ensureTables } from "./schema";
import { DEFAULT_SETTINGS, DEFAULT_TAXONOMY, seedRecords } from "./seed-data";
import type { DataByKind, DraftRec, Kind, PageSeoData, Rec, SiteSettings, Taxonomy } from "./types";

/**
 * Content readers. Pages read from Turso and fall back to the seed files
 * (data/fotb-catalog.json + lib/*.ts) when the database isn't configured, isn't
 * seeded yet, or can't be reached. `draft: true` (preview pages) overlays
 * unpublished edits.
 */
type Opts = { draft?: boolean };

const num = (d: unknown) => (typeof (d as { order?: unknown })?.order === "number" ? (d as { order: number }).order : 0);
const byOrder = <T extends { key: string; data: unknown }>(a: T, b: T) => num(a.data) - num(b.data) || a.key.localeCompare(b.key);

let seedCache: ReturnType<typeof seedRecords> | null = null;
const seed = () => (seedCache ??= seedRecords());

/** Every record of a kind with its draft state (admin lists use this directly). */
export async function loadKindWithState<K extends Kind>(kind: K): Promise<DraftRec<K>[]> {
  const db = getDB();
  if (db) {
    try {
      await ensureTables();
      const total = Number((await db.execute("SELECT COUNT(*) AS n FROM fotb_content")).rows[0].n);
      if (total > 0) {
        const r = await db.execute({ sql: "SELECT key, data, draft, draft_state FROM fotb_content WHERE kind = ?", args: [kind] });
        const out: DraftRec<K>[] = [];
        for (const row of r.rows) {
          const state = (row.draft_state as string | null) ?? "published";
          const json = (state === "edit" || state === "new" ? row.draft : row.data) as string | null;
          const published = row.data as string | null;
          const data = JSON.parse((json ?? published) as string);
          out.push({ key: String(row.key), data, state: state as DraftRec<K>["state"], ...(state === "delete" ? { data: JSON.parse(published as string) } : {}) } as DraftRec<K>);
        }
        return out.sort(byOrder);
      }
    } catch (e) {
      console.error(`[content] ${kind}: falling back to seed files:`, e instanceof Error ? e.message : e);
    }
  }
  return seed()
    .filter((s) => s.kind === kind)
    .map((s) => ({ key: s.key, data: s.data, state: "published" as const }) as DraftRec<K>)
    .sort(byOrder);
}

/** Published records (or, with draft: true, the draft view minus deletions). */
export async function loadKind<K extends Kind>(kind: K, opts: Opts = {}): Promise<Rec<K>[]> {
  const all = await loadKindWithState(kind);
  const db = getDB();
  if (!db || !dbConfigured()) return all;
  if (opts.draft) return all.filter((r) => r.state !== "delete");
  // Published view: need the published JSON, not the draft overlay.
  try {
    const r = await db.execute({ sql: "SELECT key, data FROM fotb_content WHERE kind = ? AND data IS NOT NULL", args: [kind] });
    const total = Number((await db.execute("SELECT COUNT(*) AS n FROM fotb_content")).rows[0].n);
    if (total === 0) return all;
    return r.rows.map((row) => ({ key: String(row.key), data: JSON.parse(String(row.data)) }) as Rec<K>).sort(byOrder);
  } catch {
    return all;
  }
}

export const getProjects = (o?: Opts) => loadKind("project", o);
export const getTestimonials = (o?: Opts) => loadKind("testimonial", o);
export const getClients = (o?: Opts) => loadKind("client", o);
export const getCrew = (o?: Opts) => loadKind("crew", o);
export const getServices = (o?: Opts) => loadKind("service", o);
export const getProcessSteps = (o?: Opts) => loadKind("process_step", o);
export const getPostSteps = (o?: Opts) => loadKind("post_step", o);
export const getFaq = (o?: Opts) => loadKind("faq", o);

export async function getSettings(o?: Opts): Promise<SiteSettings> {
  const r = (await loadKind("setting", o)).find((x) => x.key === "site");
  return { ...DEFAULT_SETTINGS, ...((r?.data as Partial<SiteSettings>) ?? {}) };
}
export async function getTaxonomy(o?: Opts): Promise<Taxonomy> {
  const r = (await loadKind("setting", o)).find((x) => x.key === "taxonomy");
  return (r?.data as Taxonomy) ?? DEFAULT_TAXONOMY;
}
export async function getPageSeo(path: string, o?: Opts): Promise<PageSeoData> {
  const r = (await loadKind("page_seo", o)).find((x) => x.key === path);
  return (r?.data as PageSeoData) ?? {};
}

export type { DataByKind };
