import type { ReactNode } from "react";

export const inputCls = "w-full rounded border border-border bg-bayou px-3 py-2.5 text-sm text-cream outline-none focus:border-flame";
export const btn = "rounded bg-ember px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-flame-light disabled:opacity-60";
export const btnGhost = "rounded border border-border px-4 py-2 text-sm text-cream transition-colors hover:border-flame disabled:opacity-60";

export function Page({ title, sub, actions, children }: { title: string; sub?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-cream">{title}</h1>
          {sub && <p className="mt-1 max-w-2xl text-sm text-mist">{sub}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export const Card = ({ title, children }: { title?: string; children: ReactNode }) => (
  <section className="mb-6 rounded border border-border bg-bayou p-5">
    {title && <h2 className="mb-3 text-xs uppercase tracking-widest text-mist">{title}</h2>}
    {children}
  </section>
);

const STATE: Record<string, string> = { published: "text-emerald-400", edit: "text-amber-300", new: "text-sky-300", delete: "text-red-400" };
const STATE_LABEL: Record<string, string> = { published: "Published", edit: "Draft changes", new: "New draft", delete: "Pending delete" };
export const StateBadge = ({ state }: { state: string }) => <span className={`text-xs ${STATE[state] ?? "text-mist"}`}>{STATE_LABEL[state] ?? state}</span>;
