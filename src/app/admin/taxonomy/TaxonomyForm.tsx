"use client";

import { useActionState, startTransition, type FormEvent } from "react";
import { saveTaxonomyAction } from "../content/actions";
import { btn, btnGhost, inputCls } from "@/components/admin/ui";

export default function TaxonomyForm({ formats, industries }: { formats: string; industries: string }) {
  const [state, action, pending] = useActionState(saveTaxonomyAction, undefined);
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget, (e.nativeEvent as SubmitEvent).submitter);
    startTransition(() => action(fd));
  }
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="t-formats" className="mb-1.5 block text-xs uppercase tracking-wider text-mist">Formats</label>
        <textarea id="t-formats" name="formats" rows={6} defaultValue={formats} className={`${inputCls} font-mono`} spellCheck={false} />
      </div>
      <div>
        <label htmlFor="t-industries" className="mb-1.5 block text-xs uppercase tracking-wider text-mist">Industries</label>
        <textarea id="t-industries" name="industries" rows={10} defaultValue={industries} className={`${inputCls} font-mono`} spellCheck={false} />
      </div>
      {state?.error && <p role="alert" className="text-sm text-flame-light">{state.error}</p>}
      {state?.ok && <p role="status" className="text-sm text-emerald-300">{state.ok}</p>}
      <div className="flex gap-3 border-t border-border pt-5">
        <button name="intent" value="save" disabled={pending} className={btnGhost}>Save draft</button>
        <button name="intent" value="publish" disabled={pending} className={btn}>Publish</button>
      </div>
    </form>
  );
}
