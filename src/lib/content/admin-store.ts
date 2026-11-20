import { getDB } from "@/lib/db";
import { ensureTables } from "./schema";
import { seedRecords } from "./seed-data";
import type { Kind } from "./types";

/**
 * Write side of the content store (admin only; no Next-specific imports so the
 * seed script can use it too). Every mutation writes an audit row with the
 * before/after JSON; "revert" restores a `before` snapshot as a draft.
 */
const db = () => {
  const d = getDB();
  if (!d) throw new Error("Database not configured (TURSO_URL).");
  return d;
};

export type AuditRow = { id: number; at: string; user: string; action: string; kind: string | null; key: string | null; before: unknown; after: unknown };

export async function logAudit(a: { user: string; action: string; kind?: string; key?: string; before?: unknown; after?: unknown }) {
  await ensureTables();
  await db().execute({
    sql: "INSERT INTO fotb_audit (user_email, action, kind, key, before, after) VALUES (?, ?, ?, ?, ?, ?)",
    args: [a.user, a.action, a.kind ?? null, a.key ?? null, a.before === undefined ? null : JSON.stringify(a.before), a.after === undefined ? null : JSON.stringify(a.after)],
  });
}

async function row(kind: Kind, key: string) {
  const r = await db().execute({ sql: "SELECT data, draft, draft_state FROM fotb_content WHERE kind = ? AND key = ?", args: [kind, key] });
  const x = r.rows[0];
  if (!x) return null;
  return { data: x.data ? JSON.parse(String(x.data)) : null, draft: x.draft ? JSON.parse(String(x.draft)) : null, state: (x.draft_state as string | null) ?? null };
}

/** Effective (draft-aware) value of a record, or null. */
export async function getEffective(kind: Kind, key: string) {
  const r = await row(kind, key);
  if (!r || r.state === "delete") return null;
  return r.draft ?? r.data;
}

export async function saveDraft(kind: Kind, key: string, data: unknown, user: string) {
  await ensureTables();
  const cur = await row(kind, key);
  const before = cur ? (cur.draft ?? cur.data) : null;
  if (!cur) {
    await db().execute({ sql: "INSERT INTO fotb_content (kind, key, draft, draft_state, updated_by) VALUES (?, ?, ?, 'new', ?)", args: [kind, key, JSON.stringify(data), user] });
  } else {
    const state = cur.data === null ? "new" : "edit";
    await db().execute({ sql: "UPDATE fotb_content SET draft = ?, draft_state = ?, updated_at = datetime('now'), updated_by = ? WHERE kind = ? AND key = ?", args: [JSON.stringify(data), state, user, kind, key] });
  }
  await logAudit({ user, action: cur ? "draft.save" : "draft.create", kind, key, before, after: data });
}

export async function discardDraft(kind: Kind, key: string, user: string) {
  const cur = await row(kind, key);
  if (!cur) return;
  if (cur.data === null) await db().execute({ sql: "DELETE FROM fotb_content WHERE kind = ? AND key = ?", args: [kind, key] });
  else await db().execute({ sql: "UPDATE fotb_content SET draft = NULL, draft_state = NULL WHERE kind = ? AND key = ?", args: [kind, key] });
  await logAudit({ user, action: "draft.discard", kind, key, before: cur.draft ?? cur.data });
}

export async function markDelete(kind: Kind, key: string, user: string) {
  const cur = await row(kind, key);
  if (!cur) return;
  if (cur.data === null) await db().execute({ sql: "DELETE FROM fotb_content WHERE kind = ? AND key = ?", args: [kind, key] });
  else await db().execute({ sql: "UPDATE fotb_content SET draft_state = 'delete', updated_at = datetime('now'), updated_by = ? WHERE kind = ? AND key = ?", args: [user, kind, key] });
  await logAudit({ user, action: "draft.delete", kind, key, before: cur.draft ?? cur.data });
}

/** Publish one record (apply its draft or its pending deletion). */
export async function publishRecord(kind: Kind, key: string, user: string) {
  const cur = await row(kind, key);
  if (!cur || !cur.state) return false;
  if (cur.state === "delete") {
    await db().execute({ sql: "DELETE FROM fotb_content WHERE kind = ? AND key = ?", args: [kind, key] });
    await logAudit({ user, action: "publish.delete", kind, key, before: cur.data });
  } else {
    await db().execute({ sql: "UPDATE fotb_content SET data = ?, draft = NULL, draft_state = NULL, updated_at = datetime('now'), updated_by = ? WHERE kind = ? AND key = ?", args: [JSON.stringify(cur.draft), user, kind, key] });
    await logAudit({ user, action: "publish", kind, key, before: cur.data, after: cur.draft });
  }
  return true;
}

