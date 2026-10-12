"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="mx-auto mt-32 w-full max-w-sm space-y-4 px-6">
      <h1 className="font-display text-2xl uppercase tracking-widest">Admin</h1>
      <input
        type="password"
        name="password"
        required
        autoFocus
        autoComplete="current-password"
        placeholder="Password"
        className="w-full rounded border border-border bg-bayou px-4 py-3 text-cream outline-none focus:border-flame"
      />
      {state?.error && <p className="text-sm text-flame">{state.error}</p>}
      <button
        disabled={pending}
        className="w-full rounded bg-ember px-4 py-3 text-sm font-semibold uppercase tracking-widest text-white disabled:opacity-60"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
