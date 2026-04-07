import { sql } from "@vercel/postgres";

export interface Registration {
  id: number;
  first_name: string;
  last_name: string;
  klasse: string;
  plus_one_first_name: string | null;
  plus_one_last_name: string | null;
  paid: boolean;
  created_at: Date;
}

export async function createRegistration(data: {
  firstName: string;
  lastName: string;
  klasse: string;
  plusOneFirstName?: string;
  plusOneLastName?: string;
}): Promise<Registration> {
  const result = await sql<Registration>`
    INSERT INTO registrations (first_name, last_name, klasse, plus_one_first_name, plus_one_last_name)
    VALUES (
      ${data.firstName},
      ${data.lastName},
      ${data.klasse},
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
      AND LOWER(last_name) = LOWER(${lastName.trim()})
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
  await sql`
    UPDATE registrations
    SET paid = NOT paid
    WHERE id = ${id}
  `;
}

export interface Stats {
  total: number;
  plusOnes: number;
  paid: number;
}

export async function getStats(): Promise<Stats> {
  const result = await sql<{ total: string; plus_ones: string; paid: string }>`
    SELECT
      COUNT(*) AS total,
      COUNT(plus_one_first_name) AS plus_ones,
      COUNT(*) FILTER (WHERE paid = TRUE) AS paid
    FROM registrations
  `;
  const row = result.rows[0];
  return {
    total: parseInt(row.total, 10),
    plusOnes: parseInt(row.plus_ones, 10),
    paid: parseInt(row.paid, 10),
  };
}