export async function pendingChanges(): Promise<{ kind: Kind; key: string; state: string; label: string }[]> {
  await ensureTables();
  const r = await db().execute("SELECT kind, key, draft, data, draft_state FROM fotb_content WHERE draft_state IS NOT NULL ORDER BY kind, key");
  return r.rows.map((x) => {
    const d = JSON.parse(String((x.draft ?? x.data) ?? "{}")) as Record<string, unknown>;
    const label = String(d.title ?? d.name ?? d.client ?? d.q ?? x.key);
    return { kind: x.kind as Kind, key: String(x.key), state: String(x.draft_state), label };
  });
}

export async function publishAll(user: string): Promise<number> {
  const pending = await pendingChanges();
  for (const p of pending) await publishRecord(p.kind, p.key, user);
  return pending.length;
}

export async function listAudit(limit = 100, kind?: string, key?: string): Promise<AuditRow[]> {
  await ensureTables();
  const where = kind && key ? "WHERE kind = ? AND key = ?" : "";
  const r = await db().execute({ sql: `SELECT * FROM fotb_audit ${where} ORDER BY id DESC LIMIT ?`, args: kind && key ? [kind, key, limit] : [limit] });
  return r.rows.map((x) => ({ id: Number(x.id), at: String(x.at), user: String(x.user_email ?? ""), action: String(x.action), kind: (x.kind as string) ?? null, key: (x.key as string) ?? null, before: x.before ? JSON.parse(String(x.before)) : null, after: x.after ? JSON.parse(String(x.after)) : null }));
}

/** Restore an audit entry's `before` snapshot as a draft (publish to make it live). */
export async function revertAudit(id: number, user: string): Promise<string> {
  await ensureTables();
  const r = await db().execute({ sql: "SELECT * FROM fotb_audit WHERE id = ?", args: [id] });
  const a = r.rows[0];
  if (!a || !a.kind || !a.key) throw new Error("That history entry can't be reverted.");
  const kind = a.kind as Kind;
  const key = String(a.key);
  const before = a.before ? JSON.parse(String(a.before)) : null;
  if (before === null) {
    await markDelete(kind, key, user);
  } else {
    const cur = await row(kind, key);
    if (cur?.state === "delete") await db().execute({ sql: "UPDATE fotb_content SET draft_state = NULL WHERE kind = ? AND key = ?", args: [kind, key] });
    await saveDraft(kind, key, before, user);
  }
  await logAudit({ user, action: "revert", kind, key, after: before });
  return `${kind}/${key}`;
}

/** Load the seed (catalog JSON + lib files) into the database. Existing rows are kept unless `overwrite`. */
export async function seedAll(user: string, overwrite = false): Promise<Record<string, number>> {
  await ensureTables();
  const counts: Record<string, number> = {};
  const sql = overwrite
    ? "INSERT INTO fotb_content (kind, key, data, updated_by) VALUES (?, ?, ?, ?) ON CONFLICT(kind, key) DO UPDATE SET data = excluded.data, draft = NULL, draft_state = NULL, updated_by = excluded.updated_by"
    : "INSERT INTO fotb_content (kind, key, data, updated_by) VALUES (?, ?, ?, ?) ON CONFLICT(kind, key) DO NOTHING";
  const recs = seedRecords();
  for (let i = 0; i < recs.length; i += 100) {
    const chunk = recs.slice(i, i + 100);
    const results = await db().batch(chunk.map((r) => ({ sql, args: [r.kind, r.key, JSON.stringify(r.data), user] })), "write");
    results.forEach((res, j) => {
      if (res.rowsAffected > 0) counts[chunk[j].kind] = (counts[chunk[j].kind] ?? 0) + 1;
    });
  }
  await logAudit({ user, action: overwrite ? "seed.overwrite" : "seed", after: counts });
  return counts;
}

/** What would break if this record were deleted? */
export async function deleteWarnings(kind: Kind, key: string): Promise<string[]> {
  const out: string[] = [];
  if (kind === "project") {
    const eff = (await getEffective(kind, key)) as { featured?: boolean; slug?: string } | null;
    if (eff?.featured) out.push("It is in the Featured row on Work.");
    const { legacyRedirects } = await import("@/lib/redirects");
    const hits = legacyRedirects.filter((r) => r.destination === `/work/${key}`).length;
    if (hits) out.push(`${hits} old WordPress redirect(s) point to /work/${key}.`);
  }
  if (kind === "client") out.push("Its logo disappears from the home banner and the Studio wall.");
  return out;
}
