/**
 * NextStep — a slim, single-line call to action to close a page.
 */
import Button from "@/components/ui/Button";
import { consult, formatPrice } from "@/lib/site";

export default function NextStep({ line = "Ready when you are." }: { line?: string }) {
  return (
    <section className="frame pb-28">
      <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-12 md:flex-row md:items-center">
        <p className="font-display text-[clamp(2rem,4.5vw,3.6rem)] leading-[0.95] text-cream">{line}</p>
        <div className="flex flex-wrap gap-3">
          <Button href="/consult" variant="ember">
            Book a consult &middot; {formatPrice(consult.priceCents)}
          </Button>
          <Button href="/contact" variant="outline">
            Get in touch
          </Button>
        </div>
      </div>
    </section>
  );
}
