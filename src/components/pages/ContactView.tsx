import PageHeader from "@/components/sections/PageHeader";
import ContactForm from "@/components/sections/ContactForm";
import { getSettings } from "@/lib/content";
import { socialLabels } from "@/lib/site";

export default async function ContactView({ draft }: { draft?: boolean }) {
  const s = await getSettings({ draft });
  return (
    <>
      <PageHeader
        eyebrow="Start a Project"
        title={<>Let&rsquo;s<br /><span className="text-flame">talk.</span></>}
        lede="Tell us what you're making. We'll get back within two business days — usually faster."
      />

      <section className="frame grid gap-16 pb-32 md:grid-cols-12">
        <div className="md:col-span-7">
          <ContactForm email={s.email} phone={s.phone} phoneHref={s.phoneHref} />
        </div>

        <div className="md:col-span-4 md:col-start-9">
          <div className="space-y-10">
            <div>
              <p className="eyebrow mb-3">Email</p>
              <a href={`mailto:${s.email}`} className="text-lg text-cream transition-colors hover:text-flame">{s.email}</a>
            </div>
            <div>
              <p className="eyebrow mb-3">Phone</p>
              <a href={`tel:${s.phoneHref}`} className="text-lg text-cream transition-colors hover:text-flame">{s.phone}</a>
            </div>
            <div>
              <p className="eyebrow mb-3">Studio</p>
              <p className="text-lg text-cream">{s.address}</p>
            </div>
            <div>
              <p className="eyebrow mb-3">Follow</p>
              <ul className="space-y-1.5">
                {Object.entries(s.socials).map(([name, url]) => (
                  <li key={name}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-mist transition-colors hover:text-flame">
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
