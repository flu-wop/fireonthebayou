/**
 * Central site config — edit brand-level facts here once and they propagate
 * through nav, footer, contact, and metadata.
 */
export const site = {
  name: "Fire on the Bayou",
  shortName: "FOTB",
  tagline: "A New Orleans video production house since 2006.",
  /** Homepage stage headline, one entry per line; the last line is crimson. Interim wording until Izzie/Jason supply the tagline. */
  heroLines: ["We Light", "the Bayou", "ON FIRE"],
  /** Short supporting line under the headline. */
  heroSub: "Commercials and brand films made in New Orleans since 2006.",
  description:
    "Fire on the Bayou is an award-winning New Orleans video production house making TV commercials, brand films, and corporate video since 2006. Home of Mid City Sound.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://fireonthebayou.com").replace(/\/$/, ""),
  /**
   * Search engines are kept out until launch, so this preview never competes
   * with the live WordPress site. At launch set SITE_INDEXABLE=true in Vercel.
   */
  indexable: process.env.SITE_INDEXABLE === "true",
  location: "New Orleans, Louisiana",
  address: "530 S Norman C Francis Pkwy, New Orleans, LA 70119",
  phone: "(504) 400-2555",
  phoneHref: "+15044002555",
  /** Public address shown on the site. The mailbox (or a forward to `inbox`)
   *  must exist on the fireonthebayou.com domain before launch. */
  email: "hello@fireonthebayou.com",
  /** Where studio-side inquiry notifications are meant to land (see notifyNewInquiry). */
  inbox: "firenola@gmail.com",
  socials: {
    // Same accounts fireonthebayou.com links to (checked Oct 2026).
    instagram: "https://www.instagram.com/fire_on_the_bayou_/",
    youtube: "https://www.youtube.com/@firenola",
    facebook: "https://www.facebook.com/fireonthebayounola/",
    linkedin: "https://www.linkedin.com/in/jason-villemarette-17b38021/",
  },
  // Sister brand — connection highlighted on the About page
  studio: {
    name: "Mid City Sound",
    url: "https://midcitysound.com",
    blurb:
      "Our in-house recording and mixing studio in Mid-City — where the score, the sound design, and the room tone all live under one roof.",
  },
  // Founder portrait on the About page. Drop the photo in /public/images and
  // set `photo` (e.g. "/images/jason-villemarette.jpg"); until then the page
  // shows a frame from his Aucoin Hart film, captioned as his work.
  founder: {
    name: "Jason Villemarette",
    role: "Founder & Director",
    photo: null as string | null,
  },
} as const;

/** Display names for the social links. */
export const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
  linkedin: "LinkedIn",
};

/** Primary navigation. Order matters — drives Navbar + Footer. */
export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Studio", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact", href: "/contact" },
] as const;
