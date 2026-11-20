import { guard } from "../guard";
import { retryMailchimpAction, setStatusAction } from "./actions";
import { Page, btnGhost } from "@/components/admin/ui";
import { ensureInquiriesTable } from "@/lib/inquiries";
import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";

const MC: Record<string, { label: string; cls: string }> = {
  synced: { label: "In Mailchimp", cls: "text-emerald-400" },
  failed: { label: "Mailchimp failed", cls: "text-red-400" },
  skipped: { label: "Not opted in", cls: "text-ash" },
  not_configured: { label: "Mailchimp not set up", cls: "text-amber-300" },
};

export default async function Inbox({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await guard();
  const { status } = await searchParams;
  let rows: Record<string, unknown>[] = [];
  let err = "";
  try {
    await ensureInquiriesTable();
    const r = await getDB()!.execute({ sql: `SELECT * FROM fotb_inquiries ${status === "new" || status === "replied" ? "WHERE status = ?" : ""} ORDER BY id DESC LIMIT 500`, args: status === "new" || status === "replied" ? [status] : [] });
    rows = r.rows as unknown as Record<string, unknown>[];
  } catch (e) {
    err = e instanceof Error ? e.message : "Database unavailable.";
  }
  const tab = (s: string | undefined, label: string) => <a href={s ? `?status=${s}` : "?"} className={`rounded-full border px-4 py-1.5 text-sm ${status === s || (!status && !s) ? "border-flame text-cream" : "border-border text-mist hover:text-cream"}`}>{label}</a>;
  return (
    <Page title="Inbox" sub="Every Let's Talk inquiry, saved before anything else happens." actions={<a href="/api/admin/inbox.csv" className={btnGhost}>Export CSV</a>}>
      <div className="mb-5 flex gap-2">{tab(undefined, "All")}{tab("new", "New")}{tab("replied", "Replied")}</div>
      {rows.length >= 500 && <p className="mb-4 text-xs text-amber-300">Showing the latest 500. Use Export CSV for everything.</p>}
      {err && <p role="alert" className="mb-4 text-sm text-flame-light">{err}</p>}
      <ul className="space-y-4">
        {rows.map((q) => {
          const mc = MC[String(q.mc_status)] ?? MC.skipped;
          const replied = q.status === "replied";
          return (
            <li key={String(q.id)} className="rounded border border-border bg-bayou p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-cream">{String(q.name)} <a href={`mailto:${String(q.email)}`} className="text-sm text-mist underline">{String(q.email)}</a></p>
                  <p className="text-xs text-ash">{String(q.created_at)} UTC · {String(q.budget || "no budget")}{q.phone ? ` · ${String(q.phone)}` : ""}</p>
                </div>
                <span className={`text-xs ${mc.cls}`}>{mc.label}</span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-mist">{String(q.message)}</p>
              {q.mc_error ? <p className="mt-2 break-words text-xs text-red-400">{String(q.mc_error)}</p> : null}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <form action={setStatusAction}><input type="hidden" name="id" value={String(q.id)} /><button name="status" value={replied ? "new" : "replied"} className={btnGhost}>{replied ? "Mark as new" : "Mark replied"}</button></form>
                {Number(q.opt_in) === 1 && q.mc_status !== "synced" && <form action={retryMailchimpAction}><input type="hidden" name="id" value={String(q.id)} /><button className={btnGhost}>Retry Mailchimp</button></form>}
                <span className={`text-xs ${replied ? "text-emerald-400" : "text-amber-300"}`}>{replied ? "Replied" : "New"}</span>
              </div>
            </li>
          );
        })}
        {rows.length === 0 && !err && <li className="rounded border border-border bg-bayou p-6 text-sm text-mist">No inquiries yet.</li>}
      </ul>
    </Page>
  );
}
