"use client";

/**
 * ProcessSteps
 * ------------
 * Sticky-scroll process narrative. The big index number stays pinned while the
 * step descriptions scroll past — a hallmark "premium" scroll device.
 */
import { processSteps } from "@/lib/process";
import Reveal from "@/components/effects/Reveal";
import Parallax from "@/components/effects/Parallax";

export default function ProcessSteps() {
  return (
    <section className="frame py-24 md:py-32">
      <div className="grid gap-12 md:grid-cols-12 md:gap-16">
        {/* Sticky left rail */}
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <p className="eyebrow mb-5">How it works</p>
            <h2 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[0.95] text-cream">
              The
              <br />
              <span className="text-fire-gradient italic">process.</span>
            </h2>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-mist">
              Five stages, one team. From the first conversation to final
              delivery, the people who pitch it are the people who make it.
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="md:col-span-8">
          {processSteps.map((step) => (
            <Reveal key={step.index}>
              <div className="flex gap-6 border-b border-border py-12 first:pt-0 md:gap-10">
                <Parallax speed={0.15} className="shrink-0">
                  <span className="font-display text-5xl font-light text-border md:text-7xl">
                    {step.index}
                  </span>
                </Parallax>
                <div>
                  <h3 className="mb-3 font-display text-3xl font-light text-cream md:text-4xl">
                    {step.title}
                  </h3>
                  <p className="max-w-xl text-base leading-relaxed text-mist">
                    {step.description}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
