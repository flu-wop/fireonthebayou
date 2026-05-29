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
  year: string;
  /** Short one-line description shown on hover / detail */
  blurb: string;
  poster: string; // /public/images/...
  video: string; // /public/video/...  (muted, looping, hover-to-play)
  /** Layout hint for the masonry-ish grid */
  span: "wide" | "tall" | "regular";
};

export const projects: Project[] = [
  {
    slug: "bayou-after-dark",
    title: "Bayou After Dark",
    client: "Crescent City Spirits",
    category: "Brand Film",
    year: "2025",
    blurb: "A 90-second brand film shot on the water at golden hour.",
    poster: "/images/work-bayou-after-dark.jpg",
    video: "/video/work-bayou-after-dark.mp4",
    span: "wide",
  },
  {
    slug: "second-line",
    title: "Second Line",
    client: "NOLA Brass Collective",
    category: "Music Video",
    year: "2025",
    blurb: "Brass-band energy captured across three French Quarter blocks.",
    poster: "/images/work-second-line.jpg",
    video: "/video/work-second-line.mp4",
    span: "tall",
  },
  {
    slug: "below-sea-level",
    title: "Below Sea Level",
    client: "Independent",
    category: "Documentary",
    year: "2024",
    blurb: "A documentary portrait of the city's street drummers.",
    poster: "/images/work-below-sea-level.jpg",
    video: "/video/work-below-sea-level.mp4",
    span: "regular",
  },
  {
    slug: "ember-room",
    title: "The Ember Room",
    client: "Saint Charles Hospitality",
    category: "Commercial",
    year: "2025",
    blurb: "A moody hospitality spot lit entirely by candle and neon.",
    poster: "/images/work-ember-room.jpg",
    video: "/video/work-ember-room.mp4",
    span: "regular",
  },
  {
    slug: "high-water",
    title: "High Water",
    client: "Gulf South Records",
    category: "Music Video",
    year: "2024",
    blurb: "A single-take performance video flooded in amber light.",
    poster: "/images/work-high-water.jpg",
    video: "/video/work-high-water.mp4",
    span: "tall",
  },
  {
    slug: "the-makers",
    title: "The Makers",
    client: "Magazine Street Guild",
    category: "Brand Film",
    year: "2025",
    blurb: "A series profiling the craftspeople of Magazine Street.",
    poster: "/images/work-the-makers.jpg",
    video: "/video/work-the-makers.mp4",
    span: "wide",
  },
];

/** Featured subset for the home page teaser. */
export const featuredProjects = projects.slice(0, 4);
