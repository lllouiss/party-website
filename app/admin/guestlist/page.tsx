import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { redirect } from "next/navigation";
import { sessionOptions, SessionData } from "@/lib/session";
import { getGuestlist } from "@/lib/db";
import { removeGuestAction } from "@/app/actions/admin";
import Link from "next/link";
import AddGuestForm from "./AddGuestForm";

export default async function GuestlistPage() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isAdmin) redirect("/admin/login");

  const guests = await getGuestlist();

  return (
    <main className="min-h-screen px-4 py-8 md:px-10 md:py-12 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link
          href="/admin"
          className="text-muted text-xs tracking-[0.2em] uppercase hover:text-accent transition-colors"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="mb-8">
        <span className="text-muted text-xs tracking-[0.25em] uppercase">Admin</span>
        <h1 className="font-display text-4xl text-light mt-1">GÄSTELISTE</h1>
        <p className="text-muted text-xs font-mono mt-2">
          {guests.length} Einträge — Format: «Vorname Nachname» (Gross-/Kleinschreibung egal)
        </p>
      </div>

      {/* Add form */}
      <AddGuestForm />

      {/* List */}
      <div className="mt-8 border-t border-dim">
        {guests.length === 0 && (
          <p className="py-8 text-center text-muted text-xs font-mono">
            Noch keine Einträge.
          </p>
        )}
        {guests.map((g) => (
          <div
            key={g.id}
            className="flex items-center justify-between py-3 px-1 border-b border-dim group"
          >
            <span className="text-light font-mono text-sm">{g.full_name}</span>
            <form
              action={async () => {
                "use server";
                await removeGuestAction(g.id);
              }}
            >
              <button
                type="submit"
                className="text-muted text-xs hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Entfernen"
              >
                ✕ entfernen
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
