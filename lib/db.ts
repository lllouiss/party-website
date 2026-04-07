import { sql } from "@vercel/postgres";

export interface Registration {
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  plus_one_first_name: string | null;
  plus_one_last_name: string | null;
  paid: boolean;
  plus_one_paid: boolean;
  created_at: Date;
}

export interface GuestlistEntry {
  id: number;
  full_name: string;
}

export interface Stats {
  total: number;
  plusOnes: number;
  paid: number;
  plusOnePaid: number;
}

// ── Registrations ──────────────────────────────────────────

export async function createRegistration(data: {
  firstName: string;
  lastName: string;
  phone: string;
  plusOneFirstName?: string;
  plusOneLastName?: string;
}): Promise<Registration> {
  const result = await sql<Registration>`
    INSERT INTO registrations
      (first_name, last_name, phone, plus_one_first_name, plus_one_last_name)
    VALUES (
      ${data.firstName},
      ${data.lastName},
      ${data.phone},
      ${data.plusOneFirstName ?? null},
      ${data.plusOneLastName ?? null}
    )
    RETURNING *
  `;
  return result.rows[0];
}

export async function getRegistrationById(id: number): Promise<Registration | null> {
  const result = await sql<Registration>`
    SELECT * FROM registrations WHERE id = ${id}
  `;
  return result.rows[0] ?? null;
}

export async function isAlreadyRegistered(
  firstName: string,
  lastName: string
): Promise<boolean> {
  const result = await sql`
    SELECT 1 FROM registrations
    WHERE LOWER(first_name) = LOWER(${firstName.trim()})
      AND LOWER(last_name)  = LOWER(${lastName.trim()})
    LIMIT 1
  `;
  return result.rows.length > 0;
}

export async function getAllRegistrations(): Promise<Registration[]> {
  const result = await sql<Registration>`
    SELECT * FROM registrations ORDER BY created_at DESC
  `;
  return result.rows;
}

export async function togglePaid(id: number): Promise<void> {
  await sql`UPDATE registrations SET paid = NOT paid WHERE id = ${id}`;
}

export async function togglePlusOnePaid(id: number): Promise<void> {
  await sql`UPDATE registrations SET plus_one_paid = NOT plus_one_paid WHERE id = ${id}`;
}

export async function getStats(): Promise<Stats> {
  const result = await sql<{
    total: string;
    plus_ones: string;
    paid: string;
    plus_one_paid: string;
  }>`
    SELECT
      COUNT(*)                                    AS total,
      COUNT(plus_one_first_name)                  AS plus_ones,
      COUNT(*) FILTER (WHERE paid = TRUE)         AS paid,
      COUNT(*) FILTER (WHERE plus_one_paid = TRUE
                         AND plus_one_first_name IS NOT NULL) AS plus_one_paid
    FROM registrations
  `;
  const row = result.rows[0];
  return {
    total:      parseInt(row.total, 10),
    plusOnes:   parseInt(row.plus_ones, 10),
    paid:       parseInt(row.paid, 10),
    plusOnePaid: parseInt(row.plus_one_paid, 10),
  };
}

// ── Guestlist ──────────────────────────────────────────────

export async function getGuestlist(): Promise<GuestlistEntry[]> {
  const result = await sql<GuestlistEntry>`
    SELECT * FROM guestlist ORDER BY full_name ASC
  `;
  return result.rows;
}

export async function isOnGuestlistDb(
  firstName: string,
  lastName: string
): Promise<boolean> {
  const fullName = `${firstName.trim()} ${lastName.trim()}`.toLowerCase();
  const result = await sql`
    SELECT 1 FROM guestlist
    WHERE LOWER(full_name) = ${fullName}
    LIMIT 1
  `;
  return result.rows.length > 0;
}

export async function addToGuestlist(fullName: string): Promise<void> {
  await sql`
    INSERT INTO guestlist (full_name)
    VALUES (${fullName.trim().toLowerCase()})
    ON CONFLICT DO NOTHING
  `;
}

export async function removeFromGuestlist(id: number): Promise<void> {
  await sql`DELETE FROM guestlist WHERE id = ${id}`;
}
