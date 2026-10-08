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
import { site } from "@/lib/site";
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
      className="vignette relative flex h-[100svh] min-h-[640px] items-end overflow-hidden"
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
          className="opacity-70"
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
        className="frame relative z-10 pb-20 md:pb-28"
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-6 flex items-center gap-3"
        >
          <span className="inline-block h-px w-10 bg-flame/70" />
          {site.location} &middot; Film &amp; Video
        </motion.p>

        {/* Headline — staggered word reveal */}
        <h1 className="max-w-5xl font-display text-[clamp(3rem,11vw,10rem)] font-light leading-[0.86] tracking-tight text-cream">
          {["We light", "the bayou", "on fire."].map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.3 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="block"
              >
                {/* last line gets the fire gradient */}
                {i === 2 ? (
                  <span className="text-fire-gradient italic">{line}</span>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Sub + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-8"
        >
          <p className="max-w-md text-base leading-relaxed text-mist">
            A New Orleans production house making commercials, brand films, and
            corporate video since 2006 — with sound and score under our own roof.
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Button href="/work" variant="ember">
              View the work
            </Button>
            <Button href="/contact" variant="outline">
              Start a project
            </Button>
          </div>
          {/* Roll sound — the reel with audio, from the top */}
          <button
            type="button"
            onClick={toggleSound}
            disabled={!reelReady}
            aria-pressed={sound}
            className="inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-mist transition-all duration-500 hover:text-flame disabled:pointer-events-none disabled:opacity-0"
          >
            <SoundBars on={sound} />
            {sound ? "Cut sound" : "Roll sound"}
          </button>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 md:block"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ash">
            Scroll
          </span>
          <span className="relative block h-12 w-px overflow-hidden bg-border">
            <motion.span
              className="absolute inset-x-0 top-0 h-4 bg-flame"
              animate={{ y: [-16, 48] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </span>
        </div>
      </motion.div>
    </section>
  );
}

/** Level meter: flat when silent, moving when sound is rolling. */
function SoundBars({ on }: { on: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[3px]" aria-hidden>
      {[0.55, 1, 0.7, 0.4].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2px] origin-bottom rounded-sm bg-flame"
          style={{ height: "100%" }}
          animate={on ? { scaleY: [h, 1 - h * 0.6, h * 0.8, 1, h] } : { scaleY: 0.25 }}
          transition={on ? { duration: 0.9 + i * 0.17, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        />
      ))}
    </span>
  );
}
