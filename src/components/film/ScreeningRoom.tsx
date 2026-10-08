"use client";

/**
 * ScreeningRoom
 * -------------
 * The top of every project page. The film plays full-bleed, silent, on a loop —
 * like walking into a theater mid-reel. Press "Roll sound" and the set call
 * plays out ("Roll sound." → "Speed."), the film jumps back to the top and the
 * audio comes up. That's the Fire on the Bayou pitch — picture and sound under
 * one roof — made into something you do instead of something you read.
 *
 * Built on the YouTube IFrame API (privacy-enhanced host). If the API can't
 * load, the poster stays up and a "Watch on YouTube" link carries the page.
 * Reduced-motion visitors don't get the ambient loop; the film starts when
 * they press Roll sound.
 */
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Film } from "@/lib/projects";
import { cn } from "@/lib/utils";

import { loadYouTubeAPI, YT_ENDED as ENDED, YT_PLAYING as PLAYING, type YTPlayer } from "@/lib/youtube";

type Phase = "silent" | "calling" | "rolling";

export default function ScreeningRoom({
  films,
  poster,
  title,
  client,
  category,
  year,
  award,
}: {
  films: Film[];
  poster: string;
  title: string;
  client: string;
  category: string;
  year?: string;
  award?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const phaseRef = useRef<Phase>("silent");

  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [phase, setPhaseState] = useState<Phase>("silent");
  const [call, setCall] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  const film = films[active];

  // ---- Create the player once ----
  useEffect(() => {
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const failTimer = setTimeout(() => {
      if (!cancelled && !playerRef.current) setFailed(true);
    }, 8000);

    loadYouTubeAPI().then((YT) => {
      if (cancelled || !mountRef.current) return;
      const target = document.createElement("div");
      mountRef.current.appendChild(target);
      playerRef.current = new YT.Player(target, {
        host: "https://www.youtube-nocookie.com",
        videoId: films[0].youtubeId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: reduced ? 0 : 1,
          mute: 1,
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
            if (!reduced) e.target.playVideo();
            setReady(true);
          },
          onStateChange: (e: { data: number; target: YTPlayer }) => {
            if (e.data === PLAYING) setPlaying(true);
            if (e.data === ENDED) {
              // End of reel: house lights back to silent loop.
              e.target.mute();
              e.target.seekTo(0, true);
              e.target.playVideo();
              setPhase("silent");
            }
          },
          onError: () => setFailed(true),
        },
      });
    });

    return () => {
      cancelled = true;
      clearTimeout(failTimer);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // Player is created once; part switching uses loadVideoById.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Progress line while sound is rolling ----
  useEffect(() => {
    if (phase !== "rolling") return;
    const id = setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      const d = p.getDuration();
      if (d > 0) setProgress(p.getCurrentTime() / d);
    }, 250);
    return () => clearInterval(id);
  }, [phase]);

  // ---- Fade the titles while the film plays with sound; wake on movement ----
  const wake = useCallback(() => {
    setChromeVisible(true);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (phaseRef.current === "rolling") {
      idleTimer.current = setTimeout(() => setChromeVisible(false), 2600);
    }
  }, []);
  useEffect(() => {
    if (phase === "rolling") wake();
    else setChromeVisible(true);
  }, [phase, wake]);

  // ---- Roll sound: the set call, then picture and sound from the top ----
  function rollSound() {
    const p = playerRef.current;
    if (!p || phaseRef.current === "calling") return;
    setPhase("calling");
    setCall("Roll sound.");
    // Unmute and restart inside the click itself — mobile browsers only allow
    // audio from a direct tap. The call plays over the film's first beat.
    p.seekTo(0, true);
    p.unMute();
    p.setVolume(100);
    p.playVideo();
    setPaused(false);
    setProgress(0);
    setTimeout(() => setCall("Speed."), 650);
    setTimeout(() => {
      setCall(null);
      setPhase("rolling");
    }, 1300);
  }

  function cut() {
    const p = playerRef.current;
    if (!p) return;
    p.mute();
    p.playVideo();
    setPaused(false);
    setPhase("silent");
  }

  function togglePause() {
    const p = playerRef.current;
    if (!p || phaseRef.current !== "rolling") return;
    if (paused) p.playVideo();
    else p.pauseVideo();
    setPaused(!paused);
    wake();
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const p = playerRef.current;
    if (!p) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    p.seekTo(ratio * p.getDuration(), true);
    setProgress(ratio);
  }

  function switchFilm(i: number) {
    const p = playerRef.current;
    if (!p || i === active) return;
    setActive(i);
    setPlaying(false);
    setProgress(0);
    p.loadVideoById(films[i].youtubeId);
    if (phaseRef.current !== "rolling") p.mute();
  }

  const rolling = phase === "rolling";

  return (
    <section
      onMouseMove={wake}
      onTouchStart={wake}
      className="relative h-[100svh] min-h-[320px] overflow-hidden bg-black"
      aria-label={`${title} — screening room`}
    >
      {/* ---- The film, sized to cover the frame like a projected image ---- */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden [container-type:size]">
        <div
          ref={mountRef}
          className={cn(
            "absolute left-1/2 top-1/2 h-[max(100cqh,56.25cqw)] w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-1000",
            "[&_iframe]:h-full [&_iframe]:w-full",
            playing ? "opacity-100" : "opacity-0"
          )}
        />
        {/* Poster until the film is actually moving */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={poster}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            playing ? "opacity-0" : "opacity-100"
          )}
        />
      </div>

      {/* Click layer: blocks YouTube's own UI; pauses when sound is rolling */}
      <button
        type="button"
        aria-label={paused ? "Resume film" : "Pause film"}
        onClick={togglePause}
        disabled={!rolling}
        className="absolute inset-0 z-[1] cursor-default disabled:cursor-default"
        style={{ cursor: rolling ? "pointer" : "default" }}
      />

      {/* Scrims — heavier while silent so the titles read, lighter once rolling */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-black via-black/30 to-black/50 transition-opacity duration-1000",
          rolling && !chromeVisible ? "opacity-20" : "opacity-100"
        )}
      />
      <div aria-hidden className="vignette pointer-events-none absolute inset-0 z-[2]" />

      {/* ---- The set call ---- */}
      <AnimatePresence mode="wait">
        {call && (
          <motion.p
            key={call}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center font-display text-[clamp(3rem,9vw,8rem)] font-light italic text-cream"
            aria-hidden
          >
            {call}
          </motion.p>
        )}
      </AnimatePresence>
      <p className="sr-only" aria-live="polite">
        {rolling ? "Sound on. Playing from the top." : call ? "" : "Sound off."}
      </p>

      {/* ---- Titles + controls ---- */}
      <motion.div
        animate={{ opacity: chromeVisible && !call ? 1 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-0 z-[3]"
      >
        <div className="frame flex h-full flex-col justify-between pb-10 pt-28 md:pb-14 short:pb-5 short:pt-16">
          <Link
            href="/work"
            className="pointer-events-auto self-start font-mono text-[13px] tracking-wide text-mist transition-colors hover:text-flame"
          >
            ← The reel
          </Link>

          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-4xl">
              <p className="eyebrow mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{client}</span>
                <span className="text-ash">/</span>
                <span className="text-mist">{category}</span>
                {year && (
                  <>
                    <span className="text-ash">/</span>
                    <span className="text-mist">{year}</span>
                  </>
                )}
              </p>
              <h1 className="font-display text-[clamp(2.2rem,min(10vw,16svh),9rem)] font-light leading-[0.88] tracking-tight text-cream">
                {title}
              </h1>
              {award && (
                <p className="mt-6 inline-flex items-center gap-3 font-mono text-[13px] tracking-wide text-cream short:mt-2">
                  <span className="h-px w-8 bg-flame" />
                  <span className="text-fire-gradient">{award}</span>
                </p>
              )}
            </div>

            <div className="pointer-events-auto flex flex-col items-start gap-5 md:items-end">
              {films.length > 1 && (
                <div className="flex gap-2" role="group" aria-label="Choose a film">
                  {films.map((f, i) => (
                    <button
                      key={f.youtubeId}
                      type="button"
                      onClick={() => switchFilm(i)}
                      aria-pressed={i === active}
                      className={cn(
                        "rounded-full border px-4 py-2 font-mono text-[13px] tracking-wide transition-colors duration-300",
                        i === active
                          ? "border-cream/80 text-cream"
                          : "border-white/15 text-mist hover:border-white/40"
                      )}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}

              {failed ? (
                <a
                  href={`https://www.youtube.com/watch?v=${film.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full bg-ember px-7 py-4 font-mono text-[13px] tracking-wide text-cream transition-colors hover:bg-[#E21A52]"
                >
                  Watch on YouTube ↗
                </a>
              ) : rolling ? (
                <button
                  type="button"
                  onClick={cut}
                  className="group inline-flex items-center gap-4 rounded-full border border-white/20 bg-black/40 px-7 py-4 font-mono text-[13px] tracking-wide text-cream backdrop-blur transition-colors hover:border-flame"
                >
                  <Meter on={!paused} />
                  Cut sound
                </button>
              ) : (
                <button
                  type="button"
                  onClick={rollSound}
                  disabled={!ready}
                  aria-pressed={false}
                  className="group inline-flex items-center gap-4 rounded-full bg-ember px-8 py-4 font-mono text-[13px] tracking-wide text-cream ember-bloom transition-all duration-500 ease-cinematic hover:bg-[#E21A52] hover:shadow-[0_0_60px_-10px_rgba(208,17,70,0.45)] disabled:opacity-50"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cream/60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cream" />
                  </span>
                  Roll sound
                </button>
              )}

              <p className="font-mono text-[13px] tracking-wide text-ash short:hidden">
                {rolling
                  ? paused
                    ? "Paused — tap the frame to resume"
                    : "Tap the frame to pause"
                  : "Picture and sound, under one roof"}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---- Progress line, only once sound is rolling ---- */}
      {rolling && (
        <div
          role="slider"
          aria-label="Film position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
          tabIndex={0}
          onClick={seek}
          className="group absolute inset-x-0 bottom-0 z-[5] h-4 cursor-pointer"
        >
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/10 transition-all group-hover:h-1">
            <div
              className="h-full bg-flame"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}
    </section>
  );
}

/** Four-bar level meter — moving when sound is live. */
function Meter({ on }: { on: boolean }) {
  return (
    <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
      {[0.55, 1, 0.7, 0.4].map((h, i) => (
        <motion.span
          key={i}
          className="w-[3px] origin-bottom rounded-sm bg-flame"
          style={{ height: "100%" }}
          animate={on ? { scaleY: [h, 1 - h * 0.6, h * 0.8, 1, h] } : { scaleY: 0.2 }}
          transition={
            on
              ? { duration: 0.9 + i * 0.17, repeat: Infinity, ease: "easeInOut" }
              : { duration: 0.3 }
          }
        />
      ))}
    </span>
  );
}
