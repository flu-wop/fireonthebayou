import { clientLogoPath, crewPortraitPath, projectPosterPath, servicePhotoPath, testimonialPosterPath } from "@/lib/media";
import type { Kind } from "./types";

/** The image slot (if any) that belongs to a record, so its edit page can offer an upload right there. */
export type SlotSpec = { path: string; kind: "image" | "svg"; width?: number; height?: number; label: string; hint: string };

export function slotFor(kind: Kind, key: string): SlotSpec | null {
  switch (kind) {
    case "client":
      return { path: clientLogoPath(key), kind: "svg", label: "Logo", hint: "SVG, white on a transparent background. Shows in the home-page banner and on the Studio wall." };
    case "project":
      return { path: projectPosterPath(key), kind: "image", width: 1280, height: 720, label: "Poster", hint: "1280×720 JPG. Optional: without one the site uses the YouTube thumbnail." };
    case "testimonial":
      return { path: testimonialPosterPath(key), kind: "image", width: 1280, height: 720, label: "Poster", hint: "1280×720 JPG still for this testimonial." };
    case "crew":
      return { path: crewPortraitPath(key), kind: "image", width: 1000, height: 1250, label: "Portrait", hint: "1000×1250 JPG (tall, 4:5)." };
    case "service":
      return { path: servicePhotoPath(key), kind: "image", width: 1600, height: 1067, label: "Still", hint: "1600×1067 JPG (3:2)." };
    default:
      return null;
  }
}
