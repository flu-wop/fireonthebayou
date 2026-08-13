import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import StudioConnection from "@/components/sections/StudioConnection";
import Statement from "@/components/sections/Statement";
import Reveal from "@/components/effects/Reveal";
import Parallax from "@/components/effects/Parallax";
import CountUp from "@/components/effects/CountUp";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Fire on the Bayou is a New Orleans production house, home of Mid City Sound. Our story, our crew, and why sound lives under our own roof.",
};

// Small set of stat-style facts. Edit freely.
const stats = [
  { value: "20+", label: "Years in New Orleans" },
  { value: "Telly & Addy", label: "National award wins" },
  { value: "5", label: "Edit & animation bays" },
];

// Core crew, presented like closing credits — no photos needed, just the roles
// and the receipts. Keep this list short; it's a signature, not a directory.
const crew = [
  { name: "Jason Villemarette", role: "Founder / Director", note: "Innovator of the Year, City Business Magazine (2008)" },
  { name: "Kathy Hirsch", role: "Executive Producer", note: "25 years, ex-Peter Mayer Advertising" },
  { name: "David Reece", role: "Director of Photography", note: "Coca-Cola, ESPN, NFL" },
  { name: "Michael Sanchez", role: "Post-Production Supervisor", note: "Edit, animation, sound design" },
  { name: "Louis Koerner", role: "Director / DP", note: "Commercial & digital campaigns" },
  { name: "Simon Blake", role: "Creative / Design", note: "Permanent collection, MoMA" },
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
                  <CountUp value={s.value} />
                </p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-mist">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Crew — presented like closing credits, no photos, just the receipts */}
      <section className="frame py-28">
        <Reveal>
          <p className="eyebrow mb-12 text-center">The Crew</p>
        </Reveal>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
          {crew.map((c, i) => (
            <Reveal key={c.name} delay={(i % 2) * 0.08}>
              <div className="border-b border-border pb-4">
                <p className="font-display text-xl text-cream">{c.name}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-flame">
                  {c.role}
                </p>
                <p className="mt-1.5 text-sm text-mist">{c.note}</p>
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
