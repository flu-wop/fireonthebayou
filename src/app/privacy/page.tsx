import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import { LegalBody, LegalSection } from "@/components/sections/LegalBody";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description: "How Fire on the Bayou handles the information you share through this site.",
};

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Legal" title={<>Privacy <span className="text-flame">policy.</span></>} />
      <LegalBody updated="October 2026">
        <LegalSection title="Who we are">
          <p>
            {site.name} is a video production company at {site.address}. This policy covers {site.url.replace(/^https?:\/\//, "")} and
            explains what we collect, why, and who helps us handle it.
          </p>
        </LegalSection>

        <LegalSection title="What we collect">
          <ul>
            <li>
              <strong className="text-cream">Contact form.</strong> Your name, email, optional phone number, budget range, and
              message. We use them only to reply about your project.
            </li>
            <li>
              <strong className="text-cream">Creative Consult bookings.</strong> Your name, email, company, project type, and
              notes, so we can prepare for and schedule your session.
            </li>
            <li>
              <strong className="text-cream">Payments.</strong> Card payments are handled entirely by Stripe. Your card number
              never touches our servers and we never see or store it. Stripe shares the payment
              status and the details you entered at checkout with us.
            </li>
            <li>
              <strong className="text-cream">Site analytics.</strong> We use Vercel Web Analytics to count page views and see which
              pages are useful. It does not use cookies and does not identify you personally.
            </li>
          </ul>
        </LegalSection>

        <LegalSection title="Who processes it">
          <p>We use a small number of trusted services to run the site:</p>
          <ul>
            <li><a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">Stripe</a> for payments.</li>
            <li><a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Resend</a> to deliver form and booking emails to our inbox.</li>
            <li><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel</a> to host the site and provide privacy-friendly analytics.</li>
            <li>YouTube (in privacy-enhanced mode) to play our films. YouTube may set cookies once you press play.</li>
          </ul>
          <p>We don’t sell your information or share it with anyone for marketing.</p>
        </LegalSection>

        <LegalSection title="How long we keep it">
          <p>
            Inquiries and booking details stay in our email for as long as we’re talking about a project, and for our
            records afterward. Payment records are kept as long as tax law requires. Ask us at any time to see or delete
            what we hold about you.
          </p>
        </LegalSection>

        <LegalSection title="Contact">
          <p>
            Questions about your information: <a href={`mailto:${site.email}`}>{site.email}</a> or{" "}
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>.
          </p>
        </LegalSection>
      </LegalBody>
    </>
  );
}
