import PageHeader from "@/components/sections/PageHeader";
import TestimonialStage, { type StageItem } from "@/components/sections/TestimonialStage";
import { getTestimonials } from "@/lib/content";
import { getMediaOverrides, resolveWith, testimonialPosterPath } from "@/lib/media";

export default async function TestimonialsView({ draft }: { draft?: boolean }) {
  const [list, map] = await Promise.all([getTestimonials({ draft }), getMediaOverrides()]);
  const items: StageItem[] = list.map((t) => {
    const poster = testimonialPosterPath(t.key);
    const url = resolveWith(map, poster);
    return { slug: t.key, client: t.data.client, youtubeId: t.data.youtubeId, poster: url ?? poster, posterPresent: url !== null };
  });
  return (
    <>
      <PageHeader eyebrow="Testimonials" title={<>In their<br /><span className="text-flame">own words.</span></>} />
      <section className="frame pb-32">
        <TestimonialStage items={items} />
      </section>
    </>
  );
}
