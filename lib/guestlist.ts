// Gästeliste — Vorname Nachname, case-insensitive verglichen
// Format: "vorname nachname" (alles lowercase wird verglichen)
export const GUESTLIST: string[] = [
  "louis wenk",
  "janik muntwyler",
];

export function isOnGuestlist(firstName: string, lastName: string): boolean {
  const fullName = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
  return GUESTLIST.some((entry) => entry.toLowerCase() === fullName);
}
