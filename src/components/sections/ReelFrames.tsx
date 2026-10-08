"use client";

/**
 * ReelFrames — the home page as a reel.
 * ----------------------------------------
 * Each featured film gets the whole screen: one still, the client, a title
 * card, and a Watch button into its screening room. Alongside, a monitor-style
 * overlay: a running REC timecode and a chapter list that tracks which frame
 * you're on (click one to jump there). The overlay shows only while the reel
 * (hero + frames) is on screen.
 */
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

export default function ReelFrames({ projects }: { projects: Project[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState("Reel");
  const [overlay, setOverlay] = useState(true);
  const lenis = useLenis();

  const chapters = [
    { id: "reel", label: "Reel" },
    ...projects.map((p) => ({ id: `frame-${p.slug}`, label: p.client.split(/[,/(]/)[0].trim() })),
  ];

  // Which chapter is on screen; whether the reel is on screen at all.
  useEffect(() => {
    const els = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.getAttribute("data-chapter") || "Reel");
        }
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    els.forEach((el) => io.observe(el));

    const last = els[els.length - 1];
    const onScroll = () => {
      if (!last) return;
      setOverlay(last.getBoundingClientRect().bottom > window.innerHeight * 0.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function jump(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* ---- Monitor overlay (desktop) ---- */}
      <div
        aria-hidden={!overlay}
        className={cn(
          "pointer-events-none fixed inset-y-0 right-0 z-40 hidden w-56 transition-opacity duration-700 lg:block",
          overlay ? "opacity-100" : "opacity-0"
        )}
      >
        <Timecode />
        <nav aria-label="Reel chapters" className="pointer-events-auto absolute right-10 top-1/2 -translate-y-1/2">
          <ol className="space-y-1.5 text-right text-[13px]">
            {chapters.map((c) => {
              const on = active === c.label;
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => jump(c.id)}
                    aria-current={on ? "true" : undefined}
                    className={cn(
                      "inline-flex items-center gap-3 transition-colors duration-300",
                      on ? "font-semibold text-cream" : "text-cream/50 hover:text-cream"
                    )}
                  >
                    {c.label}
                    <span
                      className={cn(
                        "h-[2px] bg-ember transition-all duration-500 ease-cinematic",
                        on ? "w-6" : "w-0"
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* ---- The frames ---- */}
      <div ref={wrapRef}>
        {projects.map((p, i) => (
          <Frame key={p.slug} project={p} index={i} />
        ))}
      </div>
    </>
  );
}

function Frame({ project: p, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const href = p.films?.length ? `/work/${p.slug}` : "/work";
  const label = p.client.split(/[,/(]/)[0].trim();

  return (
    <section
      ref={ref}
      id={`frame-${p.slug}`}
      data-chapter={label}
      className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink"
    >
      <motion.div style={{ y }} className="absolute inset-0 -top-[6%] h-[112%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={p.poster}
          alt={`${p.title} — ${p.client}`}
          loading={index < 2 ? "eager" : "lazy"}
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.35)_0%,rgba(0,0,0,0)_28%,rgba(0,0,0,0)_45%,rgba(0,0,0,.88)_100%)]"
      />

      <div className="frame relative flex h-full flex-col justify-end pb-14 md:pb-16 lg:pr-64">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20%" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 text-base text-cream/85">{p.client}</p>
          <h2 className="font-display text-[clamp(3.2rem,10.5vw,11rem)] leading-[0.84] text-cream">
            {p.title}
          </h2>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <Link href={href} className="group inline-flex items-center gap-4 text-base font-semibold text-cream">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-cream text-ink transition-transform duration-500 ease-cinematic group-hover:scale-105">
                <svg viewBox="0 0 16 16" className="ml-0.5 h-4 w-4" aria-hidden>
                  <path d="M4 2.5v11l9-5.5z" fill="currentColor" />
                </svg>
              </span>
              Watch
            </Link>
            {p.award && (
              <span className="rounded-full border border-cream/50 px-4 py-2 text-sm text-cream">
                {p.award}
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/** REC light + a running SMPTE-style timecode (24 fps). */
function Timecode() {
  const [tc, setTc] = useState("00:00:00:00");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const start = performance.now();
    let raf = 0;
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      const f = Math.floor((t % 1) * 24);
      const s = Math.floor(t) % 60;
      const m = Math.floor(t / 60) % 60;
      const h = Math.floor(t / 3600);
      setTc(`${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <p className="absolute right-10 top-28 flex items-center gap-2.5 text-[13px] text-cream/85 [font-feature-settings:'tnum']">
      <span className="h-2 w-2 animate-ember-pulse rounded-full bg-ember" />
      REC <span className="w-[84px]">{tc}</span>
    </p>
  );
}
