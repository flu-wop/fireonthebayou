import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import ContactForm from "@/components/sections/ContactForm";
import { site, socialLabels } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Let's Talk",
  description: `Start a project with Fire on the Bayou. Based in ${site.location}.`,
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Start a Project"
        title={<>Let&rsquo;s<br /><span className="text-flame">talk.</span></>}
        lede="Tell us what you're making. We'll get back within two business days — usually faster."
      />

      <section className="frame grid gap-16 pb-32 md:grid-cols-12">
        {/* Form */}
        <div className="md:col-span-7">
          <ContactForm />
        </div>

        {/* Direct details */}
        <div className="md:col-span-4 md:col-start-9">
          <div className="space-y-10">
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
                      className="text-mist transition-colors hover:text-flame"
                    >
                      {socialLabels[name] ?? name} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
