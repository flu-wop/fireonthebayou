/**
 * MerchBand — points to the Fire on the Bayou + Mid City Sound merch store
 * (hosted on midcitysound.com; shared Printful + Stripe).
 */
import Reveal from "@/components/effects/Reveal";
import { site } from "@/lib/site";

export default function MerchBand() {
  return (
    <section className="border-t border-border bg-ink">
      <a
        href={site.merch.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group frame flex flex-col justify-between gap-6 py-14 md:flex-row md:items-center md:py-16"
      >
        <Reveal>
          <p className="eyebrow mb-3">Merch</p>
          <p className="font-display text-[clamp(2rem,4.5vw,3.6rem)] font-light leading-none tracking-tight text-cream">
            Wear the <span className="text-fire-gradient italic">fire.</span>
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">
            Fire on the Bayou and {site.studio.name} gear, made to order and shipped from the
            studio store.
          </p>
        </Reveal>
        <span className="inline-flex items-center gap-3 self-start rounded-full border border-border px-7 py-3.5 font-mono text-[13px] tracking-wide text-cream transition-all duration-500 ease-cinematic group-hover:border-flame group-hover:text-flame md:self-auto">
          Shop merch
          <span className="transition-transform duration-500 ease-cinematic group-hover:-translate-y-0.5 group-hover:translate-x-0.5">↗</span>
        </span>
      </a>
    </section>
  );
}
