"use client";

/**
 * Footer
 * ------
 * A big, cinematic sign-off: oversized "Let's make something" line, contact
 * details, nav echo, socials, and a faint ember glow bleeding up from the base.
 */
import Link from "next/link";
import { navLinks, site } from "@/lib/site";
import Reveal from "@/components/effects/Reveal";
import Button from "@/components/ui/Button";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-border bg-ink">
      {/* ember glow rising from the bottom edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64"
        style={{
          background:
            "radial-gradient(60% 120% at 50% 120%, rgba(226,69,42,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="frame relative py-24 md:py-32">
        <Reveal>
          <p className="eyebrow mb-6">Start a project</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="max-w-4xl font-display text-[clamp(2.5rem,7vw,6.5rem)] font-light leading-[0.95] tracking-tight text-cream">
            Let&rsquo;s make something{" "}
            <span className="text-fire-gradient italic">unforgettable.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <div className="mt-10">
            <Button href="/contact" variant="ember">
              Get in touch
            </Button>
          </div>
        </Reveal>

        {/* Lower band */}
        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-border pt-12 md:grid-cols-4">
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ash">
              Studio
            </p>
            <p className="text-sm leading-relaxed text-mist">
              {site.location}
              <br />
              {site.email}
              <br />
              {site.phone}
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ash">
              Explore
            </p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-mist transition-colors hover:text-flame"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ash">
              Follow
            </p>
            <ul className="space-y-2">
              {Object.entries(site.socials).map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm capitalize text-mist transition-colors hover:text-flame"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-between">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-ash">
              Sister studio
            </p>
            <a
              href={site.studio.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-mist transition-colors hover:text-flame"
            >
              {site.studio.name} ↗
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 text-xs text-ash md:flex-row md:items-center">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <p className="font-mono uppercase tracking-widest">
            Crafted in {site.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
