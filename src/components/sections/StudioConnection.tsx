"use client";

/**
 * StudioConnection
 * ----------------
 * The Mid City Sound tie-in. Split layout: a parallaxing image panel beside a
 * statement about sound + score being in-house. This is the differentiator that
 * justifies higher-ticket clients.
 */
import { site } from "@/lib/site";
import Reveal from "@/components/effects/Reveal";
import Parallax from "@/components/effects/Parallax";
import Button from "@/components/ui/Button";

export default function StudioConnection() {
  return (
    <section className="relative overflow-hidden bg-bayou">
      <div className="frame grid items-center gap-12 py-24 md:grid-cols-2 md:gap-20 md:py-36">
        {/* Image panel */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border">
          <Parallax speed={0.4} className="absolute inset-0 h-[120%] -top-[10%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/studio-mid-city-sound.jpg"
              alt={`${site.studio.name} recording studio`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bayou/80 to-transparent" />
          </Parallax>
          <span className="absolute bottom-6 left-6 font-mono text-[11px] uppercase tracking-widest text-flame">
            {site.studio.name}
          </span>
        </div>

        {/* Copy */}
        <div>
          <Reveal>
            <p className="eyebrow mb-6">The advantage</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1] text-cream">
              Picture and sound,
              <br />
              <span className="text-fire-gradient italic">designed together.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-7 max-w-md text-base leading-relaxed text-mist">
              {site.studio.blurb} Most production houses outsource the score and
              the mix. We walk it down the hall. That means tighter turnarounds,
              a unified sonic identity, and a film that sounds as deliberate as
              it looks.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-ash">
              <li>5 edit &amp; animation bays</li>
              <li>Sound stage</li>
              <li>Grip truck</li>
              <li>Sound design room</li>
            </ul>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9">
              <Button href="/about" variant="outline">
                Our story
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
