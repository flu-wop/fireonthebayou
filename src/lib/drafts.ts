/**
 * DRAFT — Morris Bart's Louisiana Hot Sauce (not shown on the site yet).
 *
 * Per James: Jason connected Morris Bart's new hot sauce with Rouses Markets
 * and ran the launch campaign; he also runs Morris Bart's billboard campaigns
 * across the region. Public reporting (Axios New Orleans, July 2026) confirms
 * the sauce launched at Rouses in spring 2026 but doesn't name the production
 * company — so confirm the details with Jason before publishing.
 *
 * To publish: fill in the YouTube IDs (and/or billboard images in
 * /public/images), add a poster frame, then move this object into `projects`
 * in src/lib/projects.ts and add "morris-bart" to `workOrder` (and `homeReel`
 * if it should be on the home page).
 */
import type { Project } from "./projects";

export const morrisBartDraft: Project = {
  slug: "morris-bart",
  title: "One Drip, That's It",
  client: "Morris Bart's Louisiana Hot Sauce",
  category: "Commercial",
  blurb: "Taking Morris Bart's hot sauce from a client giveaway to the shelves at Rouses.",
  poster: "/images/work-morris-bart.jpg", // TODO: add a frame or product shot
  video: "/video/work-morris-bart.mp4",
  span: "wide",
  films: [
    // { label: "Launch Spot", youtubeId: "TODO" },
  ],
  logline: "From a client giveaway to the shelves at *Rouses.*",
  approach: {
    heading: "Made the match, ran the launch.",
    body: [
      // TODO: Jason's account — how the Rouses partnership came together and what the campaign ran on.
    ],
  },
  credits: [
    { role: "Client", name: "Morris Bart's Louisiana Hot Sauce" },
    { role: "Retail Partner", name: "Rouses Markets" },
    { role: "Production Company", name: "Fire on the Bayou" },
    { role: "Director", name: "Jason Villemarette" }, // TODO: confirm
  ],
};
