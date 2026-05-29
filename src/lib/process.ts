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
      "Mid City Sound scores, mixes, and masters under our own roof — so picture and sound are designed together, not stitched together.",
  },
  {
    index: "05",
    title: "Finish",
    description:
      "Editorial and a hand-crafted color grade. Delivered in every format you need, built to look like film on any screen.",
  },
];
