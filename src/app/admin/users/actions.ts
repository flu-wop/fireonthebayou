"use server";

import { revalidatePath } from "next/cache";
import { createUser, findUserByEmail, hashPassword, requireUser } from "@/lib/admin-auth";
import { logAudit } from "@/lib/content/admin-store";
import { getDB } from "@/lib/db";

type S = { error?: string; ok?: string } | undefined;

export async function addUserAction(_p: S, fd: FormData): Promise<S> {
  try {
    const me = await requireUser("owner");
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    const pw = String(fd.get("password") ?? "");
    const role = fd.get("role") === "owner" ? "owner" : "editor";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "Enter a valid email." };
    if (pw.length < 10) return { error: "Use a password of at least 10 characters." };
    if (await findUserByEmail(email)) return { error: "That email already has an account." };
    await createUser({ email, name: String(fd.get("name") ?? ""), role, password: pw });
    await logAudit({ user: me.email, action: "user.create", kind: "user", key: email, after: { role } });
    revalidatePath("/admin/users");
    return { ok: `Added ${email} as ${role}.` };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed." };
  }
}

export async function updateUserAction(fd: FormData): Promise<void> {
  const me = await requireUser("owner");
  const id = Number(fd.get("id"));
  const intent = String(fd.get("intent"));
  const db = getDB()!;
  const target = (await db.execute({ sql: "SELECT email FROM fotb_users WHERE id = ?", args: [id] })).rows[0];
  if (!target) return;
  const email = String(target.email);
  if (id === me.id && (intent === "disable" || intent === "editor")) return; // can't lock yourself out
  if (intent === "disable" || intent === "enable") await db.execute({ sql: "UPDATE fotb_users SET disabled = ? WHERE id = ?", args: [intent === "disable" ? 1 : 0, id] });
  else if (intent === "owner" || intent === "editor") await db.execute({ sql: "UPDATE fotb_users SET role = ? WHERE id = ?", args: [intent, id] });
  else if (intent === "reset") {
    const pw = String(fd.get("password") ?? "");
    if (pw.length < 10) return;
    await db.execute({ sql: "UPDATE fotb_users SET pw_hash = ? WHERE id = ?", args: [await hashPassword(pw), id] });
  }
  await logAudit({ user: me.email, action: `user.${intent}`, kind: "user", key: email });
  revalidatePath("/admin/users");
}
