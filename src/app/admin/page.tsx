import Link from "next/link";
import { guard } from "./guard";
import { dbConfigured, getDB } from "@/lib/db";
import { previewToken } from "@/lib/admin-auth";
import { pendingChanges } from "@/lib/content/admin-store";
import { KINDS } from "@/lib/content/forms";
import { ensureInquiriesTable } from "@/lib/inquiries";
import { getInsights } from "@/lib/insights/core";
import { insightsConfig } from "@/lib/insights/config";
import { buildManifest, summarize } from "@/lib/media-manifest";
import { checkEnvVars } from "@/lib/health-checks";
import { PREVIEW_PAGES } from "@/lib/preview-pages";
import { ADMIN_SECTIONS } from "@/components/admin/sections";
import { Card, StateBadge, btn, btnGhost } from "@/components/admin/ui";
import { discardAllAction, publishAllAction, seedAction } from "./content/actions";

export const dynamic = "force-dynamic";

const FLASH: Record<string, (v: string) => string> = {
  published: (v) => `Published ${v} change(s). The site is refreshing.`,
  seeded: (v) => `Seeded ${v} record(s) from the files.`,
  reverted: (v) => `Restored ${decodeURIComponent(v)} as a draft. Publish to make it live.`,
  discarded: () => "All drafts discarded.",
};

const TZ = "America/Chicago";
function greeting() {
  const now = new Date();
  const hour = Number(new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hour12: false }).format(now)) % 24;
  const date = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "long", month: "long", day: "numeric" }).format(now);
  return { date, hello: hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening" };
}

function Tile({ label, value, cur, prev, href }: { label: string; value?: string; cur: number; prev?: number; href?: string }) {
  const pct = prev === undefined ? null : prev === 0 ? (cur > 0 ? 100 : 0) : Math.round(((cur - prev) / prev) * 100);
  const body = (
    <div className="rounded border border-border bg-bayou p-4">
      <p className="text-xs uppercase tracking-wider text-mist">{label}</p>
      <p className="mt-1 font-display text-3xl text-cream">{value ?? cur.toLocaleString("en-US")}</p>
      {pct !== null && <p className={`mt-1 text-xs ${pct >= 0 ? "text-emerald-400" : "text-red-400"}`}>{pct >= 0 ? "▲" : "▼"} {Math.abs(pct)}% vs prior 30 days</p>}
    </div>
  );
  return href ? <Link href={href} className="block transition-colors hover:[&>div]:border-flame">{body}</Link> : body;
}

