/**
 * FAQ — native <details> so it works without JavaScript; FAQPage JSON-LD
 * so the answers can appear in search results.
 */
import { faq } from "@/lib/faq";

export default function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="frame scroll-mt-24 pb-28" aria-labelledby="faq-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="grid gap-12 border-t border-border pt-16 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-4">
          <h2 id="faq-title" className="font-display text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.9] text-cream">
            Working
            <br />
            with us
          </h2>
        </div>
        <div className="md:col-span-8">
          {faq.map((f) => (
            <details key={f.q} className="group border-b border-border py-6 first:pt-0">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-semibold text-cream marker:hidden [&::-webkit-details-marker]:hidden">
                {f.q}
                <span
                  aria-hidden
                  className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-sm text-mist transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-mist">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
