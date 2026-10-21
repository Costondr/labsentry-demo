import { neon } from "@neondatabase/serverless";

// Leads are saved to Postgres (Neon, connected through Vercel) before any
// notification email is sent, so a failed email never loses a request.
// Preview deployments get their own Neon branch, so test leads never reach
// the production database.

let schemaReady: Promise<void> | null = null;

function db() {
  // The Vercel–Neon connection for this project uses the "leads_" prefix.
  const url =
    process.env.leads_DATABASE_URL ??
    process.env.leads_POSTGRES_URL ??
    process.env.DATABASE_URL;
  if (!url) throw new Error("leads_DATABASE_URL missing");
  return neon(url);
}

// Idempotent, non-destructive migration: creates the table on a fresh branch
// and adds the discovery-stage columns to an existing one. No existing row or
// column is removed. `lab` (v1 field) becomes optional; v1 rows keep it.
async function ensureSchema(sql: ReturnType<typeof db>) {
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at    timestamptz NOT NULL DEFAULT now(),
          lab           text,
          email         text NOT NULL,
          environment   text NOT NULL,
          notify_status text NOT NULL DEFAULT 'pending',
          notify_error  text
        )`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS name text`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS company text`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS role text`;
      await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS analyzers text`;
      await sql`ALTER TABLE leads ALTER COLUMN lab DROP NOT NULL`;
    })().catch((e) => {
      schemaReady = null; // retry on the next request
      throw e;
    });
  }
  return schemaReady;
}

export type Lead = {
  name: string;
  company: string;
  role: string;
  email: string;
  analyzers: string | null;
};

/** Saves a lead and returns its id. Throws if the database is unavailable. */
export async function saveLead(lead: Lead): Promise<string> {
  const sql = db();
  await ensureSchema(sql);
  const environment = process.env.VERCEL_ENV ?? "development";
  const rows = (await sql`
    INSERT INTO leads (name, company, role, email, analyzers, environment)
    VALUES (${lead.name}, ${lead.company}, ${lead.role}, ${lead.email}, ${lead.analyzers}, ${environment})
    RETURNING id`) as { id: string }[];
  return rows[0].id;
}

/** Records whether the notification email for a lead was sent. Never throws. */
export async function markNotified(id: string, status: "sent" | "failed", error?: string) {
  try {
    const sql = db();
    await sql`
      UPDATE leads SET notify_status = ${status}, notify_error = ${error ?? null}
      WHERE id = ${id}`;
  } catch (e) {
    console.error(JSON.stringify({ event: "lead_status_update_failed", id, detail: String(e) }));
  }
}
