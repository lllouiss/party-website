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

  return (
    <main className="min-h-screen px-6 py-12 md:px-16 md:py-20 max-w-2xl mx-auto">
      {/* Stamp */}
      <div className="flex justify-center mb-16 reveal-1">
        <div
          className="w-40 h-40 border-4 border-accent flex items-center justify-center relative"
          style={{ animation: "stamp-in 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.2s both" }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            stroke="#e8ff00"
            strokeWidth="4"
            strokeLinecap="square"
          >
            <polyline points="8,32 24,48 56,16" />
          </svg>
          {/* Corner accents */}
          <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-accent" />
          <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent" />
          <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-accent" />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-accent" />
        </div>
      </div>

      {/* Heading */}
      <div className="reveal-2 mb-10 text-center">
        <h1 className="font-display text-[clamp(48px,10vw,96px)] leading-none text-accent">
          BESTÄTIGT
        </h1>
        <p className="text-muted text-sm font-mono mt-2">
          Du stehst auf der Liste.
        </p>
      </div>

      {/* Summary */}
      <div className="reveal-3 border-t border-dim pt-8 space-y-4 mb-10">
        <Row label="Name" value={`${reg.first_name} ${reg.last_name}`} />
        <Row label="Klasse" value={reg.klasse} />
        {reg.plus_one_first_name && (
          <Row
            label="+1 Person"
            value={`${reg.plus_one_first_name} ${reg.plus_one_last_name}`}
          />
        )}
        <Row label="Event" value={`${PARTY_CONFIG.name} — ${PARTY_CONFIG.date}`} />
      </div>

      {/* Payment info */}
      <div className="reveal-4 border border-dim p-6 mb-10">
        <p className="text-xs text-muted uppercase tracking-widest mb-3">Eintritt</p>
        <p className="text-light font-mono text-sm leading-relaxed">
          Bezahle{" "}
          <span className="text-accent font-mono">
            {PARTY_CONFIG.price} CHF
          </span>{" "}
          {reg.plus_one_first_name ? (
            <>
              ×2 ={" "}
              <span className="text-accent">{PARTY_CONFIG.price * 2} CHF total{" "}</span>
            </>
          ) : null}
          an der Tür oder per TWINT an{" "}
          <span className="text-accent">{PARTY_CONFIG.twintNumber}</span>
          .
        </p>
      </div>

      {/* Footer */}
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
