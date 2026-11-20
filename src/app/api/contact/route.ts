import { NextResponse } from "next/server";
import { dbConfigured } from "@/lib/db";
import { saveInquiry, setMailchimpStatus } from "@/lib/inquiries";
import { mailchimpConfigured, subscribeToAudience } from "@/lib/mailchimp";
import { notifyNewInquiry } from "@/lib/notify";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const BUDGETS = ["< $5k", "$5k–15k", "$15k–40k", "$40k+"];
const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * POST /api/contact
 * 1. rate limit + honeypot, 2. validate, 3. save the inquiry to Turso (the
 * admin inbox reads it), 4. only if the opt-in box was ticked, add the contact
 * to the Mailchimp audience with a tag, 5. call the (undecided) internal alert.
 * A Mailchimp or alert failure never fails the request: the lead is already saved.
 * Returns 503 + fallback "mailto" if the database isn't available, so the form
 * can hand off to the visitor's email app instead of dropping the inquiry.
 */
export async function POST(req: Request) {
  const wait = rateLimit(req, "contact", { limit: 5, windowMs: 10 * 60_000 });
  if (wait) {
    return NextResponse.json(
      { error: "Too many messages. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(wait) } }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (clip(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clip(body.name, 120);
  const email = clip(body.email, 200);
  const phone = clip(body.phone, 40);
  const budget = BUDGETS.includes(body.budget as string) ? (body.budget as string) : "Not given";
  const message = clip(body.message, 5000);
  const optIn = body.optIn === true;

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please add your name and a valid email." }, { status: 400 });
  }
  if (message.length < 5) {
    return NextResponse.json({ error: "Tell us a little about the project." }, { status: 400 });
  }

  if (!dbConfigured()) {
    return NextResponse.json({ error: "Inquiries can't be saved right now.", fallback: "mailto" }, { status: 503 });
  }

  const inquiry = { name, email, phone, budget, message, optIn };
  let id: number;
  try {
    id = await saveInquiry(inquiry);
  } catch (e) {
    console.error("inquiry save failed", e);
    return NextResponse.json({ error: "Couldn't send right now.", fallback: "mailto" }, { status: 502 });
  }

  try {
    if (!optIn) {
      await setMailchimpStatus(id, "skipped");
    } else if (!mailchimpConfigured()) {
      await setMailchimpStatus(id, "not_configured");
    } else {
      const r = await subscribeToAudience({ email, name });
      await setMailchimpStatus(id, r.ok ? "synced" : "failed", r.ok ? undefined : r.error);
      if (!r.ok) console.error("mailchimp sync failed", r.error);
    }
  } catch (e) {
    console.error("mailchimp status update failed", e);
  }

  try {
    await notifyNewInquiry({ ...inquiry, id });
  } catch (e) {
    console.error("new-inquiry alert failed", e);
  }

  return NextResponse.json({ ok: true });
}
