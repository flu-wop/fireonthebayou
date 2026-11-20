import { getDB } from "@/lib/db";
import { ensureTables } from "@/lib/content/schema";

export type MediaRow = { id: number; slot: string | null; url: string; alt: string; filename: string; contentType: string; bytes: number; width: number | null; height: number | null; active: boolean; createdAt: string; createdBy: string };

const toRow = (r: Record<string, unknown>): MediaRow => ({
  id: Number(r.id), slot: (r.slot as string) ?? null, url: String(r.url), alt: String(r.alt ?? ""), filename: String(r.filename ?? ""), contentType: String(r.content_type ?? ""),
  bytes: Number(r.bytes ?? 0), width: r.width == null ? null : Number(r.width), height: r.height == null ? null : Number(r.height), active: Number(r.active) === 1, createdAt: String(r.created_at), createdBy: String(r.created_by ?? ""),
});

export async function addMedia(m: { slot: string | null; url: string; alt: string; filename: string; contentType: string; bytes: number; width?: number; height?: number; user: string }): Promise<number> {
  await ensureTables();
  const db = getDB()!;
  // A slot has one active file; the previous one is kept (inactive) for history.
  if (m.slot) await db.execute({ sql: "UPDATE fotb_media SET active = 0 WHERE slot = ?", args: [m.slot] });
  const r = await db.execute({
    sql: "INSERT INTO fotb_media (slot, url, alt, filename, content_type, bytes, width, height, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: [m.slot, m.url, m.alt, m.filename, m.contentType, m.bytes, m.width ?? null, m.height ?? null, m.user],
  });
  return Number(r.lastInsertRowid);
}

export async function listMedia(limit = 200): Promise<MediaRow[]> {
  await ensureTables();
  const r = await getDB()!.execute({ sql: "SELECT * FROM fotb_media ORDER BY id DESC LIMIT ?", args: [limit] });
  return r.rows.map(toRow);
}
export async function getMediaRow(id: number): Promise<MediaRow | null> {
  await ensureTables();
  const r = await getDB()!.execute({ sql: "SELECT * FROM fotb_media WHERE id = ?", args: [id] });
  return r.rows[0] ? toRow(r.rows[0]) : null;
}
export async function setAlt(id: number, alt: string) {
  await getDB()!.execute({ sql: "UPDATE fotb_media SET alt = ? WHERE id = ?", args: [alt.slice(0, 300), id] });
}
export async function deactivate(id: number) {
  await getDB()!.execute({ sql: "UPDATE fotb_media SET active = 0 WHERE id = ?", args: [id] });
}
export async function activate(id: number) {
  const row = await getMediaRow(id);
  if (!row) return;
  if (row.slot) await getDB()!.execute({ sql: "UPDATE fotb_media SET active = 0 WHERE slot = ?", args: [row.slot] });
  await getDB()!.execute({ sql: "UPDATE fotb_media SET active = 1 WHERE id = ?", args: [id] });
}
