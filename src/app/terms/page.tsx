import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import { LegalBody, LegalSection } from "@/components/sections/LegalBody";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Service",
  description: "Terms for using the Fire on the Bayou site.",
};

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Legal" title={<>Terms of <span className="text-flame">service.</span></>} />
      <LegalBody updated="October 2026">
        <LegalSection title="Our work">
          <p>
            Every film, image, and piece of music on this site belongs to {site.name} or its clients and is shown here as
            portfolio work. Please don’t download, re-upload, or reuse it without written permission.
          </p>
        </LegalSection>

        <LegalSection title="Productions">
          <p>
            Productions are quoted individually and run under their own written agreement,
            which covers scope, payment schedule, usage rights, and revisions.
          </p>
        </LegalSection>

        <LegalSection title="The fine print">
          <p>
            This site is provided as is. We work to keep it accurate but can’t promise it’s free of errors.
            These terms are governed by the laws of Louisiana.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a> or <a href={`tel:${site.phoneHref}`}>{site.phone}</a>.
          </p>
        </LegalSection>
      </LegalBody>
    </>
  );
}
