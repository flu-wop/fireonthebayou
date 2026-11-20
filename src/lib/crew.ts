import { site } from "@/lib/site";
import { slugify } from "@/lib/slugs";

/**
 * Core crew, presented like closing credits. Portraits are 1000×1250 (4:5) at
 * /public/images/crew/<slug>.jpg; until one exists the Studio page shows a
 * monogram placeholder. Phase 4 moves this list into the database.
 */
export type CrewMember = { name: string; slug: string; role: string; href?: string; note: string };

const raw: Omit<CrewMember, "slug">[] = [
  { name: "Jason Villemarette", role: "Founder & Director", href: site.socials.linkedin, note: "Founded FOTB in 2006 · City Business Innovator of the Year (2008)" },
  { name: "Kathy Hirsch", role: "Producer", note: "23 years heading broadcast production at Peter Mayer" },
  { name: "David Reece", role: "Director of Photography", note: "Coca-Cola, ESPN, NFL" },
  { name: "Michael Sanchez", role: "Post-Production Supervisor", note: "Edit, animation, sound design" },
  { name: "Louis Koerner", role: "Director", note: "Director/DP · commercial & digital campaigns" },
  { name: "Simon Blake", role: "Director", note: "Two AICP awards · permanent collection, MoMA" },
];

export const crew: CrewMember[] = raw.map((c) => ({ ...c, slug: slugify(c.name) }));
