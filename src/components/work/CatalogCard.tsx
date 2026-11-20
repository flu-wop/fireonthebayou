"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import MediaView from "@/components/media/MediaView";
import { FilmStrip } from "@/components/media/PlaceholderFrame";
import { formatLabel, industryLabel, ytThumb } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { WorkItem } from "./types";

/**
 * A contact-sheet frame: 16:9 with film-strip edges. Hover (desktop, when a
 * preview clip exists) plays it muted; otherwise the poster zooms slowly.
 * Projects with no YouTube ID show a labeled placeholder and are not links.
 */
export default function CatalogCard({ item, onOpen, layoutId }: { item: WorkItem; onOpen: (slug: string) => void; layoutId?: boolean }) {
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const hasVideo = item.youtubeIds.length > 0;
  const poster = `/images/work-${item.slug}.jpg`;
  const fallback = hasVideo ? ytThumb(item.youtubeIds[0]) : undefined;
  const showsImage = item.posterPresent || Boolean(fallback);
  const tags = [...item.formats.map(formatLabel), ...item.industries.map(industryLabel)];

  function enter() {
    if (!item.previewPresent || !window.matchMedia("(hover: hover)").matches || reduce) return;
    setHover(true);
    videoRef.current?.play().catch(() => {});
  }
  function leave() {
    setHover(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  }

  const frame = (
    <div
      className="relative aspect-video overflow-hidden rounded-sm border border-border bg-card"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <MediaView
        src={poster}
        fallbackSrc={fallback}
        present={item.posterPresent}
        alt={`${item.title} — ${item.client}`}
        imgClassName={cn(
          "transition-transform duration-[1400ms] ease-cinematic",
          !reduce && "scale-100 group-hover:scale-[1.06]",
          hover && "opacity-0"
        )}
        placeholder={{
          variant: "project",
          label: "POSTER 1280×720",
          size: "1280×720 JPG · video link also needed",
          where: `/public${poster} · Project > YouTube ID`,
          title: item.title,
          subtitle: item.client,
          tags,
        }}
      />
      {item.previewPresent && (
        <video ref={videoRef} muted loop playsInline preload="none" className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-500", hover ? "opacity-100" : "opacity-0")}>
          <source src={`/video/work-${item.slug}.mp4`} type="video/mp4" />
        </video>
      )}

      {showsImage && (
        <>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
          <FilmStrip side="left" />
          <FilmStrip side="right" />
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
            <p className="text-xs text-mist">{item.client}</p>
            <h3 className="font-display text-xl leading-[0.95] text-cream md:text-2xl">{item.title}</h3>
            {!hasVideo && <p className="mt-1.5 text-[10px] uppercase tracking-wider text-ash">Video coming soon</p>}
            {item.youtubeIds.length > 1 && <p className="mt-1.5 text-[10px] uppercase tracking-wider text-flame">{item.youtubeIds.length} videos</p>}
          </div>
        </>
      )}
    </div>
  );

  const body = hasVideo ? (
    <button
      type="button"
      onClick={() => onOpen(item.slug)}
      aria-label={`Play ${item.title}, ${item.client}`}
      className="group block w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-flame"
    >
      {frame}
    </button>
  ) : (
    <div className="group">{frame}</div>
  );

  return (
    <motion.li
      layout={reduce ? false : layoutId === false ? false : "position"}
      initial={reduce ? false : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="list-none"
    >
      {body}
    </motion.li>
  );
}
