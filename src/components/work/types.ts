import type { CatalogProject } from "@/lib/catalog";

/** A catalog project plus its resolved media and display tags (computed on the server). */
export type WorkItem = CatalogProject & {
  posterUrl: string | null;
  previewUrl: string | null;
  tags: string[];
};
