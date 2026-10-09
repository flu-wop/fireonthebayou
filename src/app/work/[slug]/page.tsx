/**
 * /work/[slug] — the screening room
 * ---------------------------------
 * 1. The film, full-bleed, silent until you Roll sound.
 * 2. The logline.
 * 3. The approach — the creative idea and its references.
 * 4. End credits, rolled.
 * 5. Next film.
 *
 * Only projects with `films` in src/lib/projects.ts get a page.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScreeningRoom from "@/components/film/ScreeningRoom";
import CreditsRoll from "@/components/film/CreditsRoll";
import Statement from "@/components/sections/Statement";
import Reveal from "@/components/effects/Reveal";
import { getProject, nextScreened, screenedProjects } from "@/lib/projects";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return screenedProjects.map((p) => ({ slug: p.slug }));
}

/** Loglines mark crimson words with *asterisks*; strip them for plain-text uses. */
const plain = (s: string) => s.replace(/\*/g, "");

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  const title = `${p.title} — ${p.client}`;
  const description = p.logline
    ? `${plain(p.logline)} ${p.category} for ${p.client} by ${site.name}, New Orleans.`
    : p.blurb;
  return {
    title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: {
      title,
      description,
      url: `/work/${p.slug}`,
      type: "video.other",
      images: [p.poster],
    },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || !p.films) notFound();
  const next = nextScreened(p.slug);

  // VideoObject data so the films can show up in video search results.
  const jsonLd = p.films.map((f) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: p.films!.length > 1 ? `${p.title} — ${f.label}` : p.title,
    description: p.logline ? plain(p.logline) : p.blurb,
    thumbnailUrl: [`${site.url}${p.poster}`],
    embedUrl: `https://www.youtube.com/embed/${f.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${f.youtubeId}`,
    // TODO: add uploadDate once real release dates are confirmed with Jason.
    productionCompany: { "@type": "Organization", name: site.name, url: site.url },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ScreeningRoom
        films={p.films}
        poster={p.poster}
        title={p.title}
        client={p.client}
        category={p.category}
        year={p.year}
        award={p.award}
      />

      {p.logline && <Statement text={p.logline} />}

      {p.approach && (
        <section className="frame grid gap-12 pb-28 md:grid-cols-12 md:gap-16 md:pb-36">
          <div className="md:col-span-5">
            <Reveal>
              <p className="eyebrow mb-6">The Approach</p>
              <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-light leading-[1.02] tracking-tight text-cream">
                {p.approach.heading}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {p.approach.body.map((para, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <p className="mb-6 text-lg leading-relaxed text-mist">{para}</p>
              </Reveal>
            ))}
            {p.approach.references && (
              <Reveal delay={0.2}>
                <div className="mt-10 border-t border-border pt-6">
                  <p className="mb-4 font-mono text-[13px] tracking-wide text-ash">
                    References
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {p.approach.references.map((r) => (
                      <li
                        key={r}
                        className="rounded-full border border-border px-4 py-2 font-mono text-[13px] tracking-wide text-cream"
                      >
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {p.credits && <CreditsRoll credits={p.credits} />}

      {/* ---- Next film ---- */}
      {next && next.slug !== p.slug && (
        <Link
          href={`/work/${next.slug}`}
          className="group relative block h-[70svh] min-h-[460px] overflow-hidden border-t border-border"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={next.poster}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-40 transition-all duration-1000 ease-cinematic group-hover:scale-100 group-hover:opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
          <div className="frame relative flex h-full flex-col justify-end pb-16">
            <p className="eyebrow mb-4">Next Film</p>
            <p className="font-mono text-[13px] tracking-wide text-mist">
              {next.client}
            </p>
            <p className="mt-2 font-display text-[clamp(2.8rem,8vw,7rem)] font-light leading-[0.9] tracking-tight text-cream">
              {next.title}{" "}
              <span className="inline-block text-flame transition-transform duration-700 ease-cinematic group-hover:translate-x-3">
                →
              </span>
            </p>
          </div>
        </Link>
      )}
    </>
  );
}
