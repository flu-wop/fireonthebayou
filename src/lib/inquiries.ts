import { getDB } from "@/lib/db";

/** Contact-form inquiries, stored in Turso. The admin inbox (phase 4) reads this table. */
export type NewInquiry = { name: string; email: string; phone: string; budget: string; message: string; optIn: boolean };
export type McStatus = "skipped" | "synced" | "failed" | "not_configured";

let ready: Promise<void> | null = null;

export function ensureInquiriesTable(): Promise<void> {
  const db = getDB();
  if (!db) return Promise.reject(new Error("Database not configured"));
  ready ??= db
    .execute(`CREATE TABLE IF NOT EXISTS fotb_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      budget TEXT,
      message TEXT NOT NULL,
      opt_in INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'new',
      mc_status TEXT NOT NULL DEFAULT 'skipped',
      mc_error TEXT
    )`)
    .then(() => undefined)
    .catch((e) => {
      ready = null;
      throw e;
    });
  return ready;
}

export async function saveInquiry(i: NewInquiry): Promise<number> {
  await ensureInquiriesTable();
  const r = await getDB()!.execute({
    sql: "INSERT INTO fotb_inquiries (name, email, phone, budget, message, opt_in) VALUES (?, ?, ?, ?, ?, ?)",
    args: [i.name, i.email, i.phone, i.budget, i.message, i.optIn ? 1 : 0],
  });
  return Number(r.lastInsertRowid);
}

export async function setMailchimpStatus(id: number, status: McStatus, error?: string) {
  await getDB()!.execute({
    sql: "UPDATE fotb_inquiries SET mc_status = ?, mc_error = ? WHERE id = ?",
    args: [status, error ?? null, id],
  });
}
