import Link from "next/link";
import { PARTY_CONFIG } from "@/lib/config";
import Countdown from "./Countdown";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col px-6 py-12 md:px-16 md:py-20 max-w-5xl mx-auto">
      {/* Label */}
      <div className="reveal-1">
        <span className="text-muted text-xs tracking-[0.3em] uppercase font-mono">
          Schülerparty — Anmeldung
        </span>
      </div>

      {/* Hero */}
      <div className="flex-1 flex flex-col justify-center py-12">
        <div className="reveal-2">
          <h1 className="font-display text-[clamp(72px,15vw,180px)] leading-none tracking-tight text-light">
            {PARTY_CONFIG.name}
          </h1>
        </div>

        {/* Countdown */}
        <div className="reveal-3 mt-10">
          <Countdown eventDate={PARTY_CONFIG.eventDate} />
        </div>

        {/* CTA */}
        <div className="reveal-4 mt-12">
          <Link href="/register" className="btn-primary text-base">
            Jetzt anmelden →
          </Link>
        </div>
      </div>

      {/* Info + Map grid */}
      <div className="grid md:grid-cols-2 gap-6 mt-8 reveal-5">

        {/* Event details */}
        <div className="border border-dim p-6 space-y-5">
          <p className="text-xs text-muted uppercase tracking-[0.25em]">Details</p>

          <InfoRow label="Datum">{PARTY_CONFIG.date}</InfoRow>
          <InfoRow label="Einlass">{PARTY_CONFIG.time}</InfoRow>
          <InfoRow label="Ort">{PARTY_CONFIG.location}</InfoRow>

          {/* Divider */}
          <div className="border-t border-dim" />

          {/* Price — highlighted */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted uppercase tracking-widest">Eintritt</span>
            <span className="font-display text-3xl text-accent leading-none">
              {PARTY_CONFIG.price} CHF
            </span>
          </div>

          {/* TWINT only hint */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted uppercase tracking-widest">Zahlung</span>
            <span className="text-xs font-mono text-light ml-auto">TWINT an +41 76 720 92 32</span>
          </div>

          {/* Guestlist notice */}
          <div className="border border-accent/40 bg-accent/5 px-4 py-3 flex items-start gap-3">
            <span className="text-accent font-display text-lg leading-none mt-0.5">!</span>
            <p className="text-xs font-mono text-light leading-relaxed">
              Anmeldung nur möglich wenn man auf der Gästeliste steht.
            </p>
          </div>
        </div>

        {/* Map */}
        <div className="border border-dim overflow-hidden relative">
          <p className="text-xs text-muted uppercase tracking-[0.25em] px-4 pt-4 pb-3">
            Standort
          </p>
          <div className="relative" style={{ height: "320px" }}>
            {/* Dark overlay to match theme */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(13,13,13,0.15) 0%, transparent 20%, transparent 80%, rgba(13,13,13,0.3) 100%)",
              }}
            />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3640.9160584092347!2d8.27671119547762!3d47.327435204909676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479010f2db99ddd1%3A0xe554c3b1bf8130ae!2sWaldhaus%20B%C3%BCttikon!5e1!3m2!1sde!2sch!4v1775563872266!5m2!1sde!2sch"
              width="100%"
              height="100%"
              style={{
                border: 0,
                display: "block",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Waldhaus Büttikon"
            />
          </div>
          <div className="px-4 py-3 flex items-center justify-between border-t border-dim">
            <span className="text-xs font-mono text-muted">Waldhaus Büttikon</span>
            <a
              href="https://maps.google.com/?q=Waldhaus+Büttikon"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline font-mono"
            >
              Google Maps ↗
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-xs text-muted uppercase tracking-widest shrink-0">{label}</span>
      <span className="text-sm font-mono text-light text-right">{children}</span>
    </div>
  );
}
