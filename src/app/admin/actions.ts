"use server";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, ADMIN_NAME, createUser, findUserByEmail, sessionValue } from "@/lib/admin-auth";
import { logAudit } from "@/lib/content/admin-store";

const attempts = new Map<string, { n: number; reset: number }>();

type LoginState = { error?: string } | undefined;

/** Password-only sign-in. The password is ADMIN_PASSWORD, so changing it in Vercel changes it here
 *  and signs everyone out. Everyone who knows it is the one built-in "admin" account. */
export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.reset > now && a.n >= 8) return { error: "Too many tries. Wait a few minutes." };
  attempts.set(ip, a && a.reset > now ? { n: a.n + 1, reset: a.reset } : { n: 1, reset: now + 10 * 60_000 });

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { error: "ADMIN_PASSWORD isn't set on this deployment yet." };
  const given = String(form.get("password") ?? "");
  const ha = createHmac("sha256", "cmp").update(given).digest();
  const hb = createHmac("sha256", "cmp").update(expected).digest();
  if (!timingSafeEqual(ha, hb)) return { error: "Wrong password." };

  let userId: number;
  try {
    const u = await findUserByEmail(ADMIN_NAME);
    userId = u ? Number(u.id) : await createUser({ email: ADMIN_NAME, name: "Admin", role: "owner", password: expected });
    if (!u) await logAudit({ user: ADMIN_NAME, action: "user.bootstrap", kind: "user", key: ADMIN_NAME });
  } catch (e) {
    console.error("login failed", e);
    return { error: "The database isn't reachable. Check TURSO_URL and TURSO_TOKEN." };
  }

  (await cookies()).set(ADMIN_COOKIE, sessionValue(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete({ name: ADMIN_COOKIE, path: "/" });
  redirect("/admin/login");
}