export default async function AdminHome({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  await guard();
  const sp = await searchParams;
  const flash = Object.keys(FLASH).find((k) => sp[k] !== undefined);
  const hasDb = dbConfigured();
  const { date, hello } = greeting();
  const token = previewToken();

  const pending = hasDb ? await pendingChanges().catch(() => []) : [];
  let insights: Awaited<ReturnType<typeof getInsights>> | null = null;
  let inquiries: Record<string, unknown>[] = [];
  let inqStats = { cur: 0, prev: 0, newCount: 0, failed: 0 };
  if (hasDb) {
    try { insights = await getInsights(getDB()!, insightsConfig, 30); } catch { insights = null; }
    try {
      await ensureInquiriesTable();
      const db = getDB()!;
      const n = async (sql: string) => Number((await db.execute(sql)).rows[0].n);
      inqStats = {
        cur: await n("SELECT COUNT(*) AS n FROM fotb_inquiries WHERE created_at >= datetime('now','-30 days')"),
        prev: await n("SELECT COUNT(*) AS n FROM fotb_inquiries WHERE created_at >= datetime('now','-60 days') AND created_at < datetime('now','-30 days')"),
        newCount: await n("SELECT COUNT(*) AS n FROM fotb_inquiries WHERE status = 'new'"),
        failed: await n("SELECT COUNT(*) AS n FROM fotb_inquiries WHERE mc_status = 'failed'"),
      };
      inquiries = (await db.execute("SELECT id, name, email, budget, message, status, created_at FROM fotb_inquiries ORDER BY id DESC LIMIT 6")).rows as unknown as Record<string, unknown>[];
    } catch { /* tiles fall back to zeros */ }
  }
  const slots = summarize(await buildManifest().catch(() => []));
  const missingEnv = checkEnvVars().filter((v) => v.required && !v.set).length;

  const attention: { label: string; href: string }[] = [];
  if (!hasDb) attention.push({ label: "The database isn't configured (TURSO_URL). The site shows built-in content and edits can't be saved.", href: "/admin/system" });
  if (inqStats.newCount) attention.push({ label: `${inqStats.newCount} new inquir${inqStats.newCount === 1 ? "y" : "ies"} waiting for a reply`, href: "/admin/inbox?status=new" });
  if (inqStats.failed) attention.push({ label: `${inqStats.failed} Mailchimp sync${inqStats.failed === 1 ? "" : "s"} failed`, href: "/admin/inbox" });
  if (pending.length) attention.push({ label: `${pending.length} unpublished change${pending.length === 1 ? "" : "s"}`, href: "#publishing" });
  if (missingEnv && hasDb) attention.push({ label: `${missingEnv} required environment variable${missingEnv === 1 ? " is" : "s are"} missing`, href: "/admin/system" });

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <p className="text-xs uppercase tracking-widest text-mist">{date}</p>
      <h1 className="mb-6 font-display text-4xl text-cream">{hello}.</h1>

      {flash && <p role="status" className="mb-6 rounded border border-emerald-600/50 bg-emerald-500/10 p-3 text-sm text-emerald-300">{FLASH[flash](sp[flash])}</p>}

      {attention.length > 0 && (
        <ul className="mb-8 space-y-2" aria-label="Needs attention">
          {attention.map((a) => (
            <li key={a.label}><Link href={a.href} className="flex items-center gap-3 rounded border border-flame/50 bg-flame/10 px-4 py-3 text-sm text-flame-light hover:bg-flame/20"><span aria-hidden>●</span>{a.label}<span className="ml-auto">→</span></Link></li>
          ))}
        </ul>
      )}

      <div className="mb-3 flex items-baseline justify-between"><h2 className="text-xs uppercase tracking-widest text-mist">Last 30 days</h2><Link href="/admin/insights" className="text-sm text-mist underline hover:text-cream">All insights</Link></div>
      <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Visitors" cur={insights?.visitors.cur ?? 0} prev={insights?.visitors.prev} href="/admin/insights" />
        <Tile label="Page views" cur={insights?.pageviews.cur ?? 0} prev={insights?.pageviews.prev} href="/admin/insights?tab=pages" />
        <Tile label="Inquiries" cur={inqStats.cur} prev={inqStats.prev} href="/admin/inbox" />
        <Tile label="Placeholders left" cur={slots.empty} href="/admin/placeholders" />
      </div>
      {hasDb && !insights && <p className="-mt-6 mb-8 text-xs text-ash">Visitor numbers couldn&rsquo;t load. Tracking starts once the site has traffic.</p>}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <section className="min-w-0 lg:col-span-2" aria-labelledby="recent">
          <h2 id="recent" className="mb-3 text-xs uppercase tracking-widest text-mist">Recent inquiries</h2>
          <ul className="divide-y divide-border rounded border border-border bg-bayou">
            {inquiries.map((q) => (
              <li key={String(q.id)}>
                <Link href="/admin/inbox" className="block px-4 py-3 hover:bg-bayou-deep">
                  <p className="flex justify-between gap-3 text-sm"><span className="truncate text-cream">{String(q.name)}</span><span className={`shrink-0 text-xs ${q.status === "new" ? "text-amber-300" : "text-emerald-400"}`}>{q.status === "new" ? "New" : "Replied"}</span></p>
                  <p className="truncate text-xs text-mist">{String(q.message)}</p>
                  <p className="text-xs text-ash">{String(q.created_at)} UTC{q.budget ? ` · ${String(q.budget)}` : ""}</p>
                </Link>
              </li>
            ))}
            {inquiries.length === 0 && <li className="px-4 py-6 text-sm text-mist">No inquiries yet.</li>}
          </ul>
          <Link href="/admin/inbox" className="mt-2 inline-block text-sm text-mist underline hover:text-cream">All inquiries</Link>
        </section>

        <section className="min-w-0 lg:col-span-3" aria-labelledby="goto">
          <h2 id="goto" className="mb-3 text-xs uppercase tracking-widest text-mist">Go to</h2>
          <Link href="/admin/insights" className="mb-3 block rounded border border-flame/60 bg-flame/10 p-4 transition-colors hover:bg-flame/20"><p className="font-display text-xl text-cream">Insights</p><p className="text-sm text-mist">Visitors, top pages and the inquiry funnel.</p></Link>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {ADMIN_SECTIONS.map((s) => (
              <Link key={s.href} href={s.href} className="rounded border border-border bg-bayou p-4 transition-colors hover:border-flame"><p className="font-display text-lg text-cream">{s.title}</p><p className="text-xs text-mist">{s.desc}</p></Link>
            ))}
          </div>
          <a href="/" target="_blank" rel="noopener noreferrer" className={`${btnGhost} mt-4 inline-block`}>View site ↗</a>
        </section>
      </div>

      <div id="publishing" className="mt-12 scroll-mt-6">
        <Card title={`Unpublished changes (${pending.length})`}>
          {pending.length === 0 ? (
            <p className="text-sm text-mist">Nothing waiting. Everything you&rsquo;ve edited is live.</p>
          ) : (
            <>
              <ul className="mb-4 divide-y divide-border">
                {pending.map((p) => (
                  <li key={`${p.kind}/${p.key}`} className="flex items-center justify-between gap-4 py-2 text-sm">
                    <Link href={p.kind === "setting" ? (p.key === "taxonomy" ? "/admin/taxonomy" : "/admin/settings") : p.kind === "page_seo" ? "/admin/seo" : `/admin/content/${p.kind}/${encodeURIComponent(p.key)}`} className="text-cream hover:text-flame">{KINDS[p.kind]?.label ?? p.kind}: {p.label}</Link>
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

        {hasDb && (
          <Card title="Seed the database from the files">
            <p className="mb-3 text-sm text-mist">Loads data/fotb-catalog.json and the existing content files into the database. Existing records are kept unless you overwrite.</p>
            <form action={seedAction} className="flex flex-wrap items-center gap-4">
              <button className={btnGhost}>Seed from files</button>
              <label className="flex items-center gap-2 text-xs text-ash"><input type="checkbox" name="overwrite" className="accent-[#D01146]" /> Overwrite existing records</label>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
