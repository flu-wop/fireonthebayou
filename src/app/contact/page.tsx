import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import ContactForm from "@/components/sections/ContactForm";
import Link from "next/link";
import { consult, formatPrice, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a project with Fire on the Bayou. Based in ${site.location}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Start a project"
        title={<>Let&rsquo;s<br />talk.</>}
        lede="Tell us what you're making. We'll get back within two business days — usually faster."
      />

      <section className="frame grid gap-16 pb-32 md:grid-cols-12">
        {/* Form */}
        <div className="md:col-span-7">
          <ContactForm />
        </div>

        {/* Direct details */}
        <aside className="md:col-span-4 md:col-start-9">
          <div className="space-y-10">
            <Link
              href="/consult"
              className="group block rounded-sm border border-border p-6 transition-colors duration-500 hover:border-flame"
            >
              <p className="eyebrow mb-3">Ready to start?</p>
              <p className="font-display text-2xl font-light leading-tight text-cream">
                Book a {consult.name} &mdash; {formatPrice(consult.priceCents)}
              </p>
              <p className="mt-2 text-sm text-mist">
                A working session and a written creative brief: concept, budget, timeline.{" "}
                <span className="text-flame transition-transform group-hover:translate-x-1">→</span>
              </p>
            </Link>
            <div>
              <p className="eyebrow mb-3">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="text-lg text-cream transition-colors hover:text-flame"
              >
                {site.email}
              </a>
            </div>
            <div>
              <p className="eyebrow mb-3">Phone</p>
              <a
                href={`tel:${site.phoneHref}`}
                className="text-lg text-cream transition-colors hover:text-flame"
              >
                {site.phone}
              </a>
            </div>
            <div>
              <p className="eyebrow mb-3">Studio</p>
              <p className="text-lg text-cream">{site.address}</p>
            </div>
            <div>
              <p className="eyebrow mb-3">Follow</p>
              <ul className="space-y-1.5">
                {Object.entries(site.socials).map(([name, url]) => (
                  <li key={name}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="capitalize text-mist transition-colors hover:text-flame"
                    >
                      {name} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
