"use server";

import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sessionOptions, SessionData } from "@/lib/session";
import { togglePaid, togglePlusOnePaid, addToGuestlist, removeFromGuestlist } from "@/lib/db";

async function requireAdmin() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.isAdmin) throw new Error("Unauthorized");
}

export async function loginAction(
  _prevState: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const password = formData.get("password") as string;
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Falsches Passwort." };
  }
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.isAdmin = true;
  await session.save();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  session.destroy();
  redirect("/admin/login");
}

export async function togglePaidAction(id: number): Promise<void> {
  await requireAdmin();
  await togglePaid(id);
  revalidatePath("/admin");
}

export async function togglePlusOnePaidAction(id: number): Promise<void> {
  await requireAdmin();
  await togglePlusOnePaid(id);
  revalidatePath("/admin");
}

export async function addGuestAction(
  _prevState: { error?: string; success?: boolean },
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  await requireAdmin();
  const name = (formData.get("name") as string)?.trim();
  if (!name || name.split(" ").filter(Boolean).length < 2) {
    return { error: "Bitte Vor- und Nachname eingeben (z.B. «Anna Müller»)" };
  }
  await addToGuestlist(name);
  revalidatePath("/admin/guestlist");
  return { success: true };
}

export async function removeGuestAction(id: number): Promise<void> {
  await requireAdmin();
  await removeFromGuestlist(id);
  revalidatePath("/admin/guestlist");
}
