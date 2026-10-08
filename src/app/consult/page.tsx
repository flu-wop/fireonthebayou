import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import ConsultForm from "@/components/sections/ConsultForm";
import Reveal from "@/components/effects/Reveal";
import { consult, formatPrice, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book a Creative Consult",
  description: `A ${consult.length} creative session with ${site.name}: concept, approach, budget range, and timeline for your commercial, brand film, or video.`,
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
        title={<>Start with<br />a session.</>}
        lede="Not sure what the film should be yet? Sit down with us first. Bring the idea — leave with a direction, a budget range, and a plan."
      />

      <section className="frame grid gap-16 pb-32 md:grid-cols-12">
        {/* The offer */}
        <aside className="md:col-span-4">
          <Reveal>
            <div className="rounded-sm border border-border bg-card/40 p-8">
              <p className="font-mono text-[11px] uppercase tracking-widest text-ash">{consult.name}</p>
              <p className="mt-4 font-display text-6xl font-light text-cream">{price}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-flame">{consult.length}</p>

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
        </aside>

        {/* Intake + checkout */}
        <div className="md:col-span-7 md:col-start-6">
          <ConsultForm canceled={canceled === "1"} />
        </div>
      </section>
    </>
  );
}
