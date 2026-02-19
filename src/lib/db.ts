import { sql } from "@vercel/postgres";

export async function ensureDemoRequestsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS demo_requests (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      employees TEXT,
      source TEXT DEFAULT 'pse-marketing',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}
