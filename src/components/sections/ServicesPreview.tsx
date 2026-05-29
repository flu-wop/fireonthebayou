"use client";

/**
 * ServicesPreview — home page capabilities strip.
 * Hairline-separated rows that shift to ember on hover. Echoes the editorial
 * list style of high-end portfolio sites.
 */
import Link from "next/link";
import { services } from "@/lib/services";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/effects/Reveal";

export default function ServicesPreview() {
  return (
    <section className="bg-bayou-deep">
      <div className="frame py-24 md:py-32">
        <SectionHeading
          eyebrow="What we do"
          title={<>End to end,<br />under one roof.</>}
          className="mb-16"
        />

        <div className="border-t border-border">
          {services.map((service, i) => (
            <Reveal key={service.index} delay={i * 0.05}>
              <Link
                href="/services"
                className="group flex items-center justify-between gap-6 border-b border-border py-7 transition-colors duration-500 hover:bg-card/40"
              >
                <div className="flex items-baseline gap-6 md:gap-10">
                  <span className="font-mono text-xs text-ash">{service.index}</span>
                  <h3 className="font-display text-3xl font-light text-cream transition-colors duration-500 group-hover:text-flame md:text-5xl">
                    {service.title}
                  </h3>
                </div>
                <span className="hidden max-w-md text-sm text-mist md:block">
                  {service.blurb}
                </span>
                <span className="text-2xl text-ash transition-all duration-500 ease-cinematic group-hover:translate-x-2 group-hover:text-flame">
                  →
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
