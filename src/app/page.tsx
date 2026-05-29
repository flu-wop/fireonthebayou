/**
 * Home (/)
 * --------
 * Above-the-fold = <Hero/>. Below: a scroll-illuminated mission statement, a
 * marquee, latest work teaser, the Mid City Sound differentiator, a services
 * preview, and the global footer CTA.
 *
 * This file is intentionally a thin composition layer — every visual unit lives
 * in /components/sections so pages stay readable and editable.
 */
import Hero from "@/components/sections/Hero";
import Statement from "@/components/sections/Statement";
import Marquee from "@/components/sections/Marquee";
import WorkTeaser from "@/components/sections/WorkTeaser";
import StudioConnection from "@/components/sections/StudioConnection";
import ServicesPreview from "@/components/sections/ServicesPreview";

export default function HomePage() {
  return (
    <>
      {/* ===== ABOVE THE FOLD ===== */}
      <Hero />

      {/* ===== Scroll-illuminated mission statement ===== */}
      <Statement text="We are a New Orleans production house for brands and artists who refuse to look like everyone else. Cinematic film, sound, and story — made with heat." />

      {/* ===== Capability marquee ===== */}
      <Marquee
        items={[
          "Brand Films",
          "Music Videos",
          "Documentary",
          "Commercial",
          "Original Score",
          "Color & Finish",
        ]}
      />

      {/* ===== Latest work ===== */}
      <WorkTeaser />

      {/* ===== Mid City Sound connection ===== */}
      <StudioConnection />

      {/* ===== Services preview ===== */}
      <ServicesPreview />
    </>
  );
}
