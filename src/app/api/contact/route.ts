import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const BUDGETS = ["< $5k", "$5k–15k", "$15k–40k", "$40k+"];

const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/**
 * POST /api/contact
 * Sends a project inquiry to the studio inbox through Resend.
 * Returns 503 + fallback "mailto" when Resend isn't configured, so the form can
 * still hand off to the visitor's email app.
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

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please add your name and a valid email." }, { status: 400 });
  }
  if (message.length < 5) {
    return NextResponse.json({ error: "Tell us a little about the project." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ error: "Email isn't set up yet.", fallback: "mailto" }, { status: 503 });
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone || "—"],
    ["Budget", budget],
  ];

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: process.env.RESEND_TO_EMAIL || site.inbox,
      reply_to: email,
      subject: `New project inquiry: ${name}`,
      html: `<div style="font-family:system-ui,sans-serif;color:#111">
        <h2 style="margin:0 0 16px">New project inquiry</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          ${rows.map(([k, v]) => `<tr><td style="color:#777;vertical-align:top">${k}</td><td>${esc(v)}</td></tr>`).join("")}
        </table>
        <p style="white-space:pre-wrap;margin-top:16px">${esc(message)}</p>
        <p style="color:#777;margin-top:20px">Reply to this email to answer ${esc(name)} directly.</p>
      </div>`,
    }),
  });

  if (!res.ok) {
    console.error("contact email failed", res.status, await res.text());
    return NextResponse.json(
      { error: "Couldn't send right now.", fallback: "mailto" },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
