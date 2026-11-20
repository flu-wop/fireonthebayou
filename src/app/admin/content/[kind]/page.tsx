import Link from "next/link";
import { notFound } from "next/navigation";
import { guard } from "../../guard";
import { loadKindWithState } from "@/lib/content";
import { KINDS } from "@/lib/content/forms";
import type { Kind } from "@/lib/content/types";
import { Card, Page, StateBadge, btn } from "@/components/admin/ui";
import BulkLogoUpload from "@/components/admin/BulkLogoUpload";
import { slotFor } from "@/lib/content/media-slots";
import { getMediaOverrides, resolveWith } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function KindList({ params, searchParams }: { params: Promise<{ kind: string }>; searchParams: Promise<{ q?: string; deleted?: string }> }) {
  await guard();
  const { kind } = await params;
  const meta = KINDS[kind as Kind];
  if (!meta) notFound();
  const { q, deleted } = await searchParams;
  const all = await loadKindWithState(kind as Kind);
  const map = await getMediaOverrides();
  const hasImg = (key: string) => { const sp = slotFor(kind as Kind, key); return sp ? resolveWith(map, sp.path) !== null : null; };
  const rows = q ? all.filter((r) => meta.title(r.data as unknown as Record<string, unknown>).toLowerCase().includes(q.toLowerCase())) : all;

  return (
    <Page title={meta.plural} sub={meta.description} actions={<Link href={`/admin/content/${kind}/new`} className={btn}>New {meta.label.toLowerCase()}</Link>}>
      {deleted && <p role="status" className="mb-4 rounded border border-emerald-600/50 bg-emerald-500/10 p-3 text-sm text-emerald-300">Marked for deletion. Publish to remove it from the live site.</p>}
      {kind === "client" && (
        <Card title="Add many logos at once"><BulkLogoUpload clients={all.map((r) => ({ key: r.key, name: (r.data as { name: string }).name }))} /></Card>
      )}
      <form className="mb-4"><input name="q" defaultValue={q} placeholder={`Search ${meta.plural.toLowerCase()}…`} className="w-full max-w-sm rounded border border-border bg-bayou px-3 py-2 text-sm text-cream outline-none focus:border-flame" /></form>
      <p className="mb-2 text-xs text-ash">{rows.length} of {all.length}</p>
      <ul className="divide-y divide-border rounded border border-border bg-bayou">
        {rows.map((r) => (
          <li key={r.key}>
            <Link href={`/admin/content/${kind}/${encodeURIComponent(r.key)}`} className="flex items-center justify-between gap-4 px-4 py-3 text-sm hover:bg-bayou-deep">
              <span className="min-w-0 truncate text-cream">{meta.title(r.data as unknown as Record<string, unknown>)}</span>
              <span className="flex shrink-0 items-center gap-4">
                {kind === "project" && <span className="hidden text-xs text-ash sm:inline">{(r.data as { client: string }).client}</span>}
                {hasImg(r.key) !== null && <span className={`text-xs ${hasImg(r.key) ? "text-emerald-400" : "text-amber-300"}`}>{hasImg(r.key) ? `${slotFor(kind as Kind, r.key)!.label} ✓` : `No ${slotFor(kind as Kind, r.key)!.label.toLowerCase()}`}</span>}
                <StateBadge state={r.state} />
              </span>
            </Link>
          </li>
        ))}
        {rows.length === 0 && <li className="px-4 py-6 text-sm text-mist">Nothing here yet.</li>}
      </ul>
    </Page>
  );
}
