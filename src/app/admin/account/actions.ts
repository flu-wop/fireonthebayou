"use server";

import { requireUser, verifyPassword, hashPassword } from "@/lib/admin-auth";
import { logAudit } from "@/lib/content/admin-store";
import { getDB } from "@/lib/db";

export async function changePasswordAction(_p: { error?: string; ok?: string } | undefined, fd: FormData) {
  try {
    const me = await requireUser();
    const current = String(fd.get("current") ?? "");
    const next = String(fd.get("next") ?? "");
    if (next.length < 10) return { error: "Use a new password of at least 10 characters." };
    if (next !== String(fd.get("confirm") ?? "")) return { error: "The new passwords don't match." };
    const row = (await getDB()!.execute({ sql: "SELECT pw_hash FROM fotb_users WHERE id = ?", args: [me.id] })).rows[0];
    if (!row || !(await verifyPassword(current, String(row.pw_hash)))) return { error: "Your current password is wrong." };
    await getDB()!.execute({ sql: "UPDATE fotb_users SET pw_hash = ? WHERE id = ?", args: [await hashPassword(next), me.id] });
    await logAudit({ user: me.email, action: "user.password-change", kind: "user", key: me.email });
    return { ok: "Password changed." };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Something went wrong." };
  }
}
