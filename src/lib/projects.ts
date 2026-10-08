/**
 * Project showcase data.
 *
 * Drop assets into /public/video and /public/images using these filenames,
 * or repoint the paths. Each card uses `poster` as the still frame and `video`
 * as the muted clip that plays on hover (see <ProjectCard/>). If the video file
 * is missing, the poster simply stays in place — nothing breaks.
 */
export type Project = {
  slug: string;
  title: string;
  client: string;
  category: "Brand Film" | "Music Video" | "Documentary" | "Commercial";
  /** Release year — leave out unless confirmed. */
  year?: string;
  /** Short one-line description shown on hover / detail */
  blurb: string;
  poster: string; // /public/images/...
  video: string; // /public/video/...  (muted, looping, hover-to-play)
  /** Layout hint for the masonry-ish grid */
  span: "wide" | "tall" | "regular";

  // ---- Screening-room page (/work/[slug]) ----
  // A project gets its own page only when it has at least one film.
  /** YouTube films, in order. Multi-part campaigns get a part switcher. */
  films?: Film[];
  /** Award line shown under the title, e.g. "Gold Addy Award". */
  award?: string;
  /** One big sentence — the film in a breath. */
  logline?: string;
  /** The creative idea behind it. */
  approach?: { heading: string; body: string[]; references?: string[] };
  /** End credits, rolled at the bottom of the page. */
  credits?: Credit[];
};

export type Film = { label: string; youtubeId: string };
export type Credit = { role: string; name: string };

