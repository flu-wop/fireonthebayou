/**
 * ConsultCTA — home page band selling the paid Creative Consult.
 */
import Button from "@/components/ui/Button";
import Reveal from "@/components/effects/Reveal";
import { consult, development, formatPrice } from "@/lib/site";

export default function ConsultCTA() {
  const price = formatPrice(consult.priceCents);
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(208,17,70,0.16) 0%, transparent 65%)" }}
      />
      <div className="frame relative grid items-end gap-12 py-24 md:grid-cols-12 md:py-32">
        <div className="md:col-span-7">
          <Reveal>
            <p className="eyebrow mb-6">{consult.name}</p>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-[0.95] tracking-tight text-cream">
              Have an idea?<br />
              Start with a <span className="text-flame">session.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-base leading-relaxed text-mist">
              A {consult.length.replace(" minutes", "-minute")} working session with a Fire on the Bayou
              director and producer, then a written creative brief: concept, approach,
              budget range, and timeline
              {consult.creditedTowardProduction ? <> &mdash; and the full fee comes off your production.</> : "."}
            </p>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="md:col-span-4 md:col-start-9">
          <div className="flex flex-col items-start gap-5 md:items-end">
            <p className="font-display text-6xl font-light text-cream">{price}</p>
            <Button href="/consult" variant="ember">Book a consult</Button>
            <p className="font-mono text-[13px] tracking-wide text-ash">Secure checkout by Stripe</p>
            <a href="/consult" className="text-sm text-mist underline decoration-mist/30 underline-offset-4 transition-colors hover:text-cream">
              Bigger project? {development.name} from {development.priceRange.split(" ")[0]}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
