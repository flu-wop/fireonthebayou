"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/admin-auth";
import { getTaxonomy, loadKindWithState } from "@/lib/content";
import { deleteWarnings, discardDraft, getEffective, logAudit, markDelete, publishAll, publishRecord, revertAudit, saveDraft, seedAll } from "@/lib/content/admin-store";
import { KINDS, SEO_FIELDS, SETTINGS_FIELDS, parseForm, parseTaxonomy, projectFromForm, type Field } from "@/lib/content/forms";
import type { Kind } from "@/lib/content/types";
import { checkYouTubeId } from "@/lib/youtube-validate";

export type FormState = { error?: string; ok?: string; warnings?: string[] } | undefined;

const live = () => revalidatePath("/", "layout");
const fail = (e: unknown): FormState => ({ error: e instanceof Error ? e.message : "Something went wrong." });

/** Check any YouTube IDs that are new compared to what's already stored. */
async function validateIds(ids: string[], existing: string[]): Promise<{ errors: string[]; warnings: string[] }> {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const id of ids.filter((i) => !existing.includes(i))) {
    const r = await checkYouTubeId(id);
    if (!r.ok) errors.push(r.message ?? `${id} is not valid.`);
    else if (r.warn && r.message) warnings.push(r.message);
  }
  return { errors, warnings };
}

export async function saveRecordAction(_p: FormState, fd: FormData): Promise<FormState> {
  try {
    const user = await requireUser();
    const kind = String(fd.get("kind")) as Kind;
    const meta = KINDS[kind];
    if (!meta) return { error: "Unknown content type." };
    const existingKey = String(fd.get("key") ?? "");
    const intent = String(fd.get("intent") ?? "save");
    const isNew = !existingKey;
    const current = existingKey ? ((await getEffective(kind, existingKey)) as Record<string, unknown> | null) : null;

    if (intent === "discard") {
      await discardDraft(kind, existingKey, user.email);
      return { ok: "Draft discarded." };
    }
    if (intent === "delete") {
      const warn = await deleteWarnings(kind, existingKey);
      if (warn.length && fd.get("confirmDelete") !== "on") return { error: `Before deleting: ${warn.join(" ")} Tick "Delete anyway" to continue.` };
      await markDelete(kind, existingKey, user.email);
      if (intent === "delete") redirect(`/admin/content/${kind}?deleted=1`);
    }

    const parsed = parseForm(meta.fields, fd, current ?? {});
    const errors = [...parsed.errors];
    let data: Record<string, unknown> = parsed.data;
    const key = existingKey || meta.keyFor(data);
    if (!key) errors.push("A title or name is needed to create the page address.");
    if (isNew && key && (await loadKindWithState(kind)).some((r) => r.key === key)) errors.push(`"${key}" already exists.`);

    if (kind === "project") {
      const tax = await getTaxonomy({ draft: true });
      const bad = [...(data.industries as string[]).filter((k) => !tax.industries.some((t) => t.key === k)), ...(data.formats as string[]).filter((k) => !tax.formats.some((t) => t.key === k))];
      if (bad.length) errors.push(`Unknown tag: ${bad.join(", ")}.`);
      data = projectFromForm(data, key) as unknown as Record<string, unknown>;
      if (data.featured) {
        const others = (await loadKindWithState("project")).filter((r) => r.key !== key && r.state !== "delete" && (r.data as { featured?: boolean }).featured).length;
        if (others >= 6) errors.push("Featured is full (6). Untick another project first.");
      }
    }
    const idsToCheck = kind === "project" ? (data.youtubeIds as string[]) : kind === "testimonial" ? (data.youtubeId ? [data.youtubeId as string] : []) : [];
    const prevIds = current ? (kind === "project" ? ((current.youtubeIds as string[]) ?? []) : current.youtubeId ? [current.youtubeId as string] : []) : [];
    const v = await validateIds(idsToCheck, prevIds);
    errors.push(...v.errors);
    if (errors.length) return { error: errors.join(" ") };

    await saveDraft(kind, key, data, user.email);
    if (intent === "publish") {
      await publishRecord(kind, key, user.email);
      live();
    }
    const msg = intent === "publish" ? "Published. The site is refreshing." : "Draft saved. Publish when you're ready.";
    if (isNew) redirect(`/admin/content/${kind}/${encodeURIComponent(key)}?saved=${intent}`);
    return { ok: msg, warnings: v.warnings };
  } catch (e) {
    if (e && typeof e === "object" && "digest" in e && String((e as { digest: unknown }).digest).startsWith("NEXT_REDIRECT")) throw e;
    return fail(e);
  }
}

