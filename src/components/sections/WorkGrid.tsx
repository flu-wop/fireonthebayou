"use client";

/**
 * WorkGrid — every featured film as a widescreen frame, two across;
 * the first (lead) film runs the full width.
 */
import { orderedProjects as projects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function WorkGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
      {projects.map((p, i) => (
        <ProjectCard
          key={p.slug}
          project={p}
          index={i}
          // Lead film is full width; so is the last one if it would sit alone.
          lead={i === 0 || (i === projects.length - 1 && (projects.length - 1) % 2 === 1)}
        />
      ))}
    </div>
  );
}
