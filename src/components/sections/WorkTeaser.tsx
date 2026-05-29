"use client";

/**
 * WorkTeaser — home page "latest work" block.
 * Reuses the masonry grid + ProjectCard, capped to featured projects.
 */
import { featuredProjects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import Reveal from "@/components/effects/Reveal";

export default function WorkTeaser() {
  return (
    <section className="frame py-24 md:py-32">
      <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionHeading eyebrow="Selected Work" title={<>Recent<br />productions</>} />
        <Reveal delay={0.2}>
          <p className="max-w-sm text-sm leading-relaxed text-mist">
            A few of the films we&rsquo;ve shot lately. Hover any frame to watch
            it move.
          </p>
        </Reveal>
      </div>

      {/* Masonry-style 12-col grid */}
      <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
        {featuredProjects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <Button href="/work" variant="outline">
          See all work
        </Button>
      </div>
    </section>
  );
}
