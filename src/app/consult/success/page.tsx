import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { getStripe } from "@/lib/stripe";
import { consult, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "You're booked",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function ConsultSuccess({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  // Personalize from the Stripe session when we can; fine without it.
  let firstName = "";
  let email = "";
  const stripe = getStripe();
  if (stripe && session_id?.startsWith("cs_")) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id);
      if (s.payment_status === "paid") {
        firstName = (s.metadata?.name || "").split(" ")[0];
        email = s.customer_details?.email || s.metadata?.email || "";
      }
    } catch {
      /* show the generic confirmation */
    }
  }

  return (
    <section className="frame flex min-h-[85svh] flex-col justify-center pb-24 pt-36">
      <p className="eyebrow mb-6">{consult.name} &middot; Confirmed</p>
      <h1 className="max-w-4xl font-display text-[clamp(3rem,9vw,8rem)] font-light leading-[0.9] tracking-tight text-cream">
        {firstName ? <>You&rsquo;re booked,<br />{firstName}.</> : <>You&rsquo;re<br />booked.</>}
      </h1>
      <p className="mt-8 max-w-xl text-lg leading-relaxed text-mist">
        Payment received. We&rsquo;ll be in touch within one business day to schedule your session
        {email ? <> &mdash; watch <span className="text-cream">{email}</span></> : null}. Your
        Stripe receipt is on its way.
      </p>
      <p className="mt-4 max-w-xl text-sm text-ash">
        Questions in the meantime? Call {site.phone} or email {site.email}.
      </p>
      <div className="mt-12 flex flex-wrap gap-4">
        <Button href="/work" variant="ember">Watch the work</Button>
        <Button href="/" variant="outline">Back home</Button>
      </div>
    </section>
  );
}
