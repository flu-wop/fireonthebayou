import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import StudioConnection from "@/components/sections/StudioConnection";
import Statement from "@/components/sections/Statement";
import Reveal from "@/components/effects/Reveal";
import Parallax from "@/components/effects/Parallax";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Fire on the Bayou is a New Orleans production house, home of Mid City Sound. Our story, our crew, and why sound lives under our own roof.",
};

// Small set of stat-style facts. Edit freely.
const stats = [
  { value: "20+", label: "Years in New Orleans" },
  { value: "Gold", label: "Addy Award winner" },
  { value: "1", label: "Studio under one roof" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title={<>Made in<br />New Orleans.</>}
        lede="Fire on the Bayou grew out of a simple idea: a production house where the camera and the console live in the same building."
      />

      {/* Narrative + portrait */}
      <section className="frame grid items-center gap-12 pb-28 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-6">
          <Reveal>
            <p className="text-lg leading-relaxed text-mist">
              We started as a crew of New Orleans filmmakers and musicians who
              were tired of watching great footage get a mediocre mix. So we
              built the answer ourselves — a production house with{" "}
              <span className="text-cream">{site.studio.name}</span>, our own
              recording and mixing studio, in the next room.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 text-lg leading-relaxed text-mist">
              The name is the city: a little bit fire, a little bit bayou. Heat
              and patience. That tension runs through everything we make — work
              that&rsquo;s bold enough to stop a scroll and crafted enough to
              hold up on a festival screen.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-mist">
              Trusted by Home Depot &middot; Red Bull &middot; Reily Foods &middot; Rouses &middot; NOPD
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-6">
          <div className="relative aspect-[5/6] overflow-hidden rounded-sm border border-border">
            <Parallax speed={0.35} className="absolute inset-0 h-[120%] -top-[10%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about-crew.jpg"
                alt="The Fire on the Bayou crew on set"
                className="h-full w-full object-cover"
              />
            </Parallax>
            <div className="vignette absolute inset-0" />
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-border bg-bayou-deep">
        <div className="frame grid grid-cols-1 divide-border md:grid-cols-3 md:divide-x">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="px-4 py-14 text-center">
                <p className="text-fire-gradient font-display text-6xl font-light md:text-7xl">
                  {s.value}
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-mist">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Mid City Sound deep-dive */}
      <StudioConnection />

      <Statement text="We don't just shoot in New Orleans. We're of it — the rhythm, the heat, the stories that only happen below sea level." />
    </>
  );
}
