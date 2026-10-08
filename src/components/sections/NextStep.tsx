/**
 * NextStep — a slim, single-line call to action to close a page.
 */
import Button from "@/components/ui/Button";

export default function NextStep({ line = "Ready when you are." }: { line?: string }) {
  return (
    <section className="frame pb-28">
      <div className="flex flex-col items-start justify-between gap-6 border-t border-border pt-12 md:flex-row md:items-center">
        <p className="font-display text-[clamp(2rem,4.5vw,3.6rem)] leading-[0.95] text-cream">{line}</p>
        <Button href="/contact" variant="ember">
          Get in touch
        </Button>
      </div>
    </section>
  );
}
