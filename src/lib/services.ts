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
    title: "TV & Web Commercials",
    blurb:
      "Broadcast spots and the cutdowns that run everywhere else — cast, shot, cut, and delivered on time and on budget, for agencies and direct clients across the Gulf South.",
    capabilities: ["Concept & script", "Casting", "Direction", "Drone & aerial", "Social cutdowns"],
  },
  {
    index: "02",
    title: "Social Content",
    // INTERIM COPY — Izzie to supply the final Social Content wording.
    blurb:
      "Short-form video built for the feed — restaurant and venue content, recurring series, and vertical and square cuts, shot and edited for Instagram, Facebook, TikTok and YouTube.",
    capabilities: ["Vertical & square cuts", "Restaurant & venue content", "Recurring series", "Captions & delivery"],
  },
  {
    index: "03",
    title: "Brand Films",
    blurb:
      "Story-led films that give a brand a heartbeat — the people, the place, and why it matters — built to run on TV, on the web, and in the feed.",
    capabilities: ["Treatment", "Interviews", "Cinematography", "Original score"],
  },
  {
    index: "04",
    title: "Corporate & Nonprofit",
    blurb:
      "Launch films, recruiting and welcome videos, training, trade-show loops, and nonprofit stories — real people, told straight, for companies, schools, and agencies.",
    capabilities: ["Interviews", "Field production", "Trade show", "Training"],
  },
  {
    index: "05",
    title: "Music & Events",
    blurb:
      "Performances, festivals, and big nights — from Jazz Fest to brass bands and music videos — captured as they happen.",
    capabilities: ["Live performance", "Event coverage", "Highlight reels", "Multi-camera"],
  },
  {
    index: "06",
    title: "Animation & Motion Graphics",
    blurb:
      "Animated spots, explainers, titles, and graphics packages — Jason started out as an editor and animator, and it's still built in-house.",
    capabilities: ["2D animation", "Motion graphics", "Titles & lower thirds", "Logo animation"],
  },
  {
    index: "07",
    title: "Sound & Voiceover",
    blurb:
      "An isolation booth for voiceover and ADR, a console for sound design, and Neumann microphones — plus a nationwide roster of voice talent who can record remotely.",
    capabilities: ["Voiceover / ADR", "Sound design", "Foley", "Mix & master"],
  },
  {
    index: "08",
    title: "Post & Finishing",
    blurb:
      "Five edit and animation bays: editorial, color, graphics, and delivery in every format you need — and revisions whenever you need them.",
    capabilities: ["Editorial", "Color grade", "Graphics", "Delivery"],
  },
];
