import { guard } from "../guard";
import { revertAction } from "../content/actions";
import { listAudit } from "@/lib/content/admin-store";
import { Page, btnGhost } from "@/components/admin/ui";
import { dbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

const REVERTABLE = /^(draft\.(save|create|delete)|publish|publish\.delete|revert)$/;

export default async function History({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  await guard();
  const { kind } = await searchParams;
  const rows = dbConfigured() ? (await listAudit(300)).filter((a) => !kind || a.kind === kind) : [];
  return (
    <Page title="History" sub="Every change, with who and when. Revert restores the earlier version as a draft; publish it to make it live.">
      <ul className="divide-y divide-border rounded border border-border bg-bayou text-sm">
        {rows.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="text-cream">{a.action}{a.kind && <span className="text-mist"> · {a.kind}{a.key ? `/${a.key}` : ""}</span>}</p>
              <p className="text-xs text-ash">{a.user} · {a.at} UTC</p>
            </div>
            {a.kind && a.key && a.kind !== "media" && a.kind !== "user" && REVERTABLE.test(a.action) && (a.before !== null || a.action === "draft.create") && (
              <form action={revertAction}><input type="hidden" name="id" value={a.id} /><button className={btnGhost}>Revert to before</button></form>
            )}
          </li>
        ))}
        {rows.length === 0 && <li className="px-4 py-6 text-mist">No history yet.</li>}
      </ul>
    </Page>
  );
}
