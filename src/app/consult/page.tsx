import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import ConsultForm from "@/components/sections/ConsultForm";
import Reveal from "@/components/effects/Reveal";
import { consult, development, formatPrice, site } from "@/lib/site";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Creative Consult & Creative Development",
  description: `A ${consult.length.replace(" minutes", "-minute")} working session with ${site.name}, followed by a written creative brief: concept, approach, budget range, and timeline for your commercial, brand film, or video.`,
  alternates: { canonical: "/consult" },
};

export default async function ConsultPage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>;
}) {
  const { canceled } = await searchParams;
  const price = formatPrice(consult.priceCents);

  return (
    <>
      <PageHeader
        eyebrow="Creative Consult"
        title={<>Start with<br />a <span className="text-flame">session.</span></>}
        lede="Not sure what the film should be yet? Sit down with us first. Bring the idea — leave with a written creative brief, a budget range, and a plan."
      />

      <section className="frame grid gap-16 pb-32 md:grid-cols-12">
        {/* The offer */}
        <div className="md:col-span-4">
          <Reveal>
            <div className="rounded-sm border border-border bg-card/40 p-8">
              <p className="text-[13px] font-semibold text-cream">{consult.name}</p>
              <p className="mt-4 font-display text-6xl font-light text-cream">{price}</p>
              <p className="mt-2 font-mono text-[13px] tracking-wide text-flame">{consult.length}</p>

              <ul className="mt-8 space-y-4 border-t border-border pt-8">
                {consult.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-mist">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-flame" />
                    {item}
                  </li>
                ))}
              </ul>

              {consult.creditedTowardProduction && (
                <p className="mt-8 border-t border-border pt-6 text-sm leading-relaxed text-cream">
                  The full {price} is credited toward your production when you book with us.
                </p>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-sm leading-relaxed text-ash">
              After checkout we&rsquo;ll email you within one business day to schedule —
              in person at the studio or by video call.
            </p>
          </Reveal>

          {/* Tier 2 — scoped, so it's an inquiry rather than a checkout */}
          <Reveal delay={0.15}>
            <div className="mt-10 rounded-sm border border-flame/60 p-8">
              <p className="text-[13px] font-semibold text-cream">{development.name}</p>
              <p className="mt-4 font-display text-4xl text-cream">{development.priceRange}</p>
              <p className="mt-2 text-[13px] text-mist">Scoped to your project</p>
              <ul className="mt-8 space-y-4 border-t border-border pt-8">
                {development.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-mist">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-flame" />
                    {item}
                  </li>
                ))}
              </ul>
              {development.creditedTowardProduction && (
                <p className="mt-8 border-t border-border pt-6 text-sm leading-relaxed text-cream">
                  Credited toward your production when you book with us.
                </p>
              )}
              <div className="mt-8">
                <Button href={development.href} variant="outline">
                  Start the conversation
                </Button>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Intake + checkout */}
        <div className="md:col-span-7 md:col-start-6">
          <ConsultForm canceled={canceled === "1"} />
        </div>
      </section>
    </>
  );
}
