import { NextResponse } from "next/server";
import { getStripe, siteUrl } from "@/lib/stripe";
import { consult, site } from "@/lib/site";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const PROJECT_TYPES = [
  "Commercial",
  "Brand film",
  "Music video",
  "Corporate / nonprofit",
  "Not sure yet",
] as const;

const clip = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

/**
 * POST /api/consult/checkout
 * Creates a Stripe Checkout Session for the Creative Consult.
 * The amount comes from src/lib/site.ts (or STRIPE_CONSULT_PRICE_ID) — never
 * from the request. Intake answers ride along in metadata for the webhook.
 */
export async function POST(req: Request) {
  const wait = rateLimit(req, "checkout", { limit: 8, windowMs: 10 * 60_000 });
  if (wait) {
    return NextResponse.json(
      { error: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(wait) } }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Online booking isn't set up yet.", fallback: "/contact" },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const name = clip(body.name, 120);
  const email = clip(body.email, 200);
  const company = clip(body.company, 160);
  const projectType = PROJECT_TYPES.includes(body.projectType as (typeof PROJECT_TYPES)[number])
    ? (body.projectType as string)
    : "Not sure yet";
  const message = clip(body.message, 480); // Stripe metadata values cap at 500 chars

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please add your name and a valid email." }, { status: 400 });
  }

  const base = siteUrl(req);
  const priceId = process.env.STRIPE_CONSULT_PRICE_ID;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        priceId
          ? { price: priceId, quantity: 1 }
          : {
              quantity: 1,
              price_data: {
                currency: "usd",
                unit_amount: consult.priceCents,
                product_data: {
                  name: `${consult.name} — ${site.name}`,
                  description: `${consult.length} creative session`,
                },
              },
            },
      ],
      customer_email: email,
      success_url: `${base}/consult/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/consult?canceled=1`,
      metadata: { kind: "consult", name, email, company, projectType, message },
      payment_intent_data: {
        description: `${consult.name} — ${name}${company ? ` (${company})` : ""}`,
      },
    });
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("consult checkout failed", err);
    return NextResponse.json(
      { error: "Couldn't start checkout. Please try again or contact us.", fallback: "/contact" },
      { status: 500 }
    );
  }
}
