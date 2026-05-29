"use client";

/**
 * ProjectCard
 * -----------
 * A single work tile. Shows the poster still by default; on hover (desktop) the
 * muted video begins playing and the poster cross-fades out. Inside the frame,
 * the media gets a subtle scroll-linked parallax so the grid feels alive.
 *
 * Touch devices: tap doesn't hover, so the poster + meta carry the tile.
 * Missing video file: poster simply stays — nothing breaks.
 */
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

const spanClasses: Record<Project["span"], string> = {
  wide: "md:col-span-7 aspect-[16/10]",
  tall: "md:col-span-5 md:row-span-2 aspect-[4/5]",
  regular: "md:col-span-5 aspect-[5/4]",
};

export default function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);

  // Gentle internal parallax on the media.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  function onEnter() {
    setHovered(true);
    videoRef.current?.play().catch(() => {});
  }
  function onLeave() {
    setHovered(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group relative", spanClasses[project.span])}
    >
      <Link
        ref={ref}
        href={`/work#${project.slug}`}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="relative block h-full w-full overflow-hidden rounded-sm border border-border bg-card"
      >
        {/* Media (poster + hover video), parallaxed */}
        <motion.div style={{ y: mediaY }} className="absolute inset-0 h-[116%] -top-[8%]">
          {/* Poster image — using <img> so a missing file degrades gracefully */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.poster}
            alt={project.title}
            className={cn(
              "h-full w-full object-cover transition-all duration-700 ease-cinematic",
              "scale-105 group-hover:scale-110",
              hovered && "opacity-0"
            )}
          />
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            poster={project.poster}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              hovered ? "opacity-100" : "opacity-0"
            )}
          >
            <source src={project.video} type="video/mp4" />
          </video>
        </motion.div>

        {/* Gradient + meta overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-7">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-widest text-flame">
              {project.category}
            </span>
            <span className="font-mono text-[11px] tracking-widest text-ash">
              {project.year}
            </span>
          </div>

          <div className="translate-y-2 transition-transform duration-500 ease-cinematic group-hover:translate-y-0">
            <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-mist">
              {project.client}
            </p>
            <h3 className="font-display text-3xl font-light leading-none text-cream md:text-4xl">
              {project.title}
            </h3>
            <p className="mt-2 max-w-sm text-sm text-mist opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              {project.blurb}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
