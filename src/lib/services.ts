/** Services / capabilities. Drives the Services page + the home capabilities strip. */
export type Service = {
  index: string;
  title: string;
  blurb: string;
  capabilities: string[];
};

export const services: Service[] = [
  {
    index: "01",
    title: "Brand Films",
    blurb:
      "Cinematic films that give a brand a heartbeat — story-led, scored, and built to live on a hero section or a festival screen.",
    capabilities: ["Concept & treatment", "Direction", "Cinematography", "Original score"],
  },
  {
    index: "02",
    title: "Music Videos",
    blurb:
      "From intimate single-takes to full-scale performance pieces, made with the rhythm of the room baked in.",
    capabilities: ["Creative direction", "Performance capture", "Color grade", "On-set audio"],
  },
  {
    index: "03",
    title: "Documentary",
    blurb:
      "Long-form storytelling with patience and access — the kind of work that earns trust and holds an audience.",
    capabilities: ["Field production", "Interviews", "Archival", "Edit & finish"],
  },
  {
    index: "04",
    title: "Commercial & Hospitality",
    blurb:
      "Spots and campaign assets for restaurants, spirits, and venues that need to look as good as they taste.",
    capabilities: ["Campaign assets", "Social cutdowns", "Food & motion", "Brand systems"],
  },
  {
    index: "05",
    title: "Sound & Score",
    blurb:
      "In-house at Mid City Sound: original score, mix, master, sound design, and ADR without leaving the building.",
    capabilities: ["Original score", "Mix & master", "Sound design", "Voiceover / ADR"],
  },
  {
    index: "06",
    title: "Post & Finishing",
    blurb:
      "Edit, color, and delivery handled with a colorist's eye — every frame graded to feel like film.",
    capabilities: ["Editorial", "Color grade", "Motion graphics", "Delivery / DCP"],
  },
];
