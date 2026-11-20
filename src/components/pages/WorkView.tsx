import PageHeader from "@/components/sections/PageHeader";
import WorkBrowser from "@/components/work/WorkBrowser";
import type { WorkItem } from "@/components/work/types";
import { labelFor } from "@/lib/catalog";
import { getProjects, getTaxonomy } from "@/lib/content";
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
  return (
    <>
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
