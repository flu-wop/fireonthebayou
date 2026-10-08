"use client";

/**
 * YouTubeBackdrop
 * ---------------
 * A YouTube video used as a silent, looping, full-cover background — the hero
 * reel. It stays invisible until the film is actually moving (so YouTube's
 * title card never flashes), and the poster sits underneath the whole time.
 *
 * The parent can roll sound through a ref: `rollSound()` restarts the reel
 * from the top with audio, `cut()` mutes it back to the ambient loop. Call
 * these from a click handler so mobile browsers allow the audio.
 *
 * Reduced-motion visitors get the poster only.
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { loadYouTubeAPI, YT_ENDED, YT_PLAYING, type YTPlayer } from "@/lib/youtube";
import { cn } from "@/lib/utils";

export type BackdropHandle = {
  rollSound(): void;
  cut(): void;
};

type Props = {
  youtubeId: string;
  poster: string;
  /** Seconds to start the ambient loop at (skips slates / fade-ins). */
  start?: number;
  className?: string;
  /** Fired once the player can take commands. */
  onReady?: () => void;
  /** Fired when the reel finishes with sound and drops back to silent. */
  onSoundEnd?: () => void;
};

const YouTubeBackdrop = forwardRef<BackdropHandle, Props>(function YouTubeBackdrop(
  { youtubeId, poster, start = 0, className, onReady, onSoundEnd },
  ref
) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const soundRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const cb = useRef({ onReady, onSoundEnd });
  cb.current = { onReady, onSoundEnd };

  useImperativeHandle(ref, () => ({
    rollSound() {
      const p = playerRef.current;
      if (!p) return;
      soundRef.current = true;
      p.seekTo(0, true);
      p.unMute();
      p.setVolume(100);
      p.playVideo();
    },
    cut() {
      const p = playerRef.current;
      if (!p) return;
      soundRef.current = false;
      p.mute();
      p.playVideo();
    },
  }));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !mountRef.current) return;
      const target = document.createElement("div");
      mountRef.current.appendChild(target);
      playerRef.current = new YT.Player(target, {
        host: "https://www.youtube-nocookie.com",
        videoId: youtubeId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          start,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            if (cancelled) return;
            e.target.mute();
            e.target.playVideo();
            cb.current.onReady?.();
          },
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            if (e.data === YT_PLAYING) {
              // A beat of grace so any YouTube overlay has cleared.
              setTimeout(() => !cancelled && setPlaying(true), 400);
            }
            if (e.data === YT_ENDED) {
              e.target.mute();
              e.target.seekTo(start, true);
              e.target.playVideo();
              if (soundRef.current) {
                soundRef.current = false;
                cb.current.onSoundEnd?.();
              }
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [youtubeId, start]);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden [container-type:size]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div
        ref={mountRef}
        className={cn(
          "absolute left-1/2 top-1/2 h-[max(100cqh,56.25cqw)] w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[1500ms]",
          "[&_iframe]:h-full [&_iframe]:w-full",
          playing ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
});

export default YouTubeBackdrop;
