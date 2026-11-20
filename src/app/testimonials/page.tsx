import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import TestimonialStage, { type StageItem } from "@/components/sections/TestimonialStage";
import { publicFileExists, testimonialPosterPath } from "@/lib/media-manifest";
import { testimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  alternates: { canonical: "/testimonials" },
  title: "Client Testimonials",
  description: "Clients on working with Fire on the Bayou, in their own words.",
};

export default function TestimonialsPage() {
  const items: StageItem[] = testimonials.map((t) => {
    const poster = testimonialPosterPath(t.slug);
    return { slug: t.slug, client: t.client, youtubeId: t.youtubeId, poster, posterPresent: publicFileExists(poster) };
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