async function saveSingle(kind: Kind, key: string, fields: Field[], fd: FormData, publish: boolean, role: "owner" | "editor"): Promise<FormState> {
  try {
    const user = role === "owner" ? await requireUser("owner") : await requireUser();
    const base = ((await getEffective(kind, key)) as Record<string, unknown> | null) ?? {};
    const parsed = parseForm(fields, fd, base);
    const errors = [...parsed.errors];
    const prev = parsed.youtubeIds.length ? [String((base as { heroYoutubeId?: string }).heroYoutubeId ?? "")] : [];
    const v = await validateIds(parsed.youtubeIds, prev);
    errors.push(...v.errors);
    if (errors.length) return { error: errors.join(" ") };
    await saveDraft(kind, key, parsed.data, user.email);
    if (publish) {
      await publishRecord(kind, key, user.email);
      live();
    }
    return { ok: publish ? "Published." : "Draft saved.", warnings: v.warnings };
  } catch (e) {
    return fail(e);
  }
}

export async function saveSettingsAction(_p: FormState, fd: FormData): Promise<FormState> {
  return saveSingle("setting", "site", SETTINGS_FIELDS, fd, fd.get("intent") === "publish", "owner");
}

export async function saveSeoAction(_p: FormState, fd: FormData): Promise<FormState> {
  return saveSingle("page_seo", String(fd.get("path")), SEO_FIELDS, fd, fd.get("intent") === "publish", "editor");
}

export async function saveTaxonomyAction(_p: FormState, fd: FormData): Promise<FormState> {
  try {
    const user = await requireUser("owner");
    const f = parseTaxonomy(String(fd.get("formats") ?? ""));
    const i = parseTaxonomy(String(fd.get("industries") ?? ""));
    const errors = [...f.errors, ...i.errors];
    if (!f.items.length || !i.items.length) errors.push("Keep at least one format and one industry.");
    if (errors.length) return { error: errors.join(" ") };
    const data = { formats: f.items, industries: i.items };
    await saveDraft("setting", "taxonomy", data, user.email);
    if (fd.get("intent") === "publish") {
      await publishRecord("setting", "taxonomy", user.email);
      live();
      return { ok: "Published." };
    }
    return { ok: "Draft saved." };
  } catch (e) {
    return fail(e);
  }
}

export async function publishAllAction(): Promise<void> {
  const user = await requireUser();
  const n = await publishAll(user.email);
  if (n) live();
  redirect(`/admin?published=${n}`);
}

export async function seedAction(fd: FormData): Promise<void> {
  const user = await requireUser("owner");
  const counts = await seedAll(user.email, fd.get("overwrite") === "on");
  live();
  redirect(`/admin?seeded=${Object.values(counts).reduce((a, b) => a + b, 0)}`);
}

export async function revertAction(fd: FormData): Promise<void> {
  const user = await requireUser();
  const target = await revertAudit(Number(fd.get("id")), user.email);
  redirect(`/admin?reverted=${encodeURIComponent(target)}`);
}

export async function discardAllAction(): Promise<void> {
  const user = await requireUser();
  await logAudit({ user: user.email, action: "draft.discard-all" });
  const { pendingChanges } = await import("@/lib/content/admin-store");
  for (const p of await pendingChanges()) await discardDraft(p.kind, p.key, user.email);
  redirect("/admin?discarded=1");
}
