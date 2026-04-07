"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addGuestAction } from "@/app/actions/admin";

const initialState: { error?: string; success?: boolean } = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary text-sm shrink-0" disabled={pending}>
      {pending ? "…" : "+ Hinzufügen"}
    </button>
  );
}

export default function AddGuestForm() {
  const [state, formAction] = useFormState(addGuestAction, initialState);

  return (
    <form action={formAction} className="flex gap-3 items-end flex-wrap">
      <div className="flex-1 min-w-48">
        <label className="block text-xs text-muted uppercase tracking-widest mb-3">
          Name hinzufügen
        </label>
        <input
          name="name"
          type="text"
          className="field"
          placeholder="Anna Müller"
          key={state.success ? Math.random() : "name"}
          autoComplete="off"
        />
        {state.error && (
          <p className="text-red-400 text-xs mt-2 font-mono">{state.error}</p>
        )}
        {state.success && (
          <p className="text-accent text-xs mt-2 font-mono">✓ Hinzugefügt</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
