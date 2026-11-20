import type { Metadata } from "next";
import { GROUP_ORDER, buildManifest, summarize, type Slot } from "@/lib/media-manifest";

export const metadata: Metadata = {
  title: "Placeholders",
  robots: { index: false, follow: false },
};

// Built per deploy: the report reflects the files present in /public.
export const dynamic = "force-static";

const DOT: Record<Slot["status"], string> = { filled: "bg-emerald-500", fallback: "bg-amber-400", empty: "bg-ember" };

export default function PlaceholdersPage() {
  const slots = buildManifest();
  const all = summarize(slots);

  return (
    <div className="frame pb-32 pt-32 md:pt-44">
      <p className="eyebrow mb-4">Hidden · not indexed</p>
      <h1 className="font-display text-[clamp(2.4rem,7vw,5rem)] leading-[0.9] text-cream">
        Placeholders <span className="text-flame">to fill</span>
      </h1>
      <p className="mt-6 max-w-2xl text-mist">
        Every empty image or video slot on the site, with its exact size and where it goes. Add the file (or the YouTube
        ID) and the placeholder is replaced on the next deploy.
      </p>

      <div className="mt-10 grid grid-cols-3 gap-4 sm:max-w-xl">
        {[
          { n: all.empty, l: "Empty" },
          { n: all.fallback, l: "Using fallback" },
          { n: all.filled, l: "Filled" },
        ].map((s) => (
          <div key={s.l} className="rounded-sm border border-border bg-bayou p-4">
            <p className="font-display text-4xl text-cream">{s.n}</p>
            <p className="text-xs text-mist">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 space-y-14">
        {GROUP_ORDER.map((group) => {
          const rows = slots.filter((s) => s.group === group);
          if (!rows.length) return null;
          const sum = summarize(rows);
          const todo = rows.filter((r) => r.status !== "filled");
          return (
            <section key={group} aria-labelledby={`g-${group}`}>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
                <h2 id={`g-${group}`} className="font-display text-2xl text-cream">{group}</h2>
                <p className="text-sm text-mist">
                  <span className="text-flame">{sum.empty}</span> empty
                  {sum.fallback > 0 && <> · {sum.fallback} on fallback</>} · {rows.length} total
                </p>
              </div>
              <p className="mb-4 text-xs text-ash">
                {rows[0].size} · {rows[0].format}
              </p>
              {todo.length === 0 ? (
                <p className="text-sm text-mist">All filled.</p>
              ) : (
                <ul className="grid gap-x-8 sm:grid-cols-2">
                  {todo.map((s) => (
                    <li key={s.id} className="flex items-start gap-3 border-b border-border/60 py-2.5">
                      <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT[s.status]}`} aria-hidden />
                      <div className="min-w-0 text-sm">
                        <p className="text-cream">
                          {s.label}
                          {s.status === "fallback" && <span className="ml-2 text-xs text-mist">YouTube thumbnail in use</span>}
                        </p>
                        <p className="break-words font-mono text-xs text-ash">{s.where}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
