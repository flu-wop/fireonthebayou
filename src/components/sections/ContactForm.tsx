"use client";

/**
 * ContactForm
 * -----------
 * Front-end only (no <form> POST wired yet). Captures intent and either:
 *   (a) opens a prefilled mailto: to site.email, or
 *   (b) you swap handleSubmit to POST to /api/contact when you add the route.
 *
 * Styled to match the booking-system aesthetic from the ecosystem skill.
 */
import { useState } from "react";
import { site } from "@/lib/site";
import Button from "@/components/ui/Button";

const budgets = ["< $5k", "$5k–15k", "$15k–40k", "$40k+"];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState(budgets[1]);
  const [message, setMessage] = useState("");

  function handleSubmit() {
    // Simple mailto fallback — replace with a fetch('/api/contact') when ready.
    const subject = encodeURIComponent(`New project inquiry — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nBudget: ${budget}\n\n${message}`
    );
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  }

  const inputCls =
    "w-full border-b border-border bg-transparent py-4 text-cream placeholder:text-ash focus:border-flame focus:outline-none transition-colors duration-300";

  return (
    <div className="space-y-10">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <label className="eyebrow mb-2 block text-ash">Your name</label>
          <input
            className={inputCls}
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block text-ash">Email</label>
          <input
            className={inputCls}
            type="email"
            placeholder="jane@studio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="eyebrow mb-4 block text-ash">Budget range</label>
        <div className="flex flex-wrap gap-3">
          {budgets.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              className={`rounded-full border px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-all duration-300 ${
                budget === b
                  ? "border-flame bg-flame/10 text-flame"
                  : "border-border text-mist hover:border-mist"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="eyebrow mb-2 block text-ash">Tell us about the project</label>
        <textarea
          className={`${inputCls} min-h-[120px] resize-none`}
          placeholder="What are we making, and when?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <Button onClick={handleSubmit} variant="ember">
        Send inquiry
      </Button>
    </div>
  );
}
