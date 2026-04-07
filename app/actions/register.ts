"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { isOnGuestlistDb, createRegistration, isAlreadyRegistered } from "@/lib/db";

const RegisterSchema = z.object({
  firstName:        z.string().min(1, "Vorname erforderlich").max(50),
  lastName:         z.string().min(1, "Nachname erforderlich").max(50),
  phone:            z.string().min(6, "Telefonnummer erforderlich").max(20),
  hasPlusOne:       z.string().optional(),
  plusOneFirstName: z.string().max(50).optional(),
  plusOneLastName:  z.string().max(50).optional(),
});

export type RegisterState = {
  errors?: {
    firstName?:        string[];
    lastName?:         string[];
    phone?:            string[];
    plusOneFirstName?: string[];
    plusOneLastName?:  string[];
    general?:          string[];
  };
};

export async function registerAction(
  _prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> {
  const raw = {
    firstName:        formData.get("firstName") as string,
    lastName:         formData.get("lastName") as string,
    phone:            formData.get("phone") as string,
    // null → undefined so Zod's .optional() accepts it
    hasPlusOne:       (formData.get("hasPlusOne") ?? undefined) as string | undefined,
    plusOneFirstName: (formData.get("plusOneFirstName") ?? undefined) as string | undefined,
    plusOneLastName:  (formData.get("plusOneLastName") ?? undefined) as string | undefined,
  };

  const parsed = RegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors };
  }

  const { firstName, lastName, phone, hasPlusOne, plusOneFirstName, plusOneLastName } =
    parsed.data;

  // Gästeliste (DB) prüfen
  const onList = await isOnGuestlistDb(firstName, lastName);
  if (!onList) {
    return { errors: { general: ["Du stehst leider nicht auf der Gästeliste."] } };
  }

  // Duplikat prüfen
  if (await isAlreadyRegistered(firstName, lastName)) {
    return { errors: { general: ["Du hast dich bereits angemeldet."] } };
  }

  const withPlusOne = hasPlusOne === "on";
  if (withPlusOne) {
    if (!plusOneFirstName?.trim())
      return { errors: { plusOneFirstName: ["Vorname der Begleitperson erforderlich"] } };
    if (!plusOneLastName?.trim())
      return { errors: { plusOneLastName: ["Nachname der Begleitperson erforderlich"] } };
  }

  const registration = await createRegistration({
    firstName,
    lastName,
    phone,
    plusOneFirstName: withPlusOne ? plusOneFirstName?.trim() : undefined,
    plusOneLastName:  withPlusOne ? plusOneLastName?.trim() : undefined,
  });

  redirect(`/confirm?id=${registration.id}`);
}
