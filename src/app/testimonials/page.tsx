import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import MediaSlot from "@/components/media/MediaSlot";
import { testimonialPosterPath } from "@/lib/media-manifest";
import { testimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  alternates: { canonical: "/testimonials" },
  title: "Client Testimonials",
  description: "Clients on working with Fire on the Bayou, in their own words.",
};

/** Interim grid of the nine slots. Phase 3 replaces it with the video stage + rail. */
export default function TestimonialsPage() {
  return (
    <>
      <PageHeader eyebrow="Testimonials" title={<>In their<br /><span className="text-flame">own words.</span></>} />
      <section className="frame grid gap-6 pb-32 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <MediaSlot
            key={t.slug}
            src={testimonialPosterPath(t.slug)}
            alt={`${t.client} testimonial`}
            placeholder={{
              variant: "testimonial",
              label: "VIDEO — YouTube ID",
              size: "YouTube ID + 1280×720 JPG poster",
              where: `src/lib/testimonials.ts · /public${testimonialPosterPath(t.slug)}`,
              title: t.client,
            }}
          />
        ))}
      </section>
    </>
  );
}
