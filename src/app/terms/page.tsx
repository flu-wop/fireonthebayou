import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import { LegalBody, LegalSection } from "@/components/sections/LegalBody";
import { consult, formatPrice, site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Service",
  description: "Terms for using the Fire on the Bayou site and booking a Creative Consult.",
};

/*
 * Consult policy below is a sensible default. Confirm the windows (48 hours,
 * 24 hours, 6 months) with Jason before taking live payments.
 */
export default function Page() {
  const price = formatPrice(consult.priceCents);
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

        <LegalSection title={`${consult.name} (${price})`}>
          <ul>
            <li>Payment is taken in full at booking through Stripe. You’ll get an email receipt from Stripe.</li>
            <li>We’ll contact you within two business days to schedule your {consult.length.replace(" minutes", "-minute")} session.</li>
            <li>
              <strong className="text-cream">Rescheduling</strong> is free with at least 24 hours’ notice.
            </li>
            <li>
              <strong className="text-cream">Cancellations</strong> made 48 hours or more before the session get a full refund.
              Inside 48 hours the fee isn’t refundable, but you can reschedule once.
            </li>
            <li>
              If we can’t find a time that works within 30 days of booking, we’ll refund you in full.
            </li>
            {consult.creditedTowardProduction && (
              <li>
                <strong className="text-cream">Production credit.</strong> The full {price} comes off a {site.name} production
                you book within 6 months of your session.
              </li>
            )}
            <li>
              The creative brief we deliver is yours to keep and use. Concepts we develop together beyond the brief, and
              all production work, are covered by a separate agreement.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Productions">
          <p>
            Creative Development and full productions are quoted individually and run under their own written agreement,
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
