import type { Metadata } from "next";
import StudioView from "@/components/pages/StudioView";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = (): Promise<Metadata> =>
  pageMetadata("/about", {
    title: "Studio",
    description:
      "Fire on the Bayou is a New Orleans production house: five edit and animation bays, a sound stage, a grip truck, a sound design room, and the crew behind the work.",
  });

export default function AboutPage() {
  return <StudioView />;
}
