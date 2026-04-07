// Gästeliste — Vorname Nachname, case-insensitive verglichen
// Format: "vorname nachname" (alles lowercase wird verglichen)
export const GUESTLIST: string[] = [
  "anna müller",
  "ben schneider",
  "clara hoffmann",
  "david weber",
  "emma fischer",
  "felix schmidt",
  "greta bauer",
  "hans zimmermann",
  "ida braun",
  "jonas krause",
  "katharina wolf",
  "lukas richter",
  "marie neumann",
  "niklas lange",
  "olivia walter",
  "paul schulz",
  "quinn lehmann",
  "rosa köhler",
  "simon wagner",
  "tina meyer",
  // → Weitere Namen hier einfügen
];

export function isOnGuestlist(firstName: string, lastName: string): boolean {
  const fullName = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
  return GUESTLIST.some((entry) => entry.toLowerCase() === fullName);
}
