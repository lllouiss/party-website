import { notFound } from "next/navigation";
import { getRegistrationById } from "@/lib/db";
import { PARTY_CONFIG } from "@/lib/config";
import Link from "next/link";

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const id = parseInt(searchParams.id ?? "", 10);
  if (isNaN(id)) notFound();

  const reg = await getRegistrationById(id);
  if (!reg) notFound();

  const totalAmount = reg.plus_one_first_name
    ? PARTY_CONFIG.price * 2
    : PARTY_CONFIG.price;

  const twintMessage = reg.plus_one_first_name
    ? `${reg.first_name} ${reg.last_name} +1`
    : `${reg.first_name} ${reg.last_name}`;

  return (
    <main className="min-h-screen px-6 py-12 md:px-16 md:py-20 max-w-2xl mx-auto">
      {/* Stamp */}
      <div className="flex justify-center mb-16 reveal-1">
        <div
          className="w-40 h-40 border-4 border-accent flex items-center justify-center relative"
          style={{ animation: "stamp-in 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both" }}
        >
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="#e8ff00" strokeWidth="4" strokeLinecap="square">
            <polyline points="8,32 24,48 56,16" />
          </svg>
          <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent" />
          <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent" />
          <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-accent" />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent" />
        </div>
      </div>

      <div className="reveal-2 mb-10 text-center">
        <h1 className="font-display text-[clamp(48px,10vw,96px)] leading-none text-accent">
          BESTÄTIGT
        </h1>
        <p className="text-muted text-sm font-mono mt-2">Du stehst auf der Liste.</p>
      </div>

      {/* Summary */}
      <div className="reveal-3 border-t border-dim pt-8 mb-10">
        <Row label="Name" value={`${reg.first_name} ${reg.last_name}`} />
        <Row label="Telefon" value={reg.phone} />
        {reg.plus_one_first_name && (
          <Row label="+1 Person" value={`${reg.plus_one_first_name} ${reg.plus_one_last_name}`} />
        )}
        <Row label="Event" value={`${PARTY_CONFIG.name} — ${PARTY_CONFIG.date}`} />
      </div>

      {/* TWINT payment box */}
      <div className="reveal-4 border border-accent p-6 mb-10 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted uppercase tracking-widest">Zahlung via TWINT</p>
          <span className="font-display text-2xl text-accent">{totalAmount} CHF</span>
        </div>

        <div className="space-y-3">
          <PayStep step="1" label="TWINT öffnen und Betrag eingeben">
            <span className="text-accent font-mono">{totalAmount} CHF</span>
          </PayStep>

          <PayStep step="2" label="Nummer eingeben">
            <span className="text-accent font-mono">{PARTY_CONFIG.twintNumber}</span>
          </PayStep>

          <PayStep step="3" label="Nachricht (Pflichtfeld)">
            <span className="inline-flex items-center gap-2">
              <span className="text-accent font-mono">{twintMessage}</span>
            </span>
          </PayStep>
        </div>

        <p className="text-muted text-xs font-mono border-t border-dim pt-4">
          Bitte unbedingt deinen Namen in der Nachricht angeben — sonst kann die Zahlung nicht zugeordnet werden.
        </p>
      </div>

      <div className="reveal-5 flex justify-between items-center">
        <span className="text-muted text-xs font-mono">#{String(reg.id).padStart(4, "0")}</span>
        <Link href="/" className="text-muted text-xs hover:text-accent transition-colors">
          Zurück zur Startseite →
        </Link>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline gap-4 py-3 border-b border-dim">
      <span className="text-xs text-muted uppercase tracking-widest shrink-0">{label}</span>
      <span className="text-light font-mono text-sm text-right">{value}</span>
    </div>
  );
}

function PayStep({
  step,
  label,
  children,
}: {
  step: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="font-display text-accent text-lg leading-none shrink-0 w-5">{step}.</span>
      <div>
        <p className="text-muted text-xs uppercase tracking-widest mb-1">{label}</p>
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
}
