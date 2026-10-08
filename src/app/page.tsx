/**
 * Home (/) — the reel
 * -------------------
 * The page plays like a reel: the hero reel, then one full-screen frame per
 * featured film (with a REC timecode + chapter list alongside), then the
 * paid consult. Mid City Sound and merch live on the Studio (/about) page.
 *
 * Featured films and their order: `homeReel` in src/lib/projects.ts.
 */
import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import ReelFrames from "@/components/sections/ReelFrames";
import ConsultCTA from "@/components/sections/ConsultCTA";
import { homeReel } from "@/lib/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ReelFrames projects={homeReel} />
      <ConsultCTA />
    </>
  );
}
