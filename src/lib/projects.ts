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
    slug: "aucoin-hart",
    title: "Aeuvre d'art",
    client: "Aucoin Hart Jewelers",
    category: "Brand Film",
    year: "2023",
    blurb: "Gold Addy winner. A two-part campaign in the style of Truffaut and Godard — French New Wave shot on the streets of New Orleans.",
    poster: "/images/work-aucoin-hart.jpg",
    video: "/video/work-aucoin-hart.mp4",
    span: "wide",
  },
  {
    slug: "home-depot",
    title: "Team Depot",
    client: "Home Depot",
    category: "Brand Film",
    year: "2023",
    blurb: "A national nonprofit story, told through the New Orleans homes still being rebuilt.",
    poster: "/images/work-home-depot.jpg",
    video: "/video/work-home-depot.mp4",
    span: "regular",
  },
  {
    slug: "red-bull",
    title: "Street Kings",
    client: "Red Bull",
    category: "Music Video",
    year: "2023",
    blurb: "Brass band New Creations, shot live in the streets for Red Bull's annual Street Kings competition.",
    poster: "/images/work-red-bull.jpg",
    video: "/video/work-red-bull.mp4",
    span: "tall",
  },
  {
    slug: "rouses",
    title: "Feels Like Home",
    client: "Rouses Markets",
    category: "Commercial",
    year: "2023",
    blurb: "A holiday brand spot developed with Rouses' in-house agency — scored in-house at Mid City Sound with recording artist Tyron Benoit.",
    poster: "/images/work-rouses.jpg",
    video: "/video/work-rouses.mp4",
    span: "regular",
  },
  {
    slug: "reily-foods",
    title: "Reily Foods Commercial",
    client: "Reily Foods",
    category: "Commercial",
    year: "2023",
    blurb: "Blue Plate, Luzianne, French Market Coffee — a family-owned New Orleans institution, told as one story.",
    poster: "/images/work-reily-foods.jpg",
    video: "/video/work-reily-foods.mp4",
    span: "regular",
  },
  {
    slug: "blue-plate",
    title: "Frady's One-Stop",
    client: "Blue Plate Mayo / Reily Foods",
    category: "Commercial",
    year: "2023",
    blurb: "A New Orleans corner-store owner's story, told to sell a jar of mayonnaise — and it works.",
    poster: "/images/work-blue-plate.jpg",
    video: "/video/work-blue-plate.mp4",
    span: "tall",
  },
  {
    slug: "blue-runner",
    title: "Bigger Than Monday",
    client: "Blue Runner Foods",
    category: "Brand Film",
    year: "2023",
    blurb: "A timeless look inspired by Herman Leonard, the Blue Note album covers, and the jazz musicians of the past.",
    poster: "/images/work-blue-runner.jpg",
    video: "/video/work-blue-runner.mp4",
    span: "regular",
  },
  {
    slug: "crystal-hot-sauce",
    title: "Crystal Hot Sauce",
    client: "Crystal Hot Sauce",
    category: "Commercial",
    year: "2023",
    blurb: "A New Orleans pantry staple, shot with the same care as a national brand.",
    poster: "/images/work-crystal-hot-sauce.jpg",
    video: "/video/work-crystal-hot-sauce.mp4",
    span: "regular",
  },
];

/** Featured subset for the home page teaser. */
export const featuredProjects = projects.slice(0, 4);
