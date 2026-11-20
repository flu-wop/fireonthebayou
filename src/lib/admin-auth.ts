import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { getDB } from "@/lib/db";
import { ensureTables } from "@/lib/content/schema";

/**
 * Admin auth: one shared password (ADMIN_PASSWORD), no usernames. Signing in creates a session
 * for the built-in "admin" owner row in fotb_users. The session cookie is
 * `userId.expiry.signature` (HMAC); the user is re-read from the database on
 * every request, so disabling or demoting someone takes effect immediately.
 *
 * Signing secret: ADMIN_SESSION_SECRET, else derived from ADMIN_PASSWORD.
 */
export const ADMIN_COOKIE = "fotb_admin";
/** The single built-in account everyone signs in as (password-only login). */
export const ADMIN_NAME = "admin";
export type Role = "owner" | "editor";
export type AdminUser = { id: number; email: string; name: string; role: Role };

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}
const sign = (payload: string) => createHmac("sha256", secret() ?? "").update(payload).digest("hex");
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function hashPassword(pw: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await scrypt(pw, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}
export async function verifyPassword(pw: string, stored: string): Promise<boolean> {
  const [alg, saltHex, hashHex] = stored.split("$");
  if (alg !== "scrypt" || !saltHex || !hashHex) return false;
  const hash = await scrypt(pw, Buffer.from(saltHex, "hex"), 64);
  return safeEqual(hash.toString("hex"), hashHex);
}

export const adminConfigured = () => Boolean(secret()) && Boolean(getDB());

export function sessionValue(userId: number, days = 7): string {
  const exp = Date.now() + days * 86_400_000;
  const p = `${userId}.${exp}`;
  return `${p}.${sign(`session:${p}`)}`;
}

const rowToUser = (r: Record<string, unknown>): AdminUser => ({ id: Number(r.id), email: String(r.email), name: String(r.name ?? ""), role: r.role === "owner" ? "owner" : "editor" });

export async function findUserByEmail(email: string) {
  const db = getDB();
  if (!db) return null;
  await ensureTables();
  const r = await db.execute({ sql: "SELECT * FROM fotb_users WHERE email = ? COLLATE NOCASE", args: [email.trim()] });
  return r.rows[0] ?? null;
}
export async function countUsers(): Promise<number> {
  const db = getDB();
  if (!db) return 0;
  await ensureTables();
  return Number((await db.execute("SELECT COUNT(*) AS n FROM fotb_users")).rows[0].n);
}
export async function createUser(u: { email: string; name: string; role: Role; password: string }): Promise<number> {
  const db = getDB()!;
  await ensureTables();
  const r = await db.execute({ sql: "INSERT INTO fotb_users (email, name, role, pw_hash) VALUES (?, ?, ?, ?)", args: [u.email.trim().toLowerCase(), u.name.trim(), u.role, await hashPassword(u.password)] });
  return Number(r.lastInsertRowid);
}

/** Returns the signed-in user (from the cookie), or null. */
export async function getSession(): Promise<AdminUser | null> {
  const db = getDB();
  if (!db || !secret()) return null;
  const c = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!c) return null;
  const [id, exp, sig] = c.split(".");
  if (!id || !exp || !sig || !safeEqual(sig, sign(`session:${id}.${exp}`)) || Number(exp) < Date.now()) return null;
  try {
    await ensureTables();
    const r = await db.execute({ sql: "SELECT * FROM fotb_users WHERE id = ? AND disabled = 0", args: [Number(id)] });
    return r.rows[0] ? rowToUser(r.rows[0]) : null;
  } catch {
    return null;
  }
}

export async function isAdmin(): Promise<boolean> {
  return (await getSession()) !== null;
}

/** For server actions / routes: throws unless signed in (and, if given, in one of `roles`). */
export async function requireUser(...roles: Role[]): Promise<AdminUser> {
  const u = await getSession();
  if (!u) throw new Error("Please sign in.");
  if (roles.length && !roles.includes(u.role)) throw new Error("Only an Owner can do that.");
  return u;
}

/** Signed preview-link token: `expiry.signature`, valid for 7 days. */
export function previewToken(days = 7): string {
  const exp = Date.now() + days * 86_400_000;
  return `${exp}.${sign(`preview:${exp}`)}`;
}
export function validPreviewToken(t: string | undefined | null): boolean {
  if (!t || !secret()) return false;
  const [exp, sig] = t.split(".");
  return Boolean(exp && sig) && Number(exp) > Date.now() && safeEqual(sig, sign(`preview:${exp}`));
}
