/** The Process — narrative steps for the dedicated page + home strip. */
export type ProcessStep = {
  index: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    index: "01",
    title: "Discovery",
    description:
      "We start in conversation — your goals, your audience, the feeling you want to leave behind. No templates, no decks recycled from the last client.",
  },
  {
    index: "02",
    title: "Treatment",
    description:
      "A written and visual treatment: references, tone, shot logic, and sound direction. You see the film before a single frame is shot.",
  },
  {
    index: "03",
    title: "Production",
    description:
      "A tight, experienced crew on the ground in New Orleans. We move fast, protect the vision, and keep the set calm.",
  },
  {
    index: "04",
    title: "Sound & Score",
    description:
      "Voiceover, sound design, and mix are handled with the picture — so sound is designed together with the film, not stitched on at the end.",
  },
  {
    index: "05",
    title: "Finish",
    description:
      "Editorial and a hand-crafted color grade. Delivered in every format you need, built to look like film on any screen.",
  },
];

/**
 * The Post-Production tab on /process.
 * INTERIM COPY, built from the facilities already described on the site
 * (five edit and animation bays, sound design room, isolation booth).
 * Jason to supply the final copy and 3–4 stills.
 */
export const postProduction = {
  heading: "Where the film is finished.",
  intro:
    "Five edit and animation bays under one roof: editorial, color, graphics, sound, and delivery handled by the same team that shot the film.",
  steps: [
    { title: "Editorial", description: "Story first. Rough cut, revisions, and a locked picture you can sign off on." },
    { title: "Color", description: "A hand-crafted grade that makes it look like film on any screen." },
    { title: "Graphics & animation", description: "Titles, lower thirds, logo animation, and full motion graphics built in-house." },
    { title: "Sound design & voiceover", description: "Sound design room and an isolation booth for voiceover and ADR, with voice talent nationwide who can record remotely." },
    { title: "Delivery", description: "Every format you need — broadcast, web, and social cutdowns — and revisions whenever you need them." },
  ],
};
