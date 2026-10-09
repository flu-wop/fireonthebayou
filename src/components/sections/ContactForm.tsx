"use client";

/**
 * ContactForm
 * -----------
 * Posts to /api/contact, which emails the studio through Resend. If email
 * isn't configured (or the send fails) it hands off to a prefilled mailto:
 * so no inquiry is lost.
 */
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import Button from "@/components/ui/Button";

const budgets = ["< $5k", "$5k–15k", "$15k–40k", "$40k+"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState(budgets[1]);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  const sentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "sent") sentRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [status]);

  // /contact?interest=creative-development (from the Consult page) prefills the ask.
  useEffect(() => {
    const interest = new URLSearchParams(window.location.search).get("interest");
    if (interest === "creative-development") {
      setMessage((m) => m || "I'm interested in Creative Development (treatment, script, storyboards, budget, and schedule). Here's the project: ");
    }
  }, []);

  function openMail() {
    const subject = encodeURIComponent(`New project inquiry — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\nBudget: ${budget}\n\n${message}`
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "sending") return;
    setError("");
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, budget, message, website }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("sent");
        return;
      }
      setStatus("idle");
      if (data.fallback === "mailto") {
        openMail();
        return;
      }
      setError(data.error || "Something went wrong. Please try again.");
    } catch {
      setStatus("idle");
      openMail();
    }
  }

  if (status === "sent") {
    return (
      <div ref={sentRef} role="status" className="border-t border-border pt-10">
        <p className="font-display text-[clamp(2rem,4.5vw,3.4rem)] leading-[0.95] text-cream">
          Message <span className="text-flame">received.</span>
        </p>
        <p className="mt-5 max-w-md text-base leading-relaxed text-mist">
          Thanks, {name.split(" ")[0] || "friend"}. We’ll be in touch within two business days.
          Need us sooner? Call <a href={`tel:${site.phoneHref}`} className="text-cream underline underline-offset-4">{site.phone}</a>.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full border-b border-border bg-transparent py-4 text-cream placeholder:text-ash focus:border-flame focus:outline-none transition-colors duration-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-10" noValidate={false}>
      {/* Honeypot — hidden from people and screen readers */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="eyebrow mb-2 block text-ash">Your Name</label>
          <input
            id="cf-name"
            required
            autoComplete="name"
            className={inputCls}
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="eyebrow mb-2 block text-ash">Email</label>
          <input
            id="cf-email"
            required
            className={inputCls}
            type="email"
            autoComplete="email"
            placeholder="jane@studio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cf-phone" className="eyebrow mb-2 block text-ash">Phone <span className="text-ash">(optional)</span></label>
        <input
          id="cf-phone"
          className={inputCls}
          type="tel"
          autoComplete="tel"
          placeholder="(504) 555-0100"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <fieldset>
        <legend className="eyebrow mb-4 block text-ash">Budget Range</legend>
        <div className="flex flex-wrap gap-3">
          {budgets.map((b) => (
            <button
              key={b}
              type="button"
              aria-pressed={budget === b}
              onClick={() => setBudget(b)}
              className={`rounded-full border px-5 py-2.5 font-mono text-xs tracking-wide transition-all duration-300 ${
                budget === b
                  ? "border-flame bg-flame/10 text-flame"
                  : "border-border text-mist hover:border-mist"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="cf-message" className="eyebrow mb-2 block text-ash">Tell Us About the Project</label>
        <textarea
          id="cf-message"
          required
          className={`${inputCls} min-h-[120px] resize-none`}
          placeholder="What are we making, and when?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-flame-light">
          {error}
        </p>
      )}

      <Button type="submit" variant="ember">
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </Button>
    </form>
  );
}
