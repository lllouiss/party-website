import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";
import { sessionOptions, SessionData } from "@/lib/session";
import { getAllRegistrations } from "@/lib/db";

export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isAdmin) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const registrations = await getAllRegistrations();

  const header =
    "ID,Vorname,Nachname,Telefon,Bezahlt,+1 Vorname,+1 Nachname,+1 Bezahlt,Angemeldet\n";
  const rows = registrations.map((r) =>
    [
      r.id,
      `"${r.first_name}"`,
      `"${r.last_name}"`,
      `"${r.phone}"`,
      r.paid ? "ja" : "nein",
      r.plus_one_first_name ? `"${r.plus_one_first_name}"` : "",
      r.plus_one_last_name  ? `"${r.plus_one_last_name}"` : "",
      r.plus_one_first_name ? (r.plus_one_paid ? "ja" : "nein") : "",
      new Date(r.created_at).toISOString(),
    ].join(",")
  );

  const csv = header + rows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="anmeldungen-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
