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
 * Sharpness: YouTube starts muted embeds at a low quality and ramps up, and
 * there's no supported way to force HD. So the film stays hidden behind the
 * poster until YouTube reports an HD stream (or ~6s pass). For a guaranteed
 * crisp loop, pass `mp4` — a self-hosted file — and YouTube isn't used at all.
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
  /** Optional self-hosted file (e.g. /video/hero-reel.mp4). Overrides YouTube. */
  mp4?: string;
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
  { youtubeId, mp4, poster, start = 0, className, onReady, onSoundEnd },
  ref
) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const cb = useRef({ onReady, onSoundEnd });
  cb.current = { onReady, onSoundEnd };

  useImperativeHandle(ref, () => ({
    rollSound() {
      const v = videoRef.current;
      if (v) {
        soundRef.current = true;
        v.loop = false;
        v.currentTime = 0;
        v.muted = false;
        v.volume = 1;
        v.play().catch(() => {});
        return;
      }
      const p = playerRef.current;
      if (!p) return;
      soundRef.current = true;
      p.seekTo(0, true);
      p.unMute();
      p.setVolume(100);
      p.playVideo();
    },
    cut() {
      const v = videoRef.current;
      if (v) {
        soundRef.current = false;
        v.muted = true;
        v.loop = true;
        v.play().catch(() => {});
        return;
      }
      const p = playerRef.current;
      if (!p) return;
      soundRef.current = false;
      p.mute();
      p.playVideo();
    },
  }));

  // ---- Self-hosted file ----
  useEffect(() => {
    if (!mp4) return;
    const v = videoRef.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.pause();
      return;
    }
    v.play().catch(() => {});
    cb.current.onReady?.();
  }, [mp4]);

  function onFileEnded() {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.loop = true;
    v.currentTime = start;
    v.play().catch(() => {});
    if (soundRef.current) {
      soundRef.current = false;
      cb.current.onSoundEnd?.();
    }
  }

  // ---- YouTube ----
  useEffect(() => {
    if (mp4) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let revealed = false;
    const reveal = () => {
      if (cancelled || revealed) return;
      revealed = true;
      setPlaying(true);
    };
    const isHD = (q: string) => /^(hd720|hd1080|hd1440|hd2160|highres)$/.test(q);
    let fallback: ReturnType<typeof setTimeout> | undefined;

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
          onPlaybackQualityChange: (e: { data: string }) => {
            if (isHD(e.data)) setTimeout(reveal, 300);
          },
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            if (e.data === YT_PLAYING) {
              // Reveal only once the stream is HD — or after a grace period.
              if (isHD(e.target.getPlaybackQuality?.() ?? "")) setTimeout(reveal, 300);
              else if (!fallback) fallback = setTimeout(reveal, 6000);
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
      if (fallback) clearTimeout(fallback);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [youtubeId, mp4, start]);

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden [container-type:size]", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      {mp4 ? (
        <video
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-[1500ms]",
            playing ? "opacity-100" : "opacity-0"
          )}
          src={mp4}
          poster={poster}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          onPlaying={() => setPlaying(true)}
          onEnded={onFileEnded}
        />
      ) : (
      <div
        ref={mountRef}
        className={cn(
          "absolute left-1/2 top-1/2 h-[max(100cqh,56.25cqw)] w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-[1500ms]",
          "[&_iframe]:h-full [&_iframe]:w-full",
          playing ? "opacity-100" : "opacity-0"
        )}
      />
      )}
    </div>
  );
});

export default YouTubeBackdrop;
