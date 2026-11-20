import Link from "next/link";
import { guard } from "./guard";
import { dbConfigured } from "@/lib/db";
import { previewToken } from "@/lib/admin-auth";
import { pendingChanges } from "@/lib/content/admin-store";
import { PREVIEW_PAGES } from "@/lib/preview-pages";
import { KINDS } from "@/lib/content/forms";
import { Card, Page, StateBadge, btn, btnGhost } from "@/components/admin/ui";
import { discardAllAction, publishAllAction, seedAction } from "./content/actions";

export const dynamic = "force-dynamic";

const FLASH: Record<string, (v: string) => string> = {
  published: (v) => `Published ${v} change(s). The site is refreshing.`,
  seeded: (v) => `Seeded ${v} record(s) from the files.`,
  reverted: (v) => `Restored ${decodeURIComponent(v)} as a draft. Publish to make it live.`,
  discarded: () => "All drafts discarded.",
};

export default async function AdminHome({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const user = await guard();
  const sp = await searchParams;
  const flash = Object.keys(FLASH).find((k) => sp[k] !== undefined);
  const hasDb = dbConfigured();
  const pending = hasDb ? await pendingChanges().catch(() => []) : [];
  const token = previewToken();

  return (
    <Page title="Overview" sub="Edit content, preview it, then publish. Nothing changes on the live site until you publish.">
      {flash && <p role="status" className="mb-6 rounded border border-emerald-600/50 bg-emerald-500/10 p-3 text-sm text-emerald-300">{FLASH[flash](sp[flash])}</p>}
      {!hasDb && <p className="mb-6 rounded border border-flame/50 bg-flame/10 p-3 text-sm text-flame-light">The database isn&rsquo;t configured (TURSO_URL). The site is showing the built-in seed content and edits can&rsquo;t be saved.</p>}

      <Card title={`Unpublished changes (${pending.length})`}>
        {pending.length === 0 ? (
          <p className="text-sm text-mist">Nothing waiting. Everything you&rsquo;ve edited is live.</p>
        ) : (
          <>
            <ul className="mb-4 divide-y divide-border">
              {pending.map((p) => (
                <li key={`${p.kind}/${p.key}`} className="flex items-center justify-between gap-4 py-2 text-sm">
                  <Link href={p.kind === "setting" ? (p.key === "taxonomy" ? "/admin/taxonomy" : "/admin/settings") : p.kind === "page_seo" ? "/admin/seo" : `/admin/content/${p.kind}/${encodeURIComponent(p.key)}`} className="text-cream hover:text-flame">
                    {(KINDS[p.kind]?.label ?? p.kind)}: {p.label}
                  </Link>
                  <StateBadge state={p.state} />
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <form action={publishAllAction}><button className={btn}>Publish all</button></form>
              <form action={discardAllAction}><button className={btnGhost}>Discard all drafts</button></form>
            </div>
          </>
        )}
      </Card>

      <Card title="Preview with unpublished changes">
        <p className="mb-3 text-xs text-ash">These links show the real site with your drafts and work for 7 days. Share them with anyone who needs to review.</p>
        <ul className="flex flex-wrap gap-2">
          {PREVIEW_PAGES.map((p) => (
            <li key={p.slug}><a href={`/preview/${p.slug}?t=${token}`} target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-4 py-1.5 text-sm text-mist hover:border-flame hover:text-cream">{p.label} ↗</a></li>
          ))}
        </ul>
      </Card>

      {user.role === "owner" && hasDb && (
        <Card title="Seed the database from the files">
          <p className="mb-3 text-sm text-mist">Loads data/fotb-catalog.json and the existing content files (crew, services, process, FAQ, settings) into the database. Existing records are kept unless you overwrite.</p>
          <form action={seedAction} className="flex flex-wrap items-center gap-4">
            <button className={btnGhost}>Seed from files</button>
            <label className="flex items-center gap-2 text-xs text-ash"><input type="checkbox" name="overwrite" className="accent-[#D01146]" /> Overwrite existing records</label>
          </form>
        </Card>
      )}
    </Page>
  );
}
