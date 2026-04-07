"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { isOnGuestlist } from "@/lib/guestlist";
import { createRegistration, isAlreadyRegistered } from "@/lib/db";

const RegisterSchema = z.object({
  firstName: z.string().min(1, "Vorname erforderlich").max(50),
  lastName: z.string().min(1, "Nachname erforderlich").max(50),
  klasse: z.string().min(1, "Klasse erforderlich"),
  hasPlusOne: z.string().optional(),
  plusOneFirstName: z.string().max(50).optional(),
  plusOneLastName: z.string().max(50).optional(),
});

export type RegisterState = {
  errors?: {
    firstName?: string[];
    lastName?: string[];
    klasse?: string[];
    plusOneFirstName?: string[];
    plusOneLastName?: string[];
    general?: string[];
  };
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    klasse: formData.get("klasse") as string,
    hasPlusOne: formData.get("hasPlusOne") as string | undefined,
    plusOneFirstName: formData.get("plusOneFirstName") as string | undefined,
    plusOneLastName: formData.get("plusOneLastName") as string | undefined,
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { firstName, lastName, klasse, hasPlusOne, plusOneFirstName, plusOneLastName } =
    parsed.data;

  // Gästeliste prüfen
  if (!isOnGuestlist(firstName, lastName)) {
    return {
      errors: {
        general: ["Du stehst leider nicht auf der Gästeliste."],
      },
    };
  }

  // Duplikat prüfen
  const alreadyRegistered = await isAlreadyRegistered(firstName, lastName);
  if (alreadyRegistered) {
    return {
      errors: {
        general: ["Du hast dich bereits angemeldet."],
      },
    };
  }

  // Begleitperson validieren wenn aktiv
  const withPlusOne = hasPlusOne === "on";
  if (withPlusOne) {
    if (!plusOneFirstName?.trim()) {
      return { errors: { plusOneFirstName: ["Vorname der Begleitperson erforderlich"] } };
    }
    if (!plusOneLastName?.trim()) {
      return { errors: { plusOneLastName: ["Nachname der Begleitperson erforderlich"] } };
    }
  }

  const registration = await createRegistration({
    firstName,
    lastName,
    klasse,
    plusOneFirstName: withPlusOne ? plusOneFirstName?.trim() : undefined,
    plusOneLastName: withPlusOne ? plusOneLastName?.trim() : undefined,
  });

  redirect(`/confirm?id=${registration.id}`);
}
