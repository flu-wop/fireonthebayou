import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import { services } from "@/lib/services";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Brand films, music videos, documentary, commercial, sound & score, and post — handled end to end by Fire on the Bayou.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Capabilities"
        title={<>What we<br />make.</>}
        lede="Concept to final delivery, under one roof — including the sound and score, scored next door at Mid City Sound."
      />

      <section className="frame pb-32">
        <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2">
          {services.map((service, i) => (
            <Reveal key={service.index} delay={(i % 2) * 0.08}>
              <article className="card-lift flex h-full flex-col bg-charcoal p-9 md:p-12">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs tracking-widest text-flame">
                    {service.index}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                </div>
                <h2 className="mb-4 font-display text-4xl font-light text-cream">
                  {service.title}
                </h2>
                <p className="mb-8 max-w-md text-base leading-relaxed text-mist">
                  {service.blurb}
                </p>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {service.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="rounded-full border border-border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-widest text-mist"
                    >
                      {cap}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 text-center">
          <p className="max-w-xl font-display text-2xl font-light leading-snug text-cream md:text-3xl">
            Not sure which of these you need? That&rsquo;s what the first call is
            for.
          </p>
          <Button href="/contact" variant="ember">
            Start a project
          </Button>
        </div>
      </section>
    </>
  );
}
