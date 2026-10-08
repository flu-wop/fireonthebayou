"use client";

/**
 * ConsultForm — short intake, then straight to Stripe Checkout.
 * The price shown here is display-only; the server sets the real amount.
 */
import { useState } from "react";
import Link from "next/link";
import { consult, formatPrice } from "@/lib/site";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const projectTypes = ["Commercial", "Brand film", "Music video", "Corporate / nonprofit", "Not sure yet"];

export default function ConsultForm({ canceled = false }: { canceled?: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [projectType, setProjectType] = useState(projectTypes[0]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ text: string; fallback?: string } | null>(null);

  async function submit() {
    if (loading) return;
    setError(null);
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError({ text: "Please add your name and a valid email." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/consult/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, company, projectType, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setError({ text: data.error || "Something went wrong.", fallback: data.fallback });
    } catch {
      setError({ text: "Couldn't reach checkout. Check your connection and try again." });
    }
    setLoading(false);
  }

  const inputCls =
    "w-full border-b border-border bg-transparent py-4 text-cream placeholder:text-ash focus:border-flame focus:outline-none transition-colors duration-300";

  return (
    <form
      className="space-y-10"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      {canceled && (
        <p className="border-l-2 border-flame pl-4 text-sm text-mist">
          Checkout was canceled — nothing was charged. Your details are below whenever you&rsquo;re ready.
        </p>
      )}

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="eyebrow mb-2 block text-ash">Your name</label>
          <input id="c-name" className={inputCls} placeholder="Jane Doe" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="c-email" className="eyebrow mb-2 block text-ash">Email</label>
          <input id="c-email" className={inputCls} type="email" placeholder="jane@company.com" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <div>
        <label htmlFor="c-company" className="eyebrow mb-2 block text-ash">Company or brand <span className="text-ash/70">(optional)</span></label>
        <input id="c-company" className={inputCls} placeholder="Who's this for?" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>

      <fieldset>
        <legend className="eyebrow mb-4 block text-ash">What are you making?</legend>
        <div className="flex flex-wrap gap-3">
          {projectTypes.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setProjectType(t)}
              aria-pressed={projectType === t}
              className={cn(
                "rounded-full border px-5 py-2.5 font-mono text-xs tracking-wide transition-all duration-300",
                projectType === t ? "border-flame bg-flame/10 text-flame" : "border-border text-mist hover:border-mist"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="c-msg" className="eyebrow mb-2 block text-ash">The short version <span className="text-ash/70">(optional)</span></label>
        <textarea
          id="c-msg"
          className={`${inputCls} min-h-[110px] resize-none`}
          placeholder="What's the idea, and when does it need to exist?"
          maxLength={480}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="text-sm text-flame">
          {error.text}{" "}
          {error.fallback && (
            <Link href={error.fallback} className="underline underline-offset-4 hover:text-cream">
              Send us a message instead →
            </Link>
          )}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-6">
        <Button type="submit" variant="ember">
          {loading ? "Opening checkout…" : `Book & pay ${formatPrice(consult.priceCents)}`}
        </Button>
        <p className="font-mono text-[13px] tracking-wide text-ash">Secure checkout by Stripe</p>
      </div>
    </form>
  );
}
