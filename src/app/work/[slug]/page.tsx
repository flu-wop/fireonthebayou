/**
 * /work/[slug] — the screening room, for projects that have a write-up.
 * Content comes from the project record in the content store (Admin > Projects).
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectView, { plain, posterFor, screened } from "@/components/pages/ProjectView";
import { getProjects } from "@/lib/content";
import { getMediaOverrides } from "@/lib/media";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).filter((r) => screened(r.data)).map((r) => ({ slug: r.data.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const rec = (await getProjects()).find((r) => r.data.slug === slug);
  if (!rec || !screened(rec.data)) return {};
  const p = rec.data;
  const title = `${p.title} — ${p.client}`;
  const description = p.writeup?.logline
    ? `${plain(p.writeup.logline)} ${p.writeup.category ?? "Commercial"} for ${p.client} by ${site.name}, New Orleans.`
    : p.writeup?.blurb ?? title;
  const image = posterFor(await getMediaOverrides(), p);
  return {
    title,
    description,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title, description, url: `/work/${p.slug}`, type: "video.other", images: [image] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const known = (await getProjects()).some((r) => r.data.slug === slug && screened(r.data));
  if (!known) notFound();
  return <ProjectView slug={slug} />;
}
