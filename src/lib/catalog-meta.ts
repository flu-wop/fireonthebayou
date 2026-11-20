import { slugify } from "@/lib/slugs";

/**
 * Catalog titles that keep an older URL / poster file name. These are the
 * projects that already have a screening-room write-up in projects.ts, so
 * /work/<slug> and /images/work-<slug>.jpg stay valid. Every other project
 * gets slugify(title).
 */
export const SLUG_OVERRIDES: Record<string, string> = {
  "Aucoin Hart Bridal, Parts 1 & 2": "aucoin-hart",
  "Rouses": "rouses",
  "Reily Foods": "reily-foods",
  "Frady's Blue Plate Mayo": "blue-plate",
  'Blue Runner Foods "The Meaning of Life"': "blue-runner",
  "Crystal": "crystal-hot-sauce",
  "Sazerac House Anthem Video": "sazerac-house",
  "Russel": "russell-athletic",
  "Acme Talking Oysters": "acme-oyster-house",
  "Audubon Zoo New Lion Exhibit": "audubon",
  'City Park "Get Outside Yourself"': "city-park",
  'New Orleans & Company "How Glad I Am"': "new-orleans-and-company",
  "Smoothie King Brand Video": "smoothie-king",
};

export function projectSlug(title: string): string {
  return SLUG_OVERRIDES[title] ?? slugify(title);
}
