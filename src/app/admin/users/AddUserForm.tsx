"use client";

import { useActionState } from "react";
import { addUserAction } from "./actions";
import { btn, inputCls } from "@/components/admin/ui";

export default function AddUserForm() {
  const [s, action, pending] = useActionState(addUserAction, undefined);
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <input name="name" placeholder="Name" className={inputCls} />
      <input name="email" type="email" required placeholder="Email" className={inputCls} />
      <input name="password" type="password" required minLength={10} placeholder="Temporary password (10+ characters)" autoComplete="new-password" className={inputCls} />
      <select name="role" defaultValue="editor" className={inputCls}><option value="editor">Editor (content, media, inbox)</option><option value="owner">Owner (everything)</option></select>
      <div className="sm:col-span-2 flex items-center gap-4"><button disabled={pending} className={btn}>Add user</button>{s?.error && <span role="alert" className="text-sm text-flame-light">{s.error}</span>}{s?.ok && <span role="status" className="text-sm text-emerald-300">{s.ok}</span>}</div>
    </form>
  );
}
