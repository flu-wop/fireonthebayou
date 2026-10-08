import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import StudioConnection from "@/components/sections/StudioConnection";
import MerchBand from "@/components/sections/MerchBand";
import NextStep from "@/components/sections/NextStep";
import Statement from "@/components/sections/Statement";
import Reveal from "@/components/effects/Reveal";
import Parallax from "@/components/effects/Parallax";
import CountUp from "@/components/effects/CountUp";
import { site } from "@/lib/site";
import { agencies, clients } from "@/lib/clients";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "Our Story",
  description:
    "Fire on the Bayou is a New Orleans production house, home of Mid City Sound. Our story, our crew, and why sound lives under our own roof.",
};

// Small set of stat-style facts. Edit freely.
const stats = [
  { value: "20+", label: "Years of production" },
  { value: "Telly & Addy", label: "National award wins" },
  { value: "5", label: "Edit & animation bays" },
];

// Core crew, presented like closing credits — no photos needed, just the roles
// and the receipts. Keep this list short; it's a signature, not a directory.
const crew = [
  { name: "Jason Villemarette", role: "Founder & Director", href: site.socials.linkedin, note: "Founded FOTB in 2006 · City Business Innovator of the Year (2008)" },
  { name: "Kathy Hirsch", role: "Producer", note: "23 years heading broadcast production at Peter Mayer" },
  { name: "David Reece", role: "Director of Photography", note: "Coca-Cola, ESPN, NFL" },
  { name: "Michael Sanchez", role: "Post-Production Supervisor", note: "Edit, animation, sound design" },
  { name: "Louis Koerner", role: "Director", note: "Director/DP · commercial & digital campaigns" },
  { name: "Simon Blake", role: "Director", note: "Two AICP awards · permanent collection, MoMA" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title={<>Made in<br /><span className="text-flame">New Orleans.</span></>}
        lede="Fire on the Bayou grew out of a simple idea: a production house where the camera and the console live in the same building."
      />

      {/* Narrative + portrait */}
      <section className="frame grid items-center gap-12 pb-28 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-6">
          <Reveal>
            <p className="text-lg leading-relaxed text-mist">
              Jason Villemarette started out as a video editor and animator in
              1998, and founded Fire on the Bayou in 2006. A native New Orleanian
              and UNO graduate, he&rsquo;s grown it into a full production house
              &mdash; five edit and animation bays, a sound stage, a grip truck, a
              sound design room, and a stable of directors.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 text-lg leading-relaxed text-mist">
              <span className="text-cream">{site.studio.name}</span>, our
              recording and mixing studio, lives under the same roof. And the
              idea hasn&rsquo;t changed: start a fire with passion, the right
              talent, and integrity &mdash; and do serious work without taking
              ourselves too seriously.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 font-mono text-[13px] tracking-wide text-mist">
              Trusted by Aucoin Hart &middot; The Home Depot &middot; Red Bull &middot; Reily Foods &middot; Rouses &middot; Audubon
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-6">
          <figure>
            {site.founder.photo ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border">
                <Parallax speed={0.35} className="absolute inset-0 h-[120%] -top-[10%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={site.founder.photo}
                    alt={`${site.founder.name}, ${site.founder.role.toLowerCase()} of ${site.name}`}
                    className="h-full w-full object-cover"
                  />
                </Parallax>
                <div className="vignette absolute inset-0" />
              </div>
            ) : (
              // Until Jason's portrait arrives: the Fire on the Bayou logo on black.
              <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-sm border border-border bg-ink">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "radial-gradient(50% 40% at 50% 50%, rgba(208,17,70,0.14) 0%, transparent 70%)" }}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/fotb-logo.png"
                  alt={site.name}
                  width={297}
                  height={107}
                  className="relative w-[58%] max-w-[300px]"
                />
              </div>
            )}
            <figcaption className="mt-4 flex flex-col gap-1 text-sm lg:flex-row lg:items-baseline lg:justify-between lg:gap-4">
              <span className="font-semibold text-cream">{site.founder.name}</span>
              <span className="text-mist">{site.founder.role}</span>
            </figcaption>
          </figure>
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
                <p className="mt-3 font-mono text-[13px] tracking-wide text-mist">
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
                <p className="mt-1 font-mono text-[13px] tracking-wide text-flame">
                  {c.role}
                </p>
                <p className="mt-1.5 text-sm text-mist">{c.note}</p>
                {"href" in c && c.href && (
                  <a
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm text-cream underline decoration-cream/30 underline-offset-4 transition-colors hover:text-flame"
                  >
                    Follow Jason on LinkedIn ↗
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Clients — the long list, set like a credits crawl */}
      <section className="border-t border-border bg-bayou-deep py-24 md:py-32" aria-labelledby="clients-title">
        <div className="frame">
          <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <h2 id="clients-title" className="font-display text-[clamp(2.4rem,6vw,5rem)] leading-[0.9] text-cream">
              Who we&rsquo;ve
              <br />
              made films for
            </h2>
            <p className="max-w-sm text-sm leading-relaxed text-mist">
              Twenty years of New Orleans brands, institutions, and the occasional rock star.
            </p>
          </div>
          <ul className="columns-2 gap-x-10 text-base leading-[2.1] text-cream sm:columns-3 lg:columns-4">
            {clients.map((c) => (
              <li key={c} className="break-inside-avoid">{c}</li>
            ))}
          </ul>
          <p className="mt-14 border-t border-border pt-6 text-sm text-mist">
            <span className="text-flame">Agency partners</span>&ensp;{agencies.join(" · ")}
          </p>
        </div>
      </section>

      {/* Mid City Sound deep-dive */}
      <StudioConnection />
      <MerchBand />

      <Statement text="We don't just shoot in New Orleans. *We're* *of* *it* — the rhythm, the heat, the stories that only happen *below* *sea* *level.*" />
      <NextStep line="Let's make something." />
    </>
  );
}
