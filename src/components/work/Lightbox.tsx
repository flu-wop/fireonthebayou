"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { formatLabel, industryLabel, ytThumb } from "@/lib/catalog";
import type { WorkItem } from "./types";

/**
 * Lightbox with a lightweight YouTube embed: a thumbnail facade that only
 * loads the (privacy-enhanced) iframe when you press play, so one video plays
 * at a time. Records with several videos get a part switcher; clients with
 * more than one project get a row to jump between them.
 */
export default function Lightbox({
  item,
  siblings,
  hasPrev,
  hasNext,
  onClose,
  onNav,
  onOpen,
}: {
  item: WorkItem;
  siblings: WorkItem[];
  hasPrev: boolean;
  hasNext: boolean;
  onClose: () => void;
  onNav: (dir: -1 | 1) => void;
  onOpen: (slug: string) => void;
}) {
  const [part, setPart] = useState(0);
  const [playing, setPlaying] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  // New project -> back to its first video, facade state.
  useEffect(() => {
    setPart(0);
    setPlaying(false);
  }, [item.slug]);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
      prevFocus?.focus?.();
    };
  }, [lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft" && hasPrev) onNav(-1);
      else if (e.key === "ArrowRight" && hasNext) onNav(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onNav, hasPrev, hasNext]);

  const id = item.youtubeIds[part];
  const tags = [...item.formats.map(formatLabel), ...item.industries.map(industryLabel)];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title}, ${item.client}`}
      data-lenis-prevent
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink/95 px-4 py-16 backdrop-blur-sm md:items-center md:px-10"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <button ref={closeRef} type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border border-border text-cream transition-colors hover:border-flame md:right-8 md:top-6">
        <span aria-hidden className="text-xl leading-none">×</span>
      </button>

      <div className="w-full max-w-5xl">
        <div className="relative aspect-video overflow-hidden rounded-sm border border-border bg-bayou-deep">
          {playing && id ? (
            <iframe
              key={id}
              src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={`${item.title} — ${item.client}`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${item.title}`} className="group absolute inset-0 block w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {id && <img src={ytThumb(id)} alt="" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />}
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-20 w-20 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 ease-cinematic group-hover:scale-105">
                  <svg viewBox="0 0 16 16" className="ml-1 h-6 w-6" aria-hidden><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
                </span>
              </span>
            </button>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="text-sm text-mist">{item.client}</p>
            <h2 className="font-display text-3xl leading-[0.95] text-cream md:text-5xl">{item.title}</h2>
            <p className="mt-3 text-xs uppercase tracking-wider text-ash">{tags.join(" · ")}</p>
            {item.writeup && (
              <Link href={`/work/${item.slug}`} className="mt-4 inline-block text-sm text-cream underline decoration-cream/30 underline-offset-[6px] hover:decoration-flame">
                Enter the screening room →
              </Link>
            )}
          </div>

          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => onNav(-1)} disabled={!hasPrev} aria-label="Previous project" className="grid h-11 w-11 place-items-center rounded-full border border-border text-cream transition-colors enabled:hover:border-flame disabled:opacity-30">←</button>
            <button type="button" onClick={() => onNav(1)} disabled={!hasNext} aria-label="Next project" className="grid h-11 w-11 place-items-center rounded-full border border-border text-cream transition-colors enabled:hover:border-flame disabled:opacity-30">→</button>
          </div>
        </div>

        {item.youtubeIds.length > 1 && (
          <div className="mt-6" role="group" aria-label="Videos in this project">
            <p className="mb-2 text-[11px] uppercase tracking-wider text-ash">{item.youtubeIds.length} videos</p>
            <div className="flex flex-wrap gap-2">
              {item.youtubeIds.map((vid, i) => (
                <button key={vid} type="button" onClick={() => { setPart(i); setPlaying(false); }} aria-pressed={i === part} className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${i === part ? "border-flame bg-ember text-cream" : "border-border text-mist hover:text-cream"}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {siblings.length > 0 && (
          <div className="mt-6 border-t border-border pt-5">
            <p className="mb-2 text-[11px] uppercase tracking-wider text-ash">More from {item.client}</p>
            <div className="flex flex-wrap gap-2">
              {siblings.map((s) => (
                <button key={s.slug} type="button" onClick={() => onOpen(s.slug)} className="rounded-full border border-border px-4 py-2 text-[13px] text-mist transition-colors hover:border-flame hover:text-cream">
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
