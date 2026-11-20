import PageHeader from "@/components/sections/PageHeader";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";
import MediaSlot from "@/components/media/MediaSlot";
import { getServices } from "@/lib/content";
import { servicePhotoPath } from "@/lib/media";

export default async function ServicesView({ draft }: { draft?: boolean }) {
  const services = await getServices({ draft });
  return (
    <>
      <PageHeader
        eyebrow="Capabilities"
        title={<>What we<br /><span className="text-flame">make.</span></>}
        lede="Concept to final delivery, under one roof — including sound design and voiceover, social content, and post."
      />

      <section className="frame pb-32">
        <div className="grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-2 md:[&>*:last-child:nth-child(odd)]:col-span-2">
          {services.map(({ key, data: service }, i) => (
            <Reveal key={key} delay={(i % 2) * 0.08}>
              <article className="card-lift flex h-full flex-col bg-charcoal p-9 md:p-12">
                <div className="-mx-9 -mt-9 mb-8 overflow-hidden md:-mx-12 md:-mt-12">
                  <MediaSlot
                    src={servicePhotoPath(key)}
                    alt={service.title}
                    placeholder={{
                      variant: "still",
                      label: "STILL 1600×1067",
                      size: "1600×1067 JPG (3:2)",
                      where: `/public${servicePhotoPath(key)}`,
                      title: service.title,
                      aspect: "aspect-[3/2]",
                    }}
                  />
                </div>
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs tracking-wide text-flame">{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-ember" />
                </div>
                <h2 className="mb-4 font-display text-4xl font-light text-cream">{service.title}</h2>
                <p className="mb-8 max-w-md text-base leading-relaxed text-mist">{service.blurb}</p>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {service.capabilities.map((cap) => (
                    <li key={cap} className="rounded-full border border-border px-3.5 py-1.5 font-mono text-[13px] tracking-wide text-mist">{cap}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center gap-6 text-center">
          <p className="max-w-xl font-display text-2xl font-light leading-snug text-cream md:text-3xl">
            Not sure which of these you need? That&rsquo;s what the first call is for.
          </p>
          <Button href="/contact" variant="ember">Start a project</Button>
        </div>
      </section>
    </>
  );
}
