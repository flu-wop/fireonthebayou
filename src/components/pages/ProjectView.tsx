import { jsonLd as ldJson } from "@/lib/json-ld";
import Link from "next/link";
import { notFound } from "next/navigation";
import ScreeningRoom from "@/components/film/ScreeningRoom";
import CreditsRoll from "@/components/film/CreditsRoll";
import Statement from "@/components/sections/Statement";
import Reveal from "@/components/effects/Reveal";
import { ytThumb } from "@/lib/catalog";
import { getProjects } from "@/lib/content";
import type { ProjectData } from "@/lib/content/types";
import { getMediaOverrides, projectPosterPath, resolveWith, type MediaMap } from "@/lib/media";
import { site } from "@/lib/site";

/** Loglines mark crimson words with *asterisks*; strip them for plain-text uses. */
export const plain = (s: string) => s.replace(/\*/g, "");

export const screened = (p: ProjectData) => Boolean(p.writeup) && p.youtubeIds.length > 0;
export const posterFor = (map: MediaMap, p: ProjectData) => resolveWith(map, projectPosterPath(p.slug)) ?? (p.youtubeIds[0] ? ytThumb(p.youtubeIds[0]) : "");
export const filmsFor = (p: ProjectData) =>
  p.youtubeIds.map((id, i) => ({ label: p.writeup?.filmLabels?.[id] ?? (p.youtubeIds.length > 1 ? `Part ${i + 1}` : "Film"), youtubeId: id }));

export default async function ProjectView({ slug, draft }: { slug: string; draft?: boolean }) {
  const [all, map] = await Promise.all([getProjects({ draft }), getMediaOverrides()]);
  const list = all.map((r) => r.data).filter(screened);
  const p = list.find((x) => x.slug === slug);
  if (!p || !p.writeup) notFound();
  const w = p.writeup;
  const films = filmsFor(p);
  const poster = posterFor(map, p);
  const next = list[(list.findIndex((x) => x.slug === slug) + 1) % list.length];

  const data = films.map((f) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: films.length > 1 ? `${p.title} — ${f.label}` : p.title,
    description: w.logline ? plain(w.logline) : w.blurb ?? p.title,
    thumbnailUrl: [poster.startsWith("http") ? poster : `${site.url}${poster}`],
    embedUrl: `https://www.youtube.com/embed/${f.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${f.youtubeId}`,
    productionCompany: { "@type": "Organization", name: site.name, url: site.url },
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(data)} />

      <ScreeningRoom
        films={films}
        poster={poster}
        title={p.title}
        client={p.client}
        category={w.category ?? "Commercial"}
        year={w.year}
        award={w.award}
      />

      {w.logline && <Statement text={w.logline} />}

      {w.approach && (
        <section className="frame grid gap-12 pb-28 md:grid-cols-12 md:gap-16 md:pb-36">
          <div className="md:col-span-5">
            <Reveal>
              <p className="eyebrow mb-6">The Approach</p>
              <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-light leading-[1.02] tracking-tight text-cream">
                {w.approach.heading}
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {w.approach.body.map((para, i) => (
              <Reveal key={i} delay={0.08 * i}>
                <p className="mb-6 text-lg leading-relaxed text-mist">{para}</p>
              </Reveal>
            ))}
            {w.approach.references && (
              <Reveal delay={0.2}>
                <div className="mt-10 border-t border-border pt-6">
                  <p className="mb-4 font-mono text-[13px] tracking-wide text-ash">
                    References
                  </p>
                  <ul className="flex flex-wrap gap-2">
                    {w.approach.references.map((r) => (
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

      {w.credits && <CreditsRoll credits={w.credits} />}


      {next && next.slug !== p.slug && (
        <Link
          href={`/work/${next.slug}`}
          className="group relative block h-[70svh] min-h-[460px] overflow-hidden border-t border-border"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={posterFor(map, next)}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-40 transition-all duration-1000 ease-cinematic group-hover:scale-100 group-hover:opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
          <div className="frame relative flex h-full flex-col justify-end pb-16">
            <p className="eyebrow mb-4">Next Film</p>
            <p className="font-mono text-[13px] tracking-wide text-mist">{next.client}</p>
            <p className="mt-2 font-display text-[clamp(2.8rem,8vw,7rem)] font-light leading-[0.9] tracking-tight text-cream">
              {next.title}{" "}
              <span className="inline-block text-flame transition-transform duration-700 ease-cinematic group-hover:translate-x-3">→</span>
            </p>
          </div>
        </Link>
      )}
    </>
  );
}
