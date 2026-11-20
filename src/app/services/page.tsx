import type { Metadata } from "next";
import ServicesView from "@/components/pages/ServicesView";
import { pageMetadata } from "@/lib/seo";

export const generateMetadata = (): Promise<Metadata> =>
  pageMetadata("/services", {
    title: "Services",
    description:
      "TV and web commercials, social content, brand films, corporate and nonprofit video, events, animation, voiceover and sound, and post — handled end to end by Fire on the Bayou in New Orleans.",
  });

export default function ServicesPage() {
  return <ServicesView />;
}
