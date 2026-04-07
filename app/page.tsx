import Link from "next/link";
import { PARTY_CONFIG } from "@/lib/config";
import Countdown from "./Countdown";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between px-6 py-12 md:px-16 md:py-20 max-w-5xl mx-auto">
      <div className="reveal-1">
        <span className="text-muted text-xs tracking-[0.3em] uppercase font-mono">
          Schülerparty — Anmeldung
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center py-16">
        <div className="reveal-2">
          <h1 className="font-display text-[clamp(72px,15vw,180px)] leading-none tracking-tight text-light">
            {PARTY_CONFIG.name}
          </h1>
        </div>

        <div className="reveal-3 mt-6 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-accent block" />
            <span className="text-sm text-light font-mono">{PARTY_CONFIG.date}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-8 h-px bg-muted block" />
            <span className="text-sm text-muted font-mono">
              {PARTY_CONFIG.time} — {PARTY_CONFIG.location}
            </span>
          </div>
        </div>

        <div className="reveal-4 mt-12">
          <Countdown eventDate={PARTY_CONFIG.eventDate} />
        </div>

        <div className="reveal-5 mt-14">
          <Link href="/register" className="btn-primary text-base">
            Jetzt anmelden →
          </Link>
        </div>
      </div>

      <div className="reveal-6 border-t border-dim pt-6 flex justify-between items-center">
        <span className="text-muted text-xs font-mono tracking-widest uppercase">
          Eintritt {PARTY_CONFIG.price} CHF
        </span>
        <span className="text-muted text-xs font-mono">Gästeliste erforderlich</span>
      </div>
    </main>
  );
}
