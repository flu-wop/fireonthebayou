"use client";

import { useState } from "react";
import MediaView from "@/components/media/MediaView";
import PlaceholderFrame from "@/components/media/PlaceholderFrame";
import { ytThumb } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export type StageItem = {
  slug: string;
  client: string;
  youtubeId: string | null;
  poster: string;
  posterPresent: boolean;
};

/**
 * A large video stage with a rail of nine client thumbnails below. Only one
 * video (one iframe) exists at a time; a slot with no YouTube ID yet shows a
 * labeled placeholder.
 */
export default function TestimonialStage({ items }: { items: StageItem[] }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const cur = items[i];
  const thumb = (t: StageItem) => (t.posterPresent ? t.poster : t.youtubeId ? ytThumb(t.youtubeId) : undefined);
  const stageImg = thumb(cur);

  return (
    <div>
      <div className="relative aspect-video overflow-hidden rounded-sm border border-border bg-bayou-deep">
        {playing && cur.youtubeId ? (
          <iframe
            key={cur.slug}
            src={`https://www.youtube-nocookie.com/embed/${cur.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={`${cur.client} testimonial`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : cur.youtubeId ? (
          <button type="button" onClick={() => setPlaying(true)} aria-label={`Play ${cur.client} testimonial`} className="group absolute inset-0 block w-full">
            {stageImg && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={stageImg} alt="" className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
            )}
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 ease-cinematic group-hover:scale-105">
                <svg viewBox="0 0 16 16" className="ml-1 h-6 w-6" aria-hidden><path d="M4 2.5v11l9-5.5z" fill="currentColor" /></svg>
              </span>
            </span>
            <span className="absolute bottom-4 left-5 font-display text-3xl text-cream md:text-5xl">{cur.client}</span>
          </button>
        ) : (
          <PlaceholderFrame
            variant="testimonial"
            label="VIDEO — YouTube ID"
            size="YouTube ID + 1280×720 JPG poster"
            where={`testimonials · ${cur.client} · /public${cur.poster}`}
            title={cur.client}
            aspect="aspect-auto"
            className="absolute inset-0 h-full rounded-none border-0"
          />
        )}
      </div>

      <ul className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2" aria-label="Client testimonials">
        {items.map((t, n) => (
          <li key={t.slug} className="w-40 shrink-0 md:w-48">
            <button
              type="button"
              onClick={() => { setI(n); setPlaying(false); }}
              aria-pressed={n === i}
              aria-label={t.client}
              className={cn("block w-full overflow-hidden rounded-sm border text-left transition-colors", n === i ? "border-flame" : "border-border hover:border-cream/50")}
            >
              <MediaView
                src={t.poster}
                fallbackSrc={t.youtubeId ? ytThumb(t.youtubeId) : undefined}
                present={t.posterPresent}
                alt=""
                placeholder={{ variant: "testimonial", compact: true, label: "VIDEO", size: "YouTube ID", where: `/public${t.poster}`, title: t.client, aspect: "aspect-video" }}
              />
            </button>
            <p className={cn("mt-2 text-xs", n === i ? "text-cream" : "text-mist")}>{t.client}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
