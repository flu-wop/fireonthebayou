"use client";

import PlaceholderFrame, { type PlaceholderFrameProps } from "./PlaceholderFrame";
import { onYtImgError } from "@/lib/catalog";
import { cn } from "@/lib/utils";

/**
 * MediaView — presentational half of MediaSlot. Renders the real asset when
 * `present` is true, otherwise the labeled PlaceholderFrame. Safe in client
 * components: the server decides `present` (see MediaSlot / media-manifest).
 */
export type MediaViewProps = {
  /** Public path or URL of the real asset. */
  src?: string;
  /** Acceptable stand-in (e.g. the YouTube thumbnail) when `src` is absent. */
  fallbackSrc?: string;
  /** Whether `src` actually exists. */
  present: boolean;
  alt: string;
  kind?: "image" | "video";
  poster?: string;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
  placeholder: PlaceholderFrameProps;
};

export default function MediaView({ src, fallbackSrc, present, alt, kind = "image", poster, className, imgClassName, loading = "lazy", placeholder }: MediaViewProps) {
  const url = present ? src : fallbackSrc;
  if (!url) return <PlaceholderFrame {...placeholder} className={cn(placeholder.className, className)} />;

  if (kind === "video" && present) {
    return (
      <video
        src={url}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={alt}
        className={cn("h-full w-full object-cover", className)}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} loading={loading} decoding="async" onError={onYtImgError} className={cn("h-full w-full object-cover", className, imgClassName)} />
  );
}
