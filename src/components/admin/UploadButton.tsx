"use client";

import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { btnGhost, inputCls } from "./ui";

/**
 * Pick a file, give it alt text, upload. Images are resized in the browser
 * first (so they fit the 4 MB request limit) and again on the server. Videos
 * go straight to Blob. `slot` makes the file replace that site slot; without
 * it the upload just joins the media library (and `onUploaded` gets the URL).
 */
export default function UploadButton({
  slot,
  kind,
  width,
  height,
  label = "Upload",
  defaultAlt = "",
  onUploaded,
}: {
  slot?: string;
  kind: "image" | "svg" | "video";
  width?: number;
  height?: number;
  label?: string;
  defaultAlt?: string;
  onUploaded?: (url: string) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [alt, setAlt] = useState(defaultAlt);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function shrink(file: File): Promise<Blob> {
    if (file.type === "image/svg+xml" || !width || !height) return file;
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, width / bmp.width, height / bmp.height);
    if (scale === 1 && file.size < 3.5 * 1024 * 1024) return file;
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    c.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
    return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("Couldn't resize that image."))), "image/jpeg", 0.88));
  }

  async function onPick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      if (kind === "video") {
        if (file.type !== "video/mp4") throw new Error("Use an MP4 (H.264).");
        if (file.size > 15 * 1024 * 1024) throw new Error("The reel must be 15 MB or less.");
        const blob = await upload(`media/${file.name}`, file, { access: "public", handleUploadUrl: "/api/admin/blob-token" });
        const r = await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: blob.url, slot, alt, bytes: file.size, filename: file.name, contentType: file.type }) });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Upload failed.");
        onUploaded?.(blob.url);
      } else {
        if (kind === "svg" && file.type !== "image/svg+xml") throw new Error("Logos must be SVG.");
        const body = new FormData();
        body.set("file", await shrink(file), file.name);
        if (slot) body.set("slot", slot);
        body.set("alt", alt);
        if (width) body.set("width", String(width));
        if (height) body.set("height", String(height));
        const r = await fetch("/api/admin/upload", { method: "POST", body });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || "Upload failed.");
        onUploaded?.(j.url);
      }
      setMsg({ ok: true, text: "Uploaded. Refresh to see it." });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Upload failed." });
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        {kind !== "video" && kind !== "svg" && (
          <input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Alt text (describe the image)" aria-label="Alt text" className={`${inputCls} max-w-xs`} />
        )}
        <input ref={input} type="file" hidden accept={kind === "video" ? "video/mp4" : kind === "svg" ? "image/svg+xml" : "image/jpeg,image/png,image/webp"} onChange={(e) => onPick(e.target.files?.[0])} />
        <button type="button" disabled={busy} onClick={() => input.current?.click()} className={btnGhost}>{busy ? "Uploading…" : label}</button>
      </div>
      {msg && <p role="status" className={`text-xs ${msg.ok ? "text-emerald-300" : "text-flame-light"}`}>{msg.text}</p>}
    </div>
  );
}
