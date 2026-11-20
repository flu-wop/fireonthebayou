import { jsonLd as ldJson } from "@/lib/json-ld";
import PageHeader from "@/components/sections/PageHeader";
import WorkBrowser from "@/components/work/WorkBrowser";
import type { WorkItem } from "@/components/work/types";
import { labelFor } from "@/lib/catalog";
import { getProjects, getTaxonomy } from "@/lib/content";
import { site } from "@/lib/site";
import { getMediaOverrides, projectPosterPath, projectPreviewPath, resolveWith } from "@/lib/media";

export default async function WorkView({ draft }: { draft?: boolean }) {
  const [projects, tax, map] = await Promise.all([getProjects({ draft }), getTaxonomy({ draft }), getMediaOverrides()]);
  const items: WorkItem[] = projects.map(({ data: p }) => ({
    slug: p.slug,
    title: p.title,
    client: p.client,
    industries: p.industries,
    formats: p.formats,
    youtubeIds: p.youtubeIds,
    featured: p.featured,
    writeup: Boolean(p.writeup && p.youtubeIds.length),
    posterUrl: resolveWith(map, projectPosterPath(p.slug)),
    previewUrl: resolveWith(map, projectPreviewPath(p.slug)),
    tags: [...p.formats.map((k) => labelFor(tax.formats, k)), ...p.industries.map((k) => labelFor(tax.industries, k))],
  }));
  // Structured video data so the films can appear in video search results.
  // (uploadDate is omitted until real release dates are confirmed.)
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items
      .filter((i) => i.youtubeIds.length > 0)
      .map((i, n) => ({
        "@type": "ListItem",
        position: n + 1,
        item: {
          "@type": "VideoObject",
          name: `${i.title} — ${i.client}`,
          description: `${i.title}, a ${i.tags[0]?.toLowerCase() ?? "video"} for ${i.client} by ${site.name}, New Orleans.`,
          thumbnailUrl: i.posterUrl ? (i.posterUrl.startsWith("http") ? i.posterUrl : `${site.url}${i.posterUrl}`) : `https://i.ytimg.com/vi/${i.youtubeIds[0]}/hqdefault.jpg`,
          embedUrl: `https://www.youtube.com/embed/${i.youtubeIds[0]}`,
          contentUrl: `https://www.youtube.com/watch?v=${i.youtubeIds[0]}`,
          productionCompany: { "@type": "Organization", name: site.name, url: site.url },
        },
      })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={ldJson(data)} />
      <PageHeader
        eyebrow="Selected Work"
        title={<>The<br /><span className="text-flame">work.</span></>}
        lede="Every commercial, brand film and social spot, sorted by format and industry."
      />
      <section className="frame pb-28">
        <WorkBrowser items={items} taxonomy={tax} />
      </section>
    </>
  );
}
