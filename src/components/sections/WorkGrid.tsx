"use client";

/**
 * WorkGrid — full work page grid (all projects), reusing ProjectCard.
 */
import { projects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function WorkGrid() {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
      {projects.map((p, i) => (
        <ProjectCard key={p.slug} project={p} index={i} />
      ))}
    </div>
  );
}
