"use client";

import { useActionState } from "react";
import { changePasswordAction } from "./actions";
import { btn, inputCls } from "@/components/admin/ui";

export default function PasswordForm() {
  const [s, action, pending] = useActionState(changePasswordAction, undefined);
  return (
    <form action={action} className="max-w-sm space-y-3">
      <input name="current" type="password" required autoComplete="current-password" placeholder="Current password" className={inputCls} />
      <input name="next" type="password" required minLength={10} autoComplete="new-password" placeholder="New password (10+ characters)" className={inputCls} />
      <input name="confirm" type="password" required minLength={10} autoComplete="new-password" placeholder="Confirm new password" className={inputCls} />
      {s?.error && <p role="alert" className="text-sm text-flame-light">{s.error}</p>}
      {s?.ok && <p role="status" className="text-sm text-emerald-300">{s.ok}</p>}
      <button disabled={pending} className={btn}>{pending ? "Saving…" : "Change password"}</button>
    </form>
  );
}
