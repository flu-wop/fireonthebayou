import { getDB } from "@/lib/db";

/**
 * Tables for the content store. Created on first use (idempotent).
 *  fotb_content : one row per record. `data` = published JSON, `draft` = unpublished edit,
 *                 `draft_state` = null | 'edit' | 'new' | 'delete'.
 *  fotb_audit   : every change, with before/after JSON, for the history + revert view.
 *  fotb_media   : uploaded files (Vercel Blob). `slot` = the /public path the file replaces.
 *  fotb_users   : per-person admin logins (roles: owner, editor).
 */
let ready: Promise<void> | null = null;

export function ensureTables(): Promise<void> {
  const db = getDB();
  if (!db) return Promise.reject(new Error("Database not configured"));
  ready ??= db
    .batch(
      [
        `CREATE TABLE IF NOT EXISTS fotb_content (
          kind TEXT NOT NULL, key TEXT NOT NULL, data TEXT, draft TEXT, draft_state TEXT,
          updated_at TEXT NOT NULL DEFAULT (datetime('now')), updated_by TEXT,
          PRIMARY KEY (kind, key))`,
        `CREATE TABLE IF NOT EXISTS fotb_audit (
          id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL DEFAULT (datetime('now')),
          user_email TEXT, action TEXT NOT NULL, kind TEXT, key TEXT, before TEXT, after TEXT)`,
        `CREATE TABLE IF NOT EXISTS fotb_media (
          id INTEGER PRIMARY KEY AUTOINCREMENT, slot TEXT, url TEXT NOT NULL, alt TEXT,
          filename TEXT, content_type TEXT, bytes INTEGER, width INTEGER, height INTEGER,
          active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL DEFAULT (datetime('now')), created_by TEXT)`,
        `CREATE TABLE IF NOT EXISTS fotb_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT NOT NULL UNIQUE, name TEXT,
          role TEXT NOT NULL DEFAULT 'editor', pw_hash TEXT NOT NULL, disabled INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
      ],
      "write"
    )
    .then(() => undefined)
    .catch((e) => {
      ready = null;
      throw e;
    });
  return ready;
}
