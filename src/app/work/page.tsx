import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import WorkGrid from "@/components/sections/WorkGrid";
import Marquee from "@/components/sections/Marquee";
import FilmArchive from "@/components/sections/FilmArchive";
import { archive } from "@/lib/archive";

export const metadata: Metadata = {
  alternates: { canonical: "/work" },
  title: "Work",
  description:
    "Selected commercials, brand films, and corporate work from Fire on the Bayou.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Selected Work"
        title={<>The<br />reel.</>}
        lede="Commercials and brand films for the companies that make New Orleans run. Pick a film to step into its screening room."
      />
      <section className="frame pb-28">
        <WorkGrid />
      </section>
      <FilmArchive films={archive} />
      <Marquee
        items={["Shot in New Orleans", "Scored at Mid City Sound", "Graded like film"]}
      />
    </>
  );
}
