import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { redirect } from "next/navigation";
import { sessionOptions, SessionData } from "@/lib/session";
import { getAllRegistrations, getStats } from "@/lib/db";
import { logoutAction, togglePaidAction } from "@/app/actions/admin";
import { Registration } from "@/lib/db";

type FilterType = "all" | "paid" | "unpaid";

function formatDate(d: Date): string {
  return new Date(d).toLocaleString("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildCsv(registrations: Registration[]): string {
  const header = "ID,Vorname,Nachname,Klasse,+1 Vorname,+1 Nachname,Bezahlt,Angemeldet\n";
  const rows = registrations.map((r) =>
    [
      r.id,
      r.first_name,
      r.last_name,
      r.klasse,
      r.plus_one_first_name ?? "",
      r.plus_one_last_name ?? "",
      r.paid ? "ja" : "nein",
      new Date(r.created_at).toISOString(),
    ].join(",")
  );
  return header + rows.join("\n");
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isAdmin) redirect("/admin/login");

  const filter = (searchParams.filter ?? "all") as FilterType;
  const [all, stats] = await Promise.all([getAllRegistrations(), getStats()]);

  const registrations = all.filter((r) => {
    if (filter === "paid") return r.paid;
    if (filter === "unpaid") return !r.paid;
    return true;
  });

  return (
    <main className="min-h-screen px-4 py-8 md:px-10 md:py-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <span className="text-muted text-xs tracking-[0.25em] uppercase">Admin</span>
          <h1 className="font-display text-4xl text-light mt-1">DASHBOARD</h1>
        </div>
        <form action={logoutAction}>
          <button type="submit" className="btn-secondary text-xs">
            Ausloggen
          </button>
        </form>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard label="Anmeldungen" value={stats.total} />
        <StatCard label="Begleitpersonen" value={stats.plusOnes} />
        <StatCard label="Bezahlt" value={stats.paid} accent />
      </div>

      {/* Filter + Export */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex gap-0">
          {(["all", "paid", "unpaid"] as const).map((f) => (
            <a
              key={f}
              href={`/admin?filter=${f}`}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-widest border border-dim transition-colors ${
                filter === f
                  ? "bg-accent text-bg border-accent"
                  : "text-muted hover:text-light hover:border-muted"
              }`}
            >
              {f === "all" ? "Alle" : f === "paid" ? "Bezahlt" : "Ausstehend"}
            </a>
          ))}
        </div>

        <a
          href="/admin/export"
          className="btn-secondary text-xs"
        >
          CSV Export ↓
        </a>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono border-collapse">
          <thead>
            <tr className="border-b border-dim">
              {["#", "Name", "Klasse", "Begleitperson", "Bezahlt", "Angemeldet"].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs text-muted uppercase tracking-widest py-3 px-3 font-normal"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted text-xs">
                  Keine Einträge.
                </td>
              </tr>
            )}
            {registrations.map((r) => (
              <tr
                key={r.id}
                className={`border-b border-dim transition-opacity ${
                  r.paid ? "opacity-50" : ""
                }`}
              >
                <td className="py-3 px-3 text-muted text-xs">
                  #{String(r.id).padStart(4, "0")}
                </td>
                <td className="py-3 px-3">
                  <span className={r.paid ? "text-muted" : "text-light"}>
                    {r.first_name} {r.last_name}
                  </span>
                </td>
                <td className="py-3 px-3 text-muted">{r.klasse}</td>
                <td className="py-3 px-3 text-muted">
                  {r.plus_one_first_name
                    ? `${r.plus_one_first_name} ${r.plus_one_last_name}`
                    : "—"}
                </td>
                <td className="py-3 px-3">
                  <PaidToggle id={r.id} paid={r.paid} />
                </td>
                <td className="py-3 px-3 text-muted text-xs">
                  {formatDate(r.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="border border-dim p-4 md:p-6">
      <div
        className={`font-display text-[clamp(36px,5vw,64px)] leading-none ${
          accent ? "text-accent" : "text-light"
        }`}
      >
        {value}
      </div>
      <div className="text-muted text-xs uppercase tracking-widest mt-2">{label}</div>
    </div>
  );
}

function PaidToggle({ id, paid }: { id: number; paid: boolean }) {
  return (
    <form
      action={async () => {
        "use server";
        await togglePaidAction(id);
      }}
    >
      <button
        type="submit"
        className={`w-5 h-5 border transition-colors flex items-center justify-center ${
          paid
            ? "border-accent bg-accent"
            : "border-muted hover:border-accent"
        }`}
        title={paid ? "Als unbezahlt markieren" : "Als bezahlt markieren"}
      >
        {paid && (
          <span className="text-bg text-xs font-bold leading-none">✓</span>
        )}
      </button>
    </form>
  );
}
