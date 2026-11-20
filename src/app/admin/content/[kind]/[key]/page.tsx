import Link from "next/link";
import { notFound } from "next/navigation";
import { guard } from "../../../guard";
import { saveRecordAction } from "../../actions";
import RecordForm from "@/components/admin/RecordForm";
import { Card, Page, StateBadge } from "@/components/admin/ui";
import { previewToken } from "@/lib/admin-auth";
import { getTaxonomy, loadKindWithState } from "@/lib/content";
import { listAudit } from "@/lib/content/admin-store";
import { KINDS, formValues, projectToForm } from "@/lib/content/forms";
import type { Kind, ProjectData } from "@/lib/content/types";
import { PREVIEW_PAGES, previewSlugFor } from "@/lib/preview-pages";
import { slotFor } from "@/lib/content/media-slots";
import { getMediaOverrides, resolveWith } from "@/lib/media";
import UploadButton from "@/components/admin/UploadButton";

export const dynamic = "force-dynamic";

export default async function EditRecord({ params, searchParams }: { params: Promise<{ kind: string; key: string }>; searchParams: Promise<{ saved?: string }> }) {
  await guard();
  const { kind, key: rawKey } = await params;
  const key = decodeURIComponent(rawKey);
  const meta = KINDS[kind as Kind];
  if (!meta) notFound();
  const isNew = key === "new";
  const all = await loadKindWithState(kind as Kind);
  const rec = isNew ? null : all.find((r) => r.key === key);
  if (!isNew && !rec) notFound();
  const tax = await getTaxonomy({ draft: true });
  const nextOrder = Math.max(0, ...all.map((r) => Number((r.data as { order?: number }).order ?? 0))) + 1;
  const base: Record<string, unknown> = rec ? (kind === "project" ? projectToForm(rec.data as ProjectData) : (rec.data as unknown as Record<string, unknown>)) : { order: nextOrder, banner: true, wall: true, youtubeIds: [], industries: [], formats: [] };
  const values = formValues(meta.fields, base);
  const sp = await searchParams;
  const history = isNew ? [] : (await listAudit(8, kind, key)).filter((a) => a.action.startsWith("publish") || a.action.startsWith("draft"));
  const slot = isNew ? null : slotFor(kind as Kind, key);
  const current = slot ? resolveWith(await getMediaOverrides(), slot.path) : null;
  const page = PREVIEW_PAGES.find((p) => p.path === meta.previewPage)?.slug ?? previewSlugFor(meta.previewPage);
  const previewHref = kind === "project" && rec && (rec.data as ProjectData).writeup ? `/preview/work/${key}?t=${previewToken()}` : `/preview/${page}?t=${previewToken()}`;

  return (
    <Page
      title={isNew ? `New ${meta.label.toLowerCase()}` : meta.title(rec!.data as unknown as Record<string, unknown>)}
      sub={rec ? undefined : meta.description}
      actions={<><Link href={`/admin/content/${kind}`} className="text-sm text-mist underline hover:text-cream">← All {meta.plural.toLowerCase()}</Link>{rec && <StateBadge state={rec.state} />}</>}
    >
      {sp.saved && <p role="status" className="mb-4 rounded border border-emerald-600/50 bg-emerald-500/10 p-3 text-sm text-emerald-300">{sp.saved === "publish" ? "Published." : "Draft saved."}</p>}
      <Card>
        <RecordForm action={saveRecordAction} fields={meta.fields} values={values} tax={tax} hidden={{ kind, key: isNew ? "" : key }} existing={!isNew} allowDelete previewHref={isNew ? undefined : previewHref} />
      </Card>
      {slot && (
        <Card title={slot.label}>
          <div className="flex flex-wrap items-start gap-5">
            <div className="grid h-24 w-40 shrink-0 place-items-center overflow-hidden rounded border border-border bg-ink">
              {current ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={current} alt="" className="max-h-full max-w-full object-contain" /> : <span className="px-2 text-center text-xs text-amber-300">None yet. A labeled placeholder is showing on the site.</span>}
            </div>
            <div className="min-w-0 space-y-2">
              <p className="text-xs text-ash">{slot.hint}</p>
              <UploadButton slot={slot.path} kind={slot.kind} width={slot.width} height={slot.height} defaultAlt={String((rec?.data as unknown as Record<string, unknown>)?.name ?? (rec?.data as unknown as Record<string, unknown>)?.title ?? (rec?.data as unknown as Record<string, unknown>)?.client ?? "")} label={current ? `Replace ${slot.label.toLowerCase()}` : `Upload ${slot.label.toLowerCase()}`} />
              <p className="text-xs text-ash">Uploads go live right away; they don&rsquo;t need Publish.</p>
            </div>
          </div>
        </Card>
      )}
      {history.length > 0 && (
        <Card title="Recent changes">
          <ul className="divide-y divide-border text-sm">
            {history.map((a) => <li key={a.id} className="flex justify-between gap-4 py-2 text-mist"><span>{a.action} · {a.user}</span><span className="text-ash">{a.at}</span></li>)}
          </ul>
          <Link href="/admin/history" className="mt-2 inline-block text-xs text-mist underline hover:text-cream">Full history and revert</Link>
        </Card>
      )}
    </Page>
  );
}
