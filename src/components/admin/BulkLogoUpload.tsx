"use client";

import { useRef, useState } from "react";
import { slugify } from "@/lib/slugs";
import { btnGhost } from "./ui";

type Client = { key: string; name: string };

/**
 * Pick many SVG logos at once. Each file is matched to a client by its file name
 * (e.g. "Rouses Markets.svg" or "rouses-markets.svg"), then uploaded to that client's logo slot.
 */
export default function BulkLogoUpload({ clients }: { clients: Client[] }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<{ ok: string[]; bad: string[] } | null>(null);

  function match(file: string): Client | undefined {
    const base = slugify(file.replace(/\.[^.]+$/, ""));
    return clients.find((c) => c.key === base) ?? clients.find((c) => base.startsWith(c.key) || c.key.startsWith(base) || base.includes(c.key));
  }

  async function run(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const ok: string[] = [];
    const bad: string[] = [];
    for (const f of Array.from(files)) {
      const c = match(f.name);
      if (!c) { bad.push(`${f.name}: no matching client (rename it to the client's name)`); continue; }
      if (f.type !== "image/svg+xml") { bad.push(`${f.name}: not an SVG`); continue; }
      const body = new FormData();
      body.set("file", f, f.name);
      body.set("slot", `/images/clients/${c.key}.svg`);
      body.set("alt", c.name);
      try {
        const r = await fetch("/api/admin/upload", { method: "POST", body });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "failed");
        ok.push(`${f.name} → ${c.name}`);
      } catch (e) {
        bad.push(`${f.name}: ${e instanceof Error ? e.message : "failed"}`);
      }
    }
    setLog({ ok, bad });
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  return (
    <div className="space-y-3">
      <input ref={input} type="file" multiple hidden accept="image/svg+xml" onChange={(e) => run(e.target.files)} />
      <button type="button" disabled={busy} onClick={() => input.current?.click()} className={btnGhost}>{busy ? "Uploading…" : "Choose logo files (SVG)"}</button>
      <p className="text-xs text-ash">Name each file after its client, like &ldquo;Rouses Markets.svg&rdquo;. Select as many as you like.</p>
      {log && (
        <div role="status" className="space-y-2 text-xs">
          {log.ok.length > 0 && <p className="text-emerald-300">{log.ok.length} uploaded. Refresh to see them.</p>}
          {log.bad.length > 0 && <ul className="space-y-1 text-flame-light">{log.bad.map((b) => <li key={b}>{b}</li>)}</ul>}
        </div>
      )}
    </div>
  );
}
