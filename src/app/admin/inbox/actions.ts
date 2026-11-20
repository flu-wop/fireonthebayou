"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/admin-auth";
import { logAudit } from "@/lib/content/admin-store";
import { getDB } from "@/lib/db";
import { setMailchimpStatus } from "@/lib/inquiries";
import { subscribeToAudience, mailchimpConfigured } from "@/lib/mailchimp";

export async function setStatusAction(fd: FormData): Promise<void> {
  const u = await requireUser();
  const id = Number(fd.get("id"));
  const status = fd.get("status") === "replied" ? "replied" : "new";
  await getDB()!.execute({ sql: "UPDATE fotb_inquiries SET status = ? WHERE id = ?", args: [status, id] });
  await logAudit({ user: u.email, action: `inquiry.${status}`, kind: "inquiry", key: String(id) });
  revalidatePath("/admin/inbox");
}

export async function retryMailchimpAction(fd: FormData): Promise<void> {
  const u = await requireUser();
  const id = Number(fd.get("id"));
  const row = (await getDB()!.execute({ sql: "SELECT name, email, opt_in FROM fotb_inquiries WHERE id = ?", args: [id] })).rows[0];
  if (!row || Number(row.opt_in) !== 1) return;
  if (!mailchimpConfigured()) await setMailchimpStatus(id, "not_configured");
  else {
    const r = await subscribeToAudience({ email: String(row.email), name: String(row.name) });
    await setMailchimpStatus(id, r.ok ? "synced" : "failed", r.ok ? undefined : r.error);
  }
  await logAudit({ user: u.email, action: "inquiry.mailchimp-retry", kind: "inquiry", key: String(id) });
  revalidatePath("/admin/inbox");
}
