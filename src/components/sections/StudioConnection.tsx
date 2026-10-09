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
import Button from "@/components/ui/Button";

export default function StudioConnection() {
  return (
    <section className="relative overflow-hidden bg-bayou">
      <div className="frame grid items-center gap-12 py-24 md:grid-cols-2 md:gap-20 md:py-36">
        {/* Logo panel — links to the studio */}
        <a
          href={site.studio.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${site.studio.name} — visit the studio site`}
          className="group relative grid aspect-[4/3] place-items-center overflow-hidden rounded-sm border border-border bg-ink md:aspect-[4/5]"
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-70 transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: "radial-gradient(55% 45% at 50% 50%, rgba(212,175,119,0.14) 0%, transparent 70%)" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mcs-logo.webp"
            alt={`${site.studio.name} — New Orleans`}
            width={900}
            height={532}
            className="relative w-[72%] max-w-[420px] transition-transform duration-700 ease-cinematic group-hover:scale-[1.03]"
          />
        </a>

        {/* Copy */}
        <div>
          <Reveal>
            <p className="eyebrow mb-6">The Advantage</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(2.2rem,5vw,4rem)] font-light leading-[1] text-cream">
              Picture and sound,
              <br />
              designed <span className="text-flame">together.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            {/* Keep the two businesses' facilities separate — don't merge these lists. */}
            <dl className="mt-8 grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-[13px] font-semibold text-cream">{site.studio.name}</dt>
                <dd className="mt-2 font-mono text-[13px] leading-relaxed tracking-wide text-ash">
                  3 studio rooms
                </dd>
              </div>
              <div>
                <dt className="text-[13px] font-semibold text-cream">{site.name}</dt>
                <dd className="mt-2 font-mono text-[13px] leading-relaxed tracking-wide text-ash">
                  5 edit &amp; animation bays<br />Sound stage<br />Grip truck<br />Sound design room
                </dd>
              </div>
            </dl>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-9">
              <Button href={site.studio.url} variant="outline">
                Visit {site.studio.name} ↗
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
