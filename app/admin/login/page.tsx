"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions/admin";

const initialState: { error?: string } = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full" disabled={pending}>
      {pending ? "…" : "Einloggen"}
    </button>
  );
}

export default function AdminLoginPage() {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <span className="text-muted text-xs tracking-[0.3em] uppercase block mb-2">
            Admin
          </span>
          <h1 className="font-display text-5xl text-light">LOGIN</h1>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-xs text-muted uppercase tracking-widest mb-3">
              Passwort
            </label>
            <input
              name="password"
              type="password"
              className="field"
              placeholder="••••••••"
              autoFocus
            />
            {state.error && (
              <p className="text-red-400 text-xs mt-2 font-mono">{state.error}</p>
            )}
          </div>
          <SubmitButton />
        </form>
      </div>
    </main>
  );
}
