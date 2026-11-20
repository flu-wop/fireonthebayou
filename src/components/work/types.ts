import type { CatalogProject } from "@/lib/catalog";

/** A catalog project plus the file checks the server did at build time. */
export type WorkItem = CatalogProject & {
  posterPresent: boolean;
  previewPresent: boolean;
};
