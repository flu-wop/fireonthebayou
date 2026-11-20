"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FEATURED_SLUGS, counts, filterCatalog, parseFilters, type Filters } from "@/lib/catalog";
import CatalogCard from "./CatalogCard";
import FilterBar from "./FilterBar";
import Lightbox from "./Lightbox";
import type { WorkItem } from "./types";

/** Filters + open project live in the URL: /work?format=tv&industry=food&p=<slug>. */
function writeUrl(f: Filters, open: string | null) {
  const q = new URLSearchParams();
  if (f.format) q.set("format", f.format);
  if (f.industry) q.set("industry", f.industry);
  if (open) q.set("p", open);
  const s = q.toString();
  window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
}

function Browser({ items }: { items: WorkItem[] }) {
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => parseFilters(params));
  const [open, setOpen] = useState<string | null>(() => params.get("p"));

  // Back/forward and shared links: re-read the URL when it changes under us.
  useEffect(() => {
    setFilters(parseFilters(params));
    setOpen(params.get("p"));
  }, [params]);

  const c = useMemo(() => counts(items), [items]);
  const visible = useMemo(() => filterCatalog(items, filters) as WorkItem[], [items, filters]);
  const filtered = Boolean(filters.format || filters.industry);
  const featured = useMemo(() => FEATURED_SLUGS.map((s) => items.find((i) => i.slug === s)).filter(Boolean) as WorkItem[], [items]);

  const change = useCallback((next: Filters) => {
    setFilters(next);
    writeUrl(next, null);
    setOpen(null);
  }, []);
  const openProject = useCallback((slug: string | null) => {
    setOpen(slug);
    writeUrl(filters, slug);
  }, [filters]);

  const current = open ? items.find((i) => i.slug === open) : undefined;
  // Prev/next walk the current (filtered) list; a project outside it stands alone.
  const list = visible.filter((i) => i.youtubeIds.length > 0);
  const idx = current ? list.findIndex((i) => i.slug === current.slug) : -1;
  const siblings = current ? items.filter((i) => i.client === current.client && i.slug !== current.slug && i.youtubeIds.length > 0) : [];

  return (
    <>
      {!filtered && (
        <section aria-labelledby="featured-title" className="mb-14">
          <h2 id="featured-title" className="eyebrow mb-5">Featured</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {featured.map((i) => (
              <CatalogCard key={i.slug} item={i} onOpen={openProject} layoutId={false} />
            ))}
          </ul>
        </section>
      )}

      <FilterBar filters={filters} counts={c} onChange={change} />

      <p className="mb-5 mt-5 text-sm text-mist" aria-live="polite">
        Showing <span className="text-cream">{visible.length}</span> of {c.total} projects
        {filtered && (
          <button type="button" onClick={() => change({ format: null, industry: null })} className="ml-3 text-flame underline underline-offset-4">
            Clear filters
          </button>
        )}
      </p>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-mist">No projects match that combination yet.</p>
      ) : (
        <motion.ul layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((i) => (
              <CatalogCard key={i.slug} item={i} onOpen={openProject} />
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      {current && (
        <Lightbox
          item={current}
          siblings={siblings}
          hasPrev={idx > 0}
          hasNext={idx >= 0 && idx < list.length - 1}
          onClose={() => openProject(null)}
          onNav={(d) => idx >= 0 && openProject(list[idx + d].slug)}
          onOpen={openProject}
        />
      )}
    </>
  );
}

export default function WorkBrowser({ items }: { items: WorkItem[] }) {
  return (
    <Suspense fallback={null}>
      <Browser items={items} />
    </Suspense>
  );
}
