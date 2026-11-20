"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/admin-auth";
import { logAudit } from "@/lib/content/admin-store";
import { activate, deactivate, getMediaRow, setAlt } from "@/lib/media-store";

export async function saveAltAction(fd: FormData): Promise<void> {
  const u = await requireUser();
  await setAlt(Number(fd.get("id")), String(fd.get("alt") ?? ""));
  await logAudit({ user: u.email, action: "media.alt", kind: "media", key: String(fd.get("id")) });
  revalidatePath("/admin/media");
}
export async function toggleMediaAction(fd: FormData): Promise<void> {
  const u = await requireUser();
  const id = Number(fd.get("id"));
  if (fd.get("intent") === "activate") await activate(id);
  else await deactivate(id);
  await logAudit({ user: u.email, action: `media.${fd.get("intent")}`, kind: "media", key: String(id) });
  revalidatePath("/", "layout");
}
export async function deleteMediaAction(fd: FormData): Promise<void> {
  const u = await requireUser();
  const row = await getMediaRow(Number(fd.get("id")));
  if (!row) return;
  await deactivate(row.id);
  try { if (process.env.BLOB_READ_WRITE_TOKEN) await del(row.url); } catch { /* already gone */ }
  await logAudit({ user: u.email, action: "media.delete", kind: "media", key: String(row.id), before: { url: row.url } });
  revalidatePath("/", "layout");
}
