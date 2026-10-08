"use client";

/**
 * Footer
 * ------
 * Contact details, nav echo, socials, and a faint ember glow from the base.
 */
import Link from "next/link";
import { navLinks, site, socialLabels } from "@/lib/site";

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
            "radial-gradient(60% 120% at 50% 120%, rgba(208,17,70,0.18) 0%, transparent 70%)",
        }}
      />

      <div className="frame relative py-16 md:py-20">
        {/* Lower band */}
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div>
            <p className="mb-4 font-mono text-[13px] tracking-wide text-ash">
              Studio
            </p>
            <p className="text-sm leading-relaxed text-mist">
              {site.address}
              <br />
              <a href={`tel:${site.phoneHref}`} className="transition-colors hover:text-flame">
                {site.phone}
              </a>
              <br />
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-flame">
                {site.email}
              </a>
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-[13px] tracking-wide text-ash">
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
            <p className="mb-4 font-mono text-[13px] tracking-wide text-ash">
              Follow
            </p>
            <ul className="space-y-2">
              {Object.entries(site.socials).map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-mist transition-colors hover:text-flame"
                  >
                    {socialLabels[name] ?? name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-2">
            <p className="mb-4 font-mono text-[13px] tracking-wide text-ash">
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
            <a
              href={site.merch.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-mist transition-colors hover:text-flame"
            >
              Shop Merch ↗
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 text-xs text-ash md:flex-row md:items-center">
          <p>
            &copy; {year} {site.name}. All rights reserved.
          </p>
          <a
            href="https://in-flu-ential.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cream"
          >
            Site by James Afflu &middot; IN-FLU-ENTIAL
          </a>
        </div>
      </div>
    </footer>
  );
}
