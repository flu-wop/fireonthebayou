import Link from "next/link";
import { guard } from "../guard";
import UploadButton from "@/components/admin/UploadButton";
import { Page } from "@/components/admin/ui";
import { GROUP_ORDER, buildManifest, summarize } from "@/lib/media-manifest";

export const dynamic = "force-dynamic";

const DOT = { filled: "bg-emerald-500", fallback: "bg-amber-400", empty: "bg-ember" } as const;

export default async function Placeholders({ searchParams }: { searchParams: Promise<{ all?: string }> }) {
  await guard();
  const { all: showAll } = await searchParams;
  const slots = await buildManifest();
  const total = summarize(slots);
  return (
    <Page title="Placeholders" sub="Every image or video slot on the site. Click Upload on an empty slot, choose the file, and it replaces the placeholder as soon as it's saved. YouTube slots are filled by editing the project or testimonial.">
      <div className="mb-8 grid max-w-xl grid-cols-3 gap-3">
        {[{ n: total.empty, l: "Empty" }, { n: total.fallback, l: "Using fallback" }, { n: total.filled, l: "Filled" }].map((s) => (
          <div key={s.l} className="rounded border border-border bg-bayou p-4"><p className="font-display text-3xl text-cream">{s.n}</p><p className="text-xs text-mist">{s.l}</p></div>
        ))}
      </div>
      <p className="mb-6 text-sm text-mist">{showAll ? <Link href="?" className="underline">Hide filled slots</Link> : <Link href="?all=1" className="underline">Show filled slots too</Link>}</p>
      <div className="space-y-10">
        {GROUP_ORDER.map((g) => {
          const rows = slots.filter((s) => s.group === g);
          if (!rows.length) return null;
          const sum = summarize(rows);
          const list = showAll ? rows : rows.filter((r) => r.status !== "filled");
          return (
            <section key={g}>
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2">
                <h2 className="font-display text-xl text-cream">{g}</h2>
                <p className="text-xs text-mist"><span className="text-flame">{sum.empty}</span> empty{sum.fallback ? ` · ${sum.fallback} fallback` : ""} · {rows.length} total</p>
              </div>
              <p className="mb-3 text-xs text-ash">{rows[0].size} · {rows[0].format}</p>
              {list.length === 0 ? <p className="text-sm text-mist">All filled.</p> : (
                <ul className="divide-y divide-border/60">
                  {list.map((s) => (
                    <li key={s.id} className="flex flex-wrap items-start justify-between gap-3 py-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT[s.status]}`} aria-hidden />
                        <div className="min-w-0 text-sm"><p className="text-cream">{s.label}{s.status === "fallback" && <span className="ml-2 text-xs text-mist">YouTube thumbnail in use</span>}</p><p className="break-words font-mono text-xs text-ash">{s.where}</p></div>
                      </div>
                      {s.upload ? (
                        <UploadButton slot={s.upload.path} kind={s.upload.kind} width={s.upload.width} height={s.upload.height} defaultAlt={s.label} label={s.status === "empty" ? "Upload" : "Replace"} />
                      ) : s.editHref ? (
                        <Link href={s.editHref} className="rounded border border-border px-4 py-2 text-sm text-cream hover:border-flame">Add YouTube ID</Link>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </Page>
  );
}
