"use client";

/**
 * FilmArchive — the rest of the filmography, below the featured films.
 * A dense grid of stills; clicking one plays it in a full-screen viewer
 * (YouTube, privacy-enhanced). Escape or the close button ends playback.
 */
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";
import type { ArchiveFilm } from "@/lib/archive";

export default function FilmArchive({ films }: { films: ArchiveFilm[] }) {
  const [open, setOpen] = useState<ArchiveFilm | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  return (
    <section className="frame pb-28" aria-labelledby="filmography">
      <div className="mb-10 flex flex-col justify-between gap-4 border-t border-border pt-16 md:flex-row md:items-end">
        <h2 id="filmography" className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.9] text-cream">
          Filmography
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-mist">
          More from twenty years of commercials, brand films, and events. Pick one to watch.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {films.map((f) => (
          <li key={f.youtubeId}>
            <button
              type="button"
              onClick={() => setOpen(f)}
              className="group block w-full text-left"
              aria-label={`Play ${f.title} — ${f.client}`}
            >
              <span className="relative block aspect-video overflow-hidden rounded-sm bg-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${f.youtubeId}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full scale-[1.34] object-cover opacity-85 transition-all duration-700 ease-cinematic group-hover:scale-[1.4] group-hover:opacity-100"
                />
                <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-cream text-ink">
                    <svg viewBox="0 0 16 16" className="ml-0.5 h-3.5 w-3.5" aria-hidden>
                      <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="mt-3 block text-[13px] text-mist">{f.client}</span>
              <span className="block text-base font-semibold leading-snug text-cream transition-colors group-hover:text-flame">
                {f.title}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${open.title} — ${open.client}`}
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-black/95 px-4 pb-6 pt-4 md:px-10"
            onClick={() => setOpen(null)}
          >
            <div className="flex items-center justify-between gap-4 py-2" onClick={(e) => e.stopPropagation()}>
              <p className="min-w-0 truncate text-sm text-mist">
                {open.client} <span className="text-cream">· {open.title}</span>
              </p>
              <button
                type="button"
                autoFocus
                onClick={() => setOpen(null)}
                className="shrink-0 rounded-full border border-border px-4 py-2 text-sm text-cream transition-colors hover:border-flame"
              >
                Close
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <div className="aspect-video max-h-full w-full max-w-6xl">
                <iframe
                  title={`${open.title} — ${open.client}`}
                  src={`https://www.youtube-nocookie.com/embed/${open.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                  className="h-full w-full rounded-sm"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
