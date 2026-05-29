import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import WorkGrid from "@/components/sections/WorkGrid";
import Marquee from "@/components/sections/Marquee";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected brand films, music videos, documentary, and commercial work from Fire on the Bayou.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected Work"
        title={<>The<br />reel.</>}
        lede="Films we've shot for brands, artists, and storytellers across the Gulf South. Hover any frame to watch it move."
      />
      <section className="frame pb-28">
        <WorkGrid />
      </section>
      <Marquee
        items={["Shot in New Orleans", "Scored at Mid City Sound", "Graded like film"]}
      />
    </>
  );
}
