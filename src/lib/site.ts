/**
 * Central site config — edit brand-level facts here once and they propagate
 * through nav, footer, contact, and metadata.
 */
export const site = {
  name: "Fire on the Bayou",
  shortName: "FOTB",
  tagline: "A New Orleans film & video production house.",
  description:
    "Fire on the Bayou is a New Orleans video production house crafting cinematic brand films, music videos, and documentary work. Home of Mid City Sound.",
  url: "https://fireonthebayou.com",
  location: "New Orleans, Louisiana",
  email: "hello@fireonthebayou.com",
  socials: {
    instagram: "https://instagram.com/fireonthebayou",
    vimeo: "https://vimeo.com/fireonthebayou",
    youtube: "https://youtube.com/@fireonthebayou",
  },
  // Sister brand — connection highlighted on the About page
  studio: {
    name: "Mid City Sound",
    url: "https://midcitysound.com",
    blurb:
      "Our in-house recording and mixing studio in Mid-City — where the score, the sound design, and the room tone all live under one roof.",
  },
} as const;

/** Primary navigation. Order matters — drives Navbar + Footer. */
export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
