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
import { useRef } from "react";
import { site } from "@/lib/site";
import Button from "@/components/ui/Button";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Track scroll across the hero itself.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Video drifts up + scales as we scroll (parallax depth).
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
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
        style={{ y: videoY, scale: videoScale }}
        className="absolute inset-0 -z-10 h-[115%]"
      >
        {/* Poster gradient fallback sits underneath the <video> */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 70% 20%, #2a1009 0%, #0b0705 55%, #060605 100%)",
          }}
        />
        <video
          className="h-full w-full object-cover opacity-70"
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
        >
          {/* Drop your reel here. Multiple sources = better browser coverage. */}
          <source src="/video/hero-reel.webm" type="video/webm" />
          <source src="/video/hero-reel.mp4" type="video/mp4" />
        </video>
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
          className="mt-10 flex flex-col items-start gap-8 md:flex-row md:items-center"
        >
          <p className="max-w-md text-base leading-relaxed text-mist">
            A New Orleans production house making cinematic brand films, music
            videos, and documentary work — sound and score under our own roof.
          </p>
          <div className="flex items-center gap-4">
            <Button href="/work" variant="ember">
              View the work
            </Button>
            <Button href="/contact" variant="outline">
              Start a project
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
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
