"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState, useEffect } from "react";
import { registerAction, RegisterState } from "@/app/actions/register";
import { KLASSEN } from "@/lib/config";
import Link from "next/link";

const initialState: RegisterState = {};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? "Wird gesendet…" : label}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useFormState(registerAction, initialState);
  const [step, setStep] = useState<1 | 2>(1);
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    klasse: "",
  });

  useEffect(() => {
    if (
      state.errors?.general ||
      state.errors?.firstName ||
      state.errors?.lastName ||
      state.errors?.klasse
    ) {
      setStep(1);
    }
  }, [state.errors]);

  return (
    <main className="min-h-screen px-6 py-12 md:px-16 md:py-20 max-w-2xl mx-auto">
      <div className="reveal-1 mb-12">
        <Link
          href="/"
          className="text-muted text-xs tracking-[0.2em] uppercase hover:text-accent transition-colors"
        >
          ← Zurück
        </Link>
      </div>

      <div className="reveal-2 mb-2">
        <span className="text-muted text-xs tracking-[0.3em] uppercase">
          Schritt {step} / 2
        </span>
      </div>
      <div className="reveal-3 mb-12">
        <h1 className="font-display text-[clamp(48px,10vw,96px)] leading-none text-light whitespace-pre-line">
          {step === 1 ? "ANMELDEN" : "BEGLEIT-\nPERSON"}
        </h1>
      </div>

      <form action={formAction}>
        {step === 2 && (
          <>
            <input type="hidden" name="firstName" value={formData.firstName} />
            <input type="hidden" name="lastName" value={formData.lastName} />
            <input type="hidden" name="klasse" value={formData.klasse} />
          </>
        )}

        {step === 1 && (
          <div className="space-y-8 reveal-4">
            {state.errors?.general && (
              <div className="border-l-2 border-red-500 pl-4 py-1">
                <p className="text-red-400 text-sm font-mono">
                  {state.errors.general[0]}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-muted uppercase tracking-widest mb-3">
                  Vorname
                </label>
                <input
                  name="firstName"
                  type="text"
                  className="field"
                  placeholder="Dein Vorname"
                  defaultValue={formData.firstName}
                  autoComplete="given-name"
                />
                {state.errors?.firstName && (
                  <p className="text-red-400 text-xs mt-2">
                    {state.errors.firstName[0]}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs text-muted uppercase tracking-widest mb-3">
                  Nachname
                </label>
                <input
                  name="lastName"
                  type="text"
                  className="field"
                  placeholder="Dein Nachname"
                  defaultValue={formData.lastName}
                  autoComplete="family-name"
                />
                {state.errors?.lastName && (
                  <p className="text-red-400 text-xs mt-2">
                    {state.errors.lastName[0]}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs text-muted uppercase tracking-widest mb-3">
                Klasse
              </label>
              <select name="klasse" className="field" defaultValue={formData.klasse}>
                <option value="">— Klasse wählen —</option>
                {KLASSEN.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              {state.errors?.klasse && (
                <p className="text-red-400 text-xs mt-2">
                  {state.errors.klasse[0]}
                </p>
              )}
            </div>

            <div className="pt-4">
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  const form = document.querySelector("form") as HTMLFormElement;
                  const fd = new FormData(form);
                  const fn = (fd.get("firstName") as string)?.trim();
                  const ln = (fd.get("lastName") as string)?.trim();
                  const kl = (fd.get("klasse") as string)?.trim();
                  if (!fn || !ln || !kl) return;
                  setFormData({ firstName: fn, lastName: ln, klasse: kl });
                  setStep(2);
                }}
              >
                Weiter →
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 reveal-4">
            <div className="border-l-2 border-accent pl-4 py-1 space-y-1">
              <p className="text-xs text-muted uppercase tracking-widest">
                Du meldest an:
              </p>
              <p className="text-light font-mono">
                {formData.firstName} {formData.lastName} — {formData.klasse}
              </p>
            </div>

            <div>
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className="relative mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    name="hasPlusOne"
                    className="sr-only peer"
                    checked={hasPlusOne}
                    onChange={(e) => setHasPlusOne(e.target.checked)}
                  />
                  <div className="w-5 h-5 border border-muted peer-checked:border-accent peer-checked:bg-accent transition-colors" />
                  {hasPlusOne && (
                    <span className="absolute inset-0 flex items-center justify-center text-bg text-xs font-bold pointer-events-none">
                      ✓
                    </span>
                  )}
                </div>
                <span className="text-sm text-light leading-relaxed group-hover:text-accent transition-colors">
                  Ich bringe jemanden mit{" "}
                  <span className="text-muted">(+1 Person)</span>
                </span>
              </label>
            </div>

            {hasPlusOne && (
              <div className="grid grid-cols-2 gap-6 reveal-4">
                <div>
                  <label className="block text-xs text-muted uppercase tracking-widest mb-3">
                    Vorname Begleitperson
                  </label>
                  <input
                    name="plusOneFirstName"
                    type="text"
                    className="field"
                    placeholder="Vorname"
                  />
                  {state.errors?.plusOneFirstName && (
                    <p className="text-red-400 text-xs mt-2">
                      {state.errors.plusOneFirstName[0]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-muted uppercase tracking-widest mb-3">
                    Nachname Begleitperson
                  </label>
                  <input
                    name="plusOneLastName"
                    type="text"
                    className="field"
                    placeholder="Nachname"
                  />
                  {state.errors?.plusOneLastName && (
                    <p className="text-red-400 text-xs mt-2">
                      {state.errors.plusOneLastName[0]}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4 flex-wrap">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setStep(1)}
              >
                ← Zurück
              </button>
              <SubmitButton label="Anmelden →" />
            </div>
          </div>
        )}
      </form>
    </main>
  );
}
