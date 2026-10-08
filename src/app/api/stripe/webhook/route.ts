import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { consult, formatPrice, site } from "@/lib/site";

export const runtime = "nodejs";

/**
 * POST /api/stripe/webhook
 * Stripe → checkout.session.completed. Verifies the signature against the raw
 * body, then emails the booking to the studio (Resend). Stripe itself sends
 * the client their receipt.
 *
 * Stripe Dashboard → Webhooks → endpoint: https://<site>/api/stripe/webhook,
 * event: checkout.session.completed → copy the signing secret into
 * STRIPE_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  const raw = await req.text(); // raw body — must not be parsed before verifying
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig ?? "", secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Signature verification failed: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const s = event.data.object as Stripe.Checkout.Session;
    const m = s.metadata ?? {};
    if (m.kind === "consult" && s.payment_status === "paid") {
      try {
        await notifyStudio(event.id, {
          name: m.name,
          email: m.email || s.customer_details?.email || "",
          company: m.company,
          projectType: m.projectType,
          message: m.message,
          amount: formatPrice(s.amount_total ?? consult.priceCents),
        });
      } catch (e) {
        // Payment already succeeded. Return 500 so Stripe retries delivery
        // (for up to 3 days); the Resend idempotency key stops duplicates.
        console.error("consult notification failed", e);
        return NextResponse.json({ error: "notification failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}

async function notifyStudio(
  eventId: string,
  b: { name?: string; email: string; company?: string; projectType?: string; message?: string; amount: string }
) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.log("New consult booking (RESEND_API_KEY not set):", b);
    return;
  }
  const esc = (v = "") => v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
  const rows: [string, string][] = [
    ["Name", b.name ?? ""],
    ["Email", b.email],
    ["Company", b.company || "—"],
    ["Project", b.projectType || "—"],
    ["Paid", b.amount],
    ["Notes", b.message || "—"],
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      // Stripe can retry a delivered event — this stops duplicate emails.
      "Idempotency-Key": `consult-${eventId}`,
    },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: process.env.RESEND_TO_EMAIL || site.inbox,
      reply_to: b.email,
      subject: `New ${consult.name}: ${b.name}${b.company ? ` — ${b.company}` : ""}`,
      html: `<div style="font-family:system-ui,sans-serif;color:#111">
        <h2 style="margin:0 0 16px">New ${esc(consult.name)} booked</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          ${rows.map(([k, v]) => `<tr><td style="color:#777;vertical-align:top">${k}</td><td>${esc(v)}</td></tr>`).join("")}
        </table>
        <p style="color:#777;margin-top:20px">Reply to this email to schedule the session.</p>
      </div>`,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
