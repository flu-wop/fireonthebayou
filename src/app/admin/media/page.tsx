import { guard } from "../guard";
import { deleteMediaAction, saveAltAction, toggleMediaAction } from "./actions";
import UploadButton from "@/components/admin/UploadButton";
import { Card, Page, btnGhost, inputCls } from "@/components/admin/ui";
import { dbConfigured } from "@/lib/db";
import { listMedia } from "@/lib/media-store";

export const dynamic = "force-dynamic";

export default async function Media() {
  await guard();
  const rows = dbConfigured() ? await listMedia() : [];
  return (
    <Page title="Media library" sub="Everything uploaded through admin, stored in Vercel Blob. Images are resized automatically. Files assigned to a slot replace that placeholder or /public file site-wide.">
      <Card title="Add to the library"><UploadButton kind="image" width={2000} height={2000} label="Upload image" /><p className="mt-2 text-xs text-ash">Library uploads aren&rsquo;t tied to a slot. Use the URL in a field such as an SEO link-preview image.</p></Card>
      <ul className="grid gap-4 sm:grid-cols-2">
        {rows.map((m) => (
          <li key={m.id} className={`rounded border bg-bayou p-4 ${m.active ? "border-border" : "border-border/50 opacity-60"}`}>
            <div className="flex gap-4">
              <div className="grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded bg-ink">
                {m.contentType.startsWith("video") ? <span className="text-xs text-mist">video</span> : /* eslint-disable-next-line @next/next/no-img-element */ <img src={m.url} alt={m.alt} className="max-h-full max-w-full object-contain" />}
              </div>
              <div className="min-w-0 text-xs text-mist">
                <p className="break-all font-mono text-ash">{m.slot ?? "library"}</p>
                <p>{m.width && m.height ? `${m.width}×${m.height} · ` : ""}{Math.round(m.bytes / 1024)} KB · {m.active ? "in use" : "inactive"}</p>
                <p className="truncate">{m.createdBy} · {m.createdAt}</p>
                <a href={m.url} target="_blank" rel="noopener noreferrer" className="underline">Open</a>
              </div>
            </div>
            <form action={saveAltAction} className="mt-3 flex gap-2"><input type="hidden" name="id" value={m.id} /><input name="alt" defaultValue={m.alt} placeholder="Alt text" aria-label="Alt text" className={inputCls} /><button className={btnGhost}>Save</button></form>
            <div className="mt-3 flex flex-wrap gap-2">
              {m.slot && <form action={toggleMediaAction}><input type="hidden" name="id" value={m.id} /><button name="intent" value={m.active ? "deactivate" : "activate"} className={btnGhost}>{m.active ? "Stop using" : "Use this"}</button></form>}
              <form action={deleteMediaAction}><input type="hidden" name="id" value={m.id} /><button className="text-sm text-red-400 underline">Delete file</button></form>
            </div>
          </li>
        ))}
        {rows.length === 0 && <li className="text-sm text-mist">No uploads yet.</li>}
      </ul>
    </Page>
  );
}
