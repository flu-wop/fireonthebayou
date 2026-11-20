import PageHeader from "@/components/sections/PageHeader";
import NextStep from "@/components/sections/NextStep";
import Statement from "@/components/sections/Statement";
import Reveal from "@/components/effects/Reveal";
import Parallax from "@/components/effects/Parallax";
import CountUp from "@/components/effects/CountUp";
import LogoWall from "@/components/sections/LogoWall";
import MediaSlot from "@/components/media/MediaSlot";
import { getCrew, getSettings } from "@/lib/content";
import { FOUNDER_PHOTO_PATH, crewPortraitPath, getMediaOverrides, resolveWith } from "@/lib/media";

// Small set of stat-style facts. Edit freely.
const stats = [
  { value: "20+", label: "Years of production" },
  { value: "Telly & Addy", label: "National award wins" },
  { value: "5", label: "Edit & animation bays" },
];

export default async function StudioView({ draft }: { draft?: boolean }) {
  const [crewRecs, settings, map] = await Promise.all([getCrew({ draft }), getSettings({ draft }), getMediaOverrides()]);
  const crew = crewRecs.map((r) => ({ ...r.data, slug: r.key }));
  const founderPhoto = resolveWith(map, FOUNDER_PHOTO_PATH);
  return (
    <>
      <PageHeader
        eyebrow="Studio"
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
              The idea hasn&rsquo;t changed: start a fire with passion, the right
              talent, and integrity &mdash; and do serious work without taking
              ourselves too seriously.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 font-mono text-[13px] tracking-wide text-mist">
              Trusted by Aucoin Hart &middot; Reily Foods &middot; Rouses &middot; Audubon
            </p>
          </Reveal>
        </div>

        <div className="md:col-span-6">
          <figure>
            {founderPhoto ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border">
                <Parallax speed={0.35} className="absolute inset-0 h-[120%] -top-[10%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={founderPhoto}
                    alt={`${settings.founderName}, ${settings.founderRole.toLowerCase()} of Fire on the Bayou`}
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
                  alt="Fire on the Bayou"
                  width={297}
                  height={107}
                  className="relative w-[58%] max-w-[300px]"
                />
              </div>
            )}
            <figcaption className="mt-4 flex flex-col gap-1 text-sm lg:flex-row lg:items-baseline lg:justify-between lg:gap-4">
              <span className="font-semibold text-cream">{settings.founderName}</span>
              <span className="text-mist">{settings.founderRole}</span>
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

      {/* Crew — set like film credits, with portraits where supplied */}
      <section className="frame py-28">
        <Reveal>
          <p className="eyebrow mb-12 text-center">The Crew</p>
        </Reveal>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {crew.map((c, i) => (
            <Reveal key={c.slug} delay={(i % 3) * 0.08}>
              <div>
                <div className="mb-5 aspect-[4/5] overflow-hidden rounded-sm border border-border">
                  <MediaSlot
                    src={crewPortraitPath(c.slug)}
                    alt={`${c.name}, ${c.role}`}
                    placeholder={{
                      variant: "crew",
                      label: "PORTRAIT 1000×1250",
                      size: "1000×1250 JPG (4:5)",
                      where: `/public${crewPortraitPath(c.slug)}`,
                      title: c.name,
                      aspect: "aspect-[4/5]",
                    }}
                  />
                </div>
                <div className="border-b border-border pb-4">
                  <p className="font-display text-xl text-cream">{c.name}</p>
                  <p className="mt-1 font-mono text-[13px] tracking-wide text-flame">{c.role}</p>
                  <p className="mt-1.5 text-sm text-mist">{c.note}</p>
                  {c.href && (
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
              Twenty years of New Orleans brands and institutions.
            </p>
          </div>
          <LogoWall draft={draft} />
        </div>
      </section>


      <Statement text="We don't just shoot in *New* *Orleans.* We're of it — the rhythm, the heat, the stories that only happen *below* *sea* *level.*" />
      <NextStep line="Let's make something." />
    </>
  );
}