export const projects: Project[] = [
  {
    slug: "aucoin-hart",
    title: "Aeuvre d'art",
    client: "Aucoin Hart Jewelers",
    category: "Brand Film",
    blurb: "Gold Addy winner. A two-part campaign in the style of Truffaut and Godard — French New Wave shot on the streets of New Orleans.",
    poster: "/images/work-aucoin-hart.jpg",
    video: "/video/work-aucoin-hart.mp4",
    span: "wide",
    films: [
      { label: "Part I", youtubeId: "9jG69cUBXlM" },
      { label: "Part II", youtubeId: "EKBfIJaogKc" },
    ],
    award: "Gold Addy Award",
    logline:
      "A New Orleans jeweler, told in the language of the French New Wave.",
    approach: {
      heading: "Truffaut and Godard, by way of New Orleans.",
      body: [
        "Made with the agency Brand Society, the campaign borrows its grammar from the French New Wave — but its real inspiration was the city itself.",
        "Part I keeps the jewelry at the center while following a customer through the moments in a life where a piece starts to mean something. Part II picks the story back up as a relationship, warm and a little bittersweet, set against the same streets.",
        "Both films won Gold Addy Awards.",
      ],
      references: ["François Truffaut", "Jean-Luc Godard", "French New Wave", "New Orleans"],
    },
    credits: [
      { role: "Client", name: "Aucoin Hart Jewelers" },
      { role: "Agency", name: "Brand Society" },
      { role: "Production Company", name: "Fire on the Bayou" },
      { role: "Director", name: "Jason Villemarette" },
      { role: "Recognition", name: "Gold Addy Award — Part I" },
      { role: "Recognition", name: "Gold Addy Award — Part II" },
    ],
  },
  {
    slug: "home-depot",
    title: "Team Depot",
    client: "Home Depot",
    category: "Brand Film",
    blurb: "A national nonprofit story, told through the New Orleans homes still being rebuilt.",
    poster: "/images/work-home-depot.jpg",
    video: "/video/work-home-depot.mp4",
    span: "regular",
    films: [{ label: "Brand Film", youtubeId: "71qT6GkaUiQ" }],
    logline: "Every purchase helps rebuild a New Orleans home.",
    approach: {
      heading: "A corporate brand, telling a neighborhood story.",
      body: [
        "Team Depot is the Home Depot nonprofit restoring homes damaged by natural disasters — still urgent work in New Orleans, years after Katrina.",
        "The film is carried by its music, footage of the damaged houses, and interviews with the people Team Depot has helped — and lets viewers know their purchases keep that work going.",
      ],
    },
    credits: [
      { role: "Client", name: "The Home Depot" },
      { role: "Production Company", name: "Fire on the Bayou" },
      { role: "Director", name: "Jason Villemarette" },
    ],
  },
  {
    slug: "red-bull",
    title: "Street Kings",
    client: "Red Bull",
    category: "Brand Film",
    blurb: "Brass band New Creations, shot live in the streets for Red Bull's annual Street Kings competition.",
    poster: "/images/work-red-bull.jpg",
    video: "/video/work-red-bull.mp4",
    span: "tall",
    films: [{ label: "Brand Film", youtubeId: "fyPEqUnW64U" }],
    logline: "A New Orleans brass band, chasing the Street Kings crown.",
    approach: {
      heading: "Give the band the platform.",
      body: [
        "Every year Red Bull sponsors Street Kings, a New Orleans brass band competition. This film follows contenders New Creations — an interview with the band, cut against their live performances in the streets.",
        "Directed, shot, and edited entirely in-house.",
      ],
    },
    credits: [
      { role: "Client", name: "Red Bull" },
      { role: "Featuring", name: "New Creations Brass Band" },
      { role: "Production Company", name: "Fire on the Bayou" },
      { role: "Director", name: "Jason Villemarette" },
    ],
  },
  {
    slug: "rouses",
    title: "Feels Like Home",
    client: "Rouses Markets",
    category: "Commercial",
    blurb: "A holiday brand spot developed with Rouses' in-house agency — scored in-house at Mid City Sound with recording artist Tyron Benoit.",
    poster: "/images/work-rouses.jpg",
    video: "/video/work-rouses.mp4",
    span: "regular",
    films: [{ label: "Holiday Spot", youtubeId: "t61-eZrV708" }],
    logline: "A Gulf Coast holiday that really does feel like home.",
    approach: {
      heading: "Concepted with Rouses, scored next door.",
      body: [
        "Jason worked directly with Rouses Markets' in-house agency to develop the concept from the ground up.",
        "Mid City Sound wrote and recorded the music with recording artist Tyron Benoit — and the sunlight and Gulf Coast locations took care of the rest.",
      ],
    },
    credits: [
      { role: "Client", name: "Rouses Markets" },
      { role: "Agency", name: "Rouses In-House" },
      { role: "Production Company", name: "Fire on the Bayou" },
      { role: "Director", name: "Jason Villemarette" },
      { role: "Music", name: "Mid City Sound" },
      { role: "Featuring", name: "Tyron Benoit" },
    ],
  },
  {
    slug: "reily-foods",
    title: "Reily Foods Commercial",
    client: "Reily Foods",
    category: "Commercial",
    blurb: "Blue Plate, Luzianne, French Market Coffee — a family-owned New Orleans institution, told as one story.",
    poster: "/images/work-reily-foods.jpg",
    video: "/video/work-reily-foods.mp4",
    span: "regular",
    films: [{ label: "Commercial", youtubeId: "DDFAYsJeNEk" }],
    logline: "The brands in every New Orleans kitchen, and the traditions behind them.",
    approach: {
      heading: "Nostalgia as the product.",
      body: [
        "Reily is a family-owned New Orleans company — Blue Plate, Luzianne, French Market Coffee and more. The spot ties those familiar labels to the feeling of belonging to the city.",
        "Scenic New Orleans locations and a voiceover carry the message: these products have been part of the city's traditions since the company's founding, and still are.",
      ],
    },
    credits: [
      { role: "Client", name: "Reily Foods" },
      { role: "Production Company", name: "Fire on the Bayou" },
      { role: "Director", name: "Louis Koerner" },
    ],
  },
  {
    slug: "blue-plate",
    title: "Frady's One-Stop",
    client: "Blue Plate Mayo / Reily Foods",
    category: "Commercial",
    blurb: "A New Orleans corner-store owner's story, told to sell a jar of mayonnaise — and it works.",
    poster: "/images/work-blue-plate.jpg",
    video: "/video/work-blue-plate.mp4",
    span: "tall",
    films: [{ label: "Commercial", youtubeId: "mi9d3ijqFxA" }],
    logline: "A corner-store owner's story, told to sell a jar of mayonnaise.",
    approach: {
      heading: "Sell the mayo by loving the city.",
      body: [
        "Kirk Frady, owner of Frady's One-Stop Food Store, tells the story of his store and his family's passion for making food people love.",
        "Tying Blue Plate to the neighborhood food stores of New Orleans lets the brand speak in the city's own voice — about its love for its food.",
      ],
    },
    credits: [
      { role: "Client", name: "Blue Plate Mayonnaise" },
      { role: "Featuring", name: "Kirk Frady, Frady's One-Stop" },
      { role: "Production Company", name: "Fire on the Bayou" },
    ],
  },
  {
    slug: "blue-runner",
    title: "Bigger Than Monday",
    client: "Blue Runner Foods",
    category: "Brand Film",
    blurb: "A timeless look inspired by Herman Leonard, the Blue Note album covers, and the jazz musicians of the past.",
    poster: "/images/work-blue-runner.jpg",
    video: "/video/work-blue-runner.mp4",
    span: "regular",
    films: [{ label: "Commercial", youtubeId: "SoIBpqmuVjg" }],
    logline: "Red beans, shot like a Blue Note record sleeve.",
    approach: {
      heading: "A timeless look, on purpose.",
      body: [
        "Jason and the agency Brand Society wanted something that would never look dated. The look draws on photographer Herman Leonard, the Blue Note album covers, and the jazz musicians of the past.",
        "That cinematic restraint is exactly what makes it stand out on TV and in the feed.",
      ],
      references: ["Herman Leonard", "Blue Note Records", "Jazz portraiture"],
    },
    credits: [
      { role: "Client", name: "Blue Runner Foods" },
      { role: "Agency", name: "Brand Society" },
      { role: "Production Company", name: "Fire on the Bayou" },
      { role: "Director", name: "Jason Villemarette" },
    ],
  },
  {
    slug: "crystal-hot-sauce",
    title: "Crystal Hot Sauce",
    client: "Crystal Hot Sauce",
    category: "Commercial",
    blurb: "A New Orleans pantry staple, shot with the same care as a national brand.",
    poster: "/images/work-crystal-hot-sauce.jpg",
    video: "/video/work-crystal-hot-sauce.mp4",
    span: "regular",
    films: [{ label: "Commercial", youtubeId: "vuS5CARLiak" }],
    logline: "A New Orleans pantry staple, shot with the care of a national brand.",
    credits: [
      { role: "Client", name: "Crystal Hot Sauce" },
      { role: "Agency", name: "Brand Society" },
      { role: "Production Company", name: "Fire on the Bayou" },
      { role: "Director", name: "Simon Blake" },
    ],
  },
  {
    slug: "sazerac-house",
    title: "Sazerac House Anthem",
    client: "Sazerac House",
    category: "Brand Film",
    blurb: "An anthem film for New Orleans' home of the Sazerac cocktail.",
    poster: "/images/work-sazerac-house.jpg",
    video: "/video/work-sazerac-house.mp4",
    span: "wide",
    films: [{ label: "Anthem", youtubeId: "G199DiFbPPY" }],
    logline: "An anthem for the home of the Sazerac.",
    credits: [
      { role: "Client", name: "Sazerac House" },
      { role: "Agency", name: "Trumpet" },
      { role: "Production Company", name: "Fire on the Bayou" },
      { role: "Director", name: "Jason Villemarette" },
    ],
  },
  {
    slug: "russell-athletic",
    title: "Russell Athletic",
    client: "Russell Athletic, feat. Mark Ingram",
    category: "Brand Film",
    blurb: "A brand film built around NFL running back and New Orleans native Mark Ingram.",
    poster: "/images/work-russell-athletic.jpg",
    video: "/video/work-russell-athletic.mp4",
    span: "regular",
    films: [{ label: "Brand Film", youtubeId: "UCkQXSFj5Ak" }],
    logline: "Mark Ingram, back home in New Orleans, for Russell Athletic.",
    credits: [
      { role: "Client", name: "Russell Athletic" },
      { role: "Agency", name: "TBWA\\Chiat\\Day" },
      { role: "Featuring", name: "Mark Ingram" },
      { role: "Production Company", name: "Fire on the Bayou" },
      { role: "Director", name: "Jason Villemarette" },
    ],
  },
];

/** Featured subset for the home page teaser. */
export const featuredProjects = projects.slice(0, 4);

/** The home page reel: one full-screen frame each, in this order. */
export const homeReel = ["aucoin-hart", "red-bull", "rouses", "sazerac-house", "blue-plate", "home-depot"]
  .map((slug) => projects.find((p) => p.slug === slug)!)
  .filter(Boolean);

/** Projects that have a screening-room page. */
export const screenedProjects = projects.filter((p) => p.films?.length);

export function getProject(slug: string) {
  return screenedProjects.find((p) => p.slug === slug);
}

/** Where a card should link: its own page if it has one, else the reel. */
export function projectHref(p: Project) {
  return p.films?.length ? `/work/${p.slug}` : "/work";
}

/** The next screened film after this one, wrapping around. */
export function nextScreened(slug: string) {
  const i = screenedProjects.findIndex((p) => p.slug === slug);
  return screenedProjects[(i + 1) % screenedProjects.length];
}
