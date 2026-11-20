"use client";

import { useActionState, useState, startTransition, type FormEvent } from "react";
import type { Field } from "@/lib/content/forms";
import type { Taxonomy } from "@/lib/content/types";
import { btn, btnGhost, inputCls } from "./ui";
import UploadButton from "./UploadButton";

type State = { error?: string; ok?: string; warnings?: string[] } | undefined;

function Control({ f, value, tax }: { f: Field; value: unknown; tax: Taxonomy }) {
  const id = `f-${f.name}`;
  switch (f.type) {
    case "textarea":
      return <textarea id={id} name={f.name} rows={f.rows ?? 4} defaultValue={String(value ?? "")} className={inputCls} />;
    case "lines":
    case "youtube":
      return (
        <textarea id={id} name={f.name} rows={f.name === "youtubeIds" ? 4 : f.type === "youtube" ? 1 : (f.rows ?? 4)} defaultValue={Array.isArray(value) ? value.join("\n") : String(value ?? "")} className={`${inputCls} font-mono`} spellCheck={false} />
      );
    case "number":
      return <input id={id} name={f.name} type="number" defaultValue={Number(value ?? 0)} className={inputCls} />;
    case "bool":
      return <input id={id} name={f.name} type="checkbox" defaultChecked={Boolean(value)} className="h-4 w-4 accent-[#D01146]" />;
    case "select":
      return (
        <select id={id} name={f.name} defaultValue={String(value ?? "")} className={inputCls}>
          {(f.options ?? []).map((o) => <option key={o} value={o}>{o || "—"}</option>)}
        </select>
      );
    case "multi": {
      const list = f.taxonomy === "formats" ? tax.formats : tax.industries;
      const picked = new Set((value as string[]) ?? []);
      return (
        <div className="flex flex-wrap gap-2">
          {list.map((t) => (
            <label key={t.key} className="flex cursor-pointer items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-mist has-[:checked]:border-flame has-[:checked]:text-cream">
              <input type="checkbox" name={f.name} value={t.key} defaultChecked={picked.has(t.key)} className="accent-[#D01146]" />
              {t.label}
            </label>
          ))}
        </div>
      );
    }
    case "image":
      return <ImageField name={f.name} value={String(value ?? "")} />;
    default:
      return <input id={id} name={f.name} type={f.type === "url" ? "url" : "text"} defaultValue={String(value ?? "")} className={inputCls} />;
  }
}

function ImageField({ name, value }: { name: string; value: string }) {
  const [url, setUrl] = useState(value);
  return (
    <div className="space-y-2">
      <input name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className={`${inputCls} font-mono`} />
      <UploadButton label="Upload image" kind="image" width={1200} height={630} onUploaded={setUrl} />
      {url && /* eslint-disable-next-line @next/next/no-img-element */ <img src={url} alt="" className="h-24 rounded border border-border" />}
    </div>
  );
}

/**
 * One generic editor for every content type. The server action decides what
 * "save" means: Save draft, Publish (draft + live), Discard draft, Delete.
 */
export default function RecordForm({
  action,
  fields,
  values,
  tax,
  hidden,
  existing,
  allowDelete,
  previewHref,
  canPublish = true,
}: {
  action: (p: State, fd: FormData) => Promise<State>;
  fields: Field[];
  values: Record<string, unknown>;
  tax: Taxonomy;
  hidden: Record<string, string>;
  existing?: boolean;
  allowDelete?: boolean;
  previewHref?: string;
  canPublish?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  // Submit via a transition (not <form action>) so React doesn't reset the fields when validation fails.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
    startTransition(() => formAction(fd));
  }
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)}
      {fields.map((f) => (
        <div key={f.name} className={f.type === "bool" ? "flex items-center gap-3" : ""}>
          {f.type === "bool" ? (
            <>
              <Control f={f} value={values[f.name]} tax={tax} />
              <label htmlFor={`f-${f.name}`} className="text-sm text-cream">{f.label}</label>
            </>
          ) : (
            <>
              <label htmlFor={`f-${f.name}`} className="mb-1.5 block text-xs uppercase tracking-wider text-mist">
                {f.label}{f.required && <span className="text-flame"> *</span>}
              </label>
              <Control f={f} value={values[f.name]} tax={tax} />
            </>
          )}
          {f.help && <p className="mt-1 text-xs text-ash">{f.help}</p>}
        </div>
      ))}

      {state?.error && <p role="alert" className="rounded border border-flame/50 bg-flame/10 p-3 text-sm text-flame-light">{state.error}</p>}
      {state?.ok && <p role="status" className="rounded border border-emerald-600/50 bg-emerald-500/10 p-3 text-sm text-emerald-300">{state.ok}</p>}
      {state?.warnings?.map((w) => <p key={w} className="text-xs text-amber-300">{w}</p>)}

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
        <button name="intent" value="save" disabled={pending} className={btnGhost}>Save draft</button>
        {canPublish && <button name="intent" value="publish" disabled={pending} className={btn}>Publish</button>}
        {existing && <button name="intent" value="discard" disabled={pending} formNoValidate className="text-sm text-mist underline hover:text-cream">Discard draft</button>}
        {previewHref && <a href={previewHref} target="_blank" rel="noopener noreferrer" className="text-sm text-cream underline decoration-cream/30 underline-offset-4 hover:decoration-flame">Preview ↗</a>}
        {existing && allowDelete && (
          <span className="ml-auto flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-ash"><input type="checkbox" name="confirmDelete" className="accent-[#D01146]" /> Delete anyway</label>
            <button name="intent" value="delete" disabled={pending} formNoValidate className="text-sm text-red-400 underline hover:text-red-300">Delete</button>
          </span>
        )}
      </div>
    </form>
  );
}
