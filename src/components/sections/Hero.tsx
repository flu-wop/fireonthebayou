"use client";

/**
 * Hero — the whole homepage stage.
 * One full-height screen: the reel runs full-bleed, the tagline sits large in
 * display type, the client logo banner drifts along the bottom edge, and the
 * only call to action is "Enter the work".
 *
 * Reel: a self-hosted /public/video/hero-reel.mp4 when it exists (the server
 * passes `mp4`), otherwise the YouTube reel set in HERO_REEL.
 */
import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import Magnetic from "@/components/effects/Magnetic";
import YouTubeBackdrop from "@/components/film/YouTubeBackdrop";

export default function Hero({ mp4, poster, youtubeId, lines, sub, phone, phoneHref, banner }: { mp4?: string; poster: string; youtubeId: string; lines: string[]; sub: string; phone: string; phoneHref: string; banner: ReactNode }) {
  return (
    <section id="reel" data-chapter="Reel" className="vignette relative flex h-[100svh] min-h-[480px] flex-col overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <YouTubeBackdrop youtubeId={youtubeId} mp4={mp4} poster={poster} className="opacity-80" />
      </div>
      <div aria-hidden className="absolute inset-0 -z-[9] bg-gradient-to-t from-ink via-ink/40 to-ink/20" />
      <div aria-hidden className="absolute inset-0 -z-[9] bg-gradient-to-r from-ink/70 via-transparent to-transparent" />

      <div className="frame relative z-10 mt-auto pb-8 md:pb-10 short:pb-4">
        <h1 className="font-display text-[clamp(2.6rem,min(18vw,16svh),11rem)] leading-[0.86] text-cream short:text-[clamp(2rem,min(9vw,13svh),9rem)] short:leading-[0.82]">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className={i === lines.length - 1 ? "block text-flame" : "block"}
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
          className="mt-6 flex flex-col items-start gap-5 md:flex-row md:items-center md:gap-10 short:mt-2 short:flex-row short:items-center short:gap-6"
        >
          <p className="max-w-xs text-lg leading-snug text-cream/90 short:hidden">{sub}</p>
          <Magnetic>
            <Link
              href="/work"
              className="inline-flex items-center gap-3 rounded-full bg-ember px-7 py-3.5 text-base font-semibold text-cream transition-colors hover:bg-flame-light short:px-5 short:py-2.5"
            >
              Enter the work <span aria-hidden>→</span>
            </Link>
          </Magnetic>
        </motion.div>
      </div>

      <div className="relative z-10">
        {banner}
        <p className="frame flex flex-wrap items-center gap-x-5 gap-y-1 py-3 text-[11px] text-ash short:hidden">
          <span>&copy; {new Date().getFullYear()} Fire on the Bayou</span>
          <Link href="/privacy" className="transition-colors hover:text-cream">Privacy</Link>
          <Link href="/terms" className="transition-colors hover:text-cream">Terms</Link>
          <Link href="/admin" className="transition-colors hover:text-cream">Admin</Link>
          <a href={`tel:${phoneHref}`} className="ml-auto transition-colors hover:text-cream">{phone}</a>
        </p>
      </div>
    </section>
  );
}
