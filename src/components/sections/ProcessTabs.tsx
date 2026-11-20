"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Tabbed layout for /process: "The Process" and "Post-Production". The active
 * tab follows the URL hash (#post-production) so a tab can be linked to.
 */
const TABS = [
  { id: "process", label: "The Process" },
  { id: "post-production", label: "Post-Production" },
] as const;

export default function ProcessTabs({ process, post }: { process: ReactNode; post: ReactNode }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("process");

  useEffect(() => {
    const read = () => setTab(window.location.hash === "#post-production" ? "post-production" : "process");
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  function select(id: (typeof TABS)[number]["id"]) {
    setTab(id);
    window.history.replaceState(null, "", id === "process" ? window.location.pathname : `#${id}`);
  }

  function onKey(e: React.KeyboardEvent, i: number) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length].id;
    select(next);
    document.getElementById(`tab-${next}`)?.focus();
  }

  return (
    <div>
      <div className="frame">
        <div role="tablist" aria-label="Process sections" className="flex gap-2 border-b border-border">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              id={`tab-${t.id}`}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              aria-controls={`panel-${t.id}`}
              tabIndex={tab === t.id ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={cn(
                "-mb-px border-b-2 px-5 py-4 text-[15px] font-semibold tracking-wide transition-colors",
                tab === t.id ? "border-flame text-cream" : "border-transparent text-mist hover:text-cream"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <div id="panel-process" role="tabpanel" aria-labelledby="tab-process" hidden={tab !== "process"}>{process}</div>
      <div id="panel-post-production" role="tabpanel" aria-labelledby="tab-post-production" hidden={tab !== "post-production"}>{post}</div>
    </div>
  );
}
