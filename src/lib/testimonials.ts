import { slugify } from "@/lib/slugs";

/**
 * Nine video testimonial slots (scope doc, decision 5). The ninth is one shared
 * slot: Freeman or Brother Martin, whichever Izzie supplies. Fill `youtubeId`
 * and add a 1280×720 poster at /public/images/testimonials/<slug>.jpg.
 * Phase 4 moves this list into the database.
 */
export type Testimonial = { client: string; slug: string; youtubeId: string | null; quote?: string };

const clients = [
  "Morris Bart",
  "Dickie Brennan's",
  "Port",
  "Westin",
  "Brand Society",
  "Deep Fried",
  "Reily Foods",
  "Avala",
  "Freeman or Brother Martin",
];

export const testimonials: Testimonial[] = clients.map((client) => ({
  client,
  slug: slugify(client),
  youtubeId: null,
}));
