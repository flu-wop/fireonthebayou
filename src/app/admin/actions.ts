"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, countUsers, createUser, findUserByEmail, sessionValue, verifyPassword } from "@/lib/admin-auth";
import { logAudit } from "@/lib/content/admin-store";

const attempts = new Map<string, { n: number; reset: number }>();

type LoginState = { error?: string; email?: string } | undefined;

export async function loginAction(_prev: LoginState, form: FormData): Promise<LoginState> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for")?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
  const now = Date.now();
  const a = attempts.get(ip);
  if (a && a.reset > now && a.n >= 8) return { error: "Too many tries. Wait a few minutes.", email: String(form.get("email") ?? "") };
  attempts.set(ip, a && a.reset > now ? { n: a.n + 1, reset: a.reset } : { n: 1, reset: now + 10 * 60_000 });

  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password.", email };
  if (!process.env.ADMIN_PASSWORD && !process.env.ADMIN_SESSION_SECRET) return { error: "ADMIN_PASSWORD isn't set on this deployment yet.", email };

  let userId: number | null = null;
  try {
    if ((await countUsers()) === 0) {
      // First sign-in: the shared bootstrap password creates the Owner account.
      if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return { error: "Wrong email or password.", email };
      userId = await createUser({ email, name: email.split("@")[0], role: "owner", password });
      await logAudit({ user: email, action: "user.bootstrap", kind: "user", key: email });
    } else {
      const u = await findUserByEmail(email);
      if (!u || Number(u.disabled) === 1 || !(await verifyPassword(password, String(u.pw_hash)))) return { error: "Wrong email or password.", email };
      userId = Number(u.id);
    }
  } catch (e) {
    console.error("login failed", e);
    return { error: "The database isn't reachable. Check TURSO_URL and TURSO_TOKEN.", email };
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
