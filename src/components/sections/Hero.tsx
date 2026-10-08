"use client";

/**
 * Hero
 * ----
 * Full-bleed, muted, autoplaying reel behind a giant display headline.
 *
 * Cinematic mechanics:
 *  - The video sits in a scroll-LINKED parallax layer: as you scroll down, it
 *    drifts up slowly and scales slightly, so the headline "lifts off" it.
 *  - The headline + meta fade and rise on the same scroll progress.
 *  - A poster image + gradient guarantee it never looks broken if the .mp4 is
 *    missing — drop /public/video/hero-reel.mp4 in to light it up.
 *  - Vignette + grain (global) give it the lens feel.
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Button from "@/components/ui/Button";
import YouTubeBackdrop, { type BackdropHandle } from "@/components/film/YouTubeBackdrop";

/**
 * The hero reel — Fire on the Bayou's Hospitality Reel on YouTube (@firenola).
 * For a guaranteed-sharp loop, drop an exported file in /public/video and set
 * `mp4: "/video/hero-reel.mp4"` — the site then plays that instead of YouTube.
 */
const HERO_REEL: { youtubeId: string; poster: string; mp4?: string } = {
  youtubeId: "6Kcbz2qkj8g",
  poster: "/images/hero-poster.jpg",
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reel = useRef<BackdropHandle>(null);
  const [reelReady, setReelReady] = useState(false);
  const [sound, setSound] = useState(false);

  function toggleSound() {
    if (sound) reel.current?.cut();
    else reel.current?.rollSound();
    setSound(!sound);
  }

  // Track scroll across the hero itself.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Video drifts up + scales as we scroll (parallax depth).
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  // Content lifts faster and fades (foreground layer).
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="reel"
      data-chapter="Reel"
      className="vignette relative flex h-[100svh] min-h-[320px] items-end overflow-hidden"
    >
      {/* ---- Background reel (parallax layer) ---- */}
      <motion.div
        style={{ y: videoY }}
        className="absolute inset-0 -z-10 h-[115%]"
      >
        <YouTubeBackdrop
          ref={reel}
          youtubeId={HERO_REEL.youtubeId}
          mp4={HERO_REEL.mp4}
          poster={HERO_REEL.poster}
          className="opacity-80"
          onReady={() => setReelReady(true)}
          onSoundEnd={() => setSound(false)}
        />
      </motion.div>

      {/* Darkening scrims for text legibility */}
      <div
        aria-hidden
        className="absolute inset-0 -z-[9] bg-gradient-to-t from-ink via-ink/40 to-ink/20"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-[9] bg-gradient-to-r from-ink/70 via-transparent to-transparent"
      />

      {/* ---- Foreground content ---- */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="frame relative z-10 pb-14 md:pb-16 lg:pr-64 short:pb-6"
      >
        <h1 className="font-display text-[clamp(2.6rem,min(20vw,17svh),12rem)] leading-[0.86] text-cream short:text-[clamp(2.2rem,min(10vw,14svh),12rem)] short:leading-[0.82]">
          {["We Light", "the Bayou", "ON FIRE"].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={i === 2 ? "block text-flame" : "block"}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-10 short:mt-3 short:flex-row short:items-center short:gap-6"
        >
          <p className="max-w-xs text-lg leading-snug text-cream/90 short:hidden">
            Commercials and brand films made in New Orleans since 2006.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {/* Roll sound — the reel with audio, from the top */}
            <button
              type="button"
              onClick={toggleSound}
              disabled={!reelReady}
              aria-pressed={sound}
              className="group inline-flex items-center gap-4 text-base font-semibold text-cream disabled:opacity-60"
            >
              <span className="grid h-14 w-14 place-items-center rounded-full bg-cream text-ink short:h-11 short:w-11 transition-transform duration-500 ease-cinematic group-hover:scale-105">
                {sound ? <SoundBars on /> : <PlayIcon />}
              </span>
              {sound ? "Cut sound" : "Play the reel with sound"}
            </button>
            <a href="/work" className="text-base text-cream/80 underline decoration-cream/30 underline-offset-[6px] transition-colors hover:text-cream hover:decoration-flame">
              See all the work
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" className="ml-0.5 h-4 w-4" aria-hidden>
      <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
    </svg>
  );
}

/** Level meter: flat when silent, moving when sound is rolling. */
function SoundBars({ on }: { on: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[3px]" aria-hidden>
      {[0.55, 1, 0.7, 0.4].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2px] origin-bottom rounded-sm bg-ember"
          style={{ height: "100%" }}
          animate={on ? { scaleY: [h, 1 - h * 0.6, h * 0.8, 1, h] } : { scaleY: 0.25 }}
          transition={on ? { duration: 0.9 + i * 0.17, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        />
      ))}
    </span>
  );
}
