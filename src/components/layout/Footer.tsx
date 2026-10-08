"use client";

/**
 * Footer
 * ------
 * Contact details, nav echo, socials, and a faint ember glow from the base.
 */
import Link from "next/link";
import { navLinks, site, socialLabels } from "@/lib/site";
import SocialIcon from "@/components/ui/SocialIcon";

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
            <address className="not-italic text-sm leading-relaxed text-mist">
              {site.address.split(", ")[0]}
              <br />
              {site.address.split(", ").slice(1).join(", ").replace(/\s+\d{5}(-\d{4})?$/, "")}
            </address>
            <p className="mt-4 text-sm leading-relaxed text-mist">
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
            <ul className="flex flex-wrap gap-3">
              {Object.entries(site.socials).map(([name, url]) => (
                <li key={name}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialLabels[name] ?? name}
                    title={socialLabels[name] ?? name}
                    className="grid h-11 w-11 place-items-center rounded-full border border-border text-mist transition-colors duration-300 hover:border-flame hover:text-cream"
                  >
                    <SocialIcon name={name} />
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
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <p>&copy; {year} {site.name}. All rights reserved.</p>
            <Link href="/privacy" className="transition-colors hover:text-cream">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-cream">Terms</Link>
          </div>
          <a
            href="https://in-flu-ential.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-cream"
          >
            Designed by IN-FLU-ENTIAL
          </a>
        </div>
      </div>
    </footer>
  );
}
