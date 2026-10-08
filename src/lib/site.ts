/**
 * Central site config — edit brand-level facts here once and they propagate
 * through nav, footer, contact, and metadata.
 */
export const site = {
  name: "Fire on the Bayou",
  shortName: "FOTB",
  tagline: "A New Orleans video production house since 2006.",
  description:
    "Fire on the Bayou is an award-winning New Orleans video production house making TV commercials, brand films, and corporate video since 2006. Home of Mid City Sound.",
  url: "https://fireonthebayou.com",
  location: "New Orleans, Louisiana",
  address: "530 S Norman C Francis Pkwy, New Orleans, LA 70119",
  phone: "(504) 400-2555",
  phoneHref: "+15044002555",
  email: "firenola@gmail.com",
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
  // Founder portrait on the About page. Drop the photo in /public/images and
  // set `photo` (e.g. "/images/jason-villemarette.jpg"); until then the page
  // shows a frame from his Aucoin Hart film, captioned as his work.
  founder: {
    name: "Jason Villemarette",
    role: "Founder & Director",
    photo: null as string | null,
  },
  // Merch is sold through the Mid City Sound store (shared Printful + Stripe).
  merch: {
    url: "https://www.midcitysound.com/merch",
  },
} as const;

/**
 * Paid Creative Consult — the site's "pay to start" offer, sold through
 * Stripe Checkout (/api/consult/checkout). The price is enforced server-side
 * from this file; the browser never sends an amount.
 *
 * PLACEHOLDER — confirm price, length, and the credit policy with Jason.
 */
export const consult = {
  name: "Creative Consult",
  priceCents: 100000,
  length: "60 minutes",
  /** Shown on the page; set to false if the fee won't be credited. */
  creditedTowardProduction: true,
  includes: [
    "A working session with a Fire on the Bayou director and producer — at the studio or by video",
    "A written creative brief: the concept, the creative approach, and visual references",
    "A real budget range and production timeline you can take to your team",
    "Your brief delivered within a week of the session",
  ],
} as const;

export function formatPrice(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: cents % 100 ? 2 : 0 })}`;
}

/** Primary navigation. Order matters — drives Navbar + Footer. */
export const navLinks = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Studio", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
