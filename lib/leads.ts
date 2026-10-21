import { neon } from "@neondatabase/serverless";

// Leads are saved to Postgres (Neon, connected through Vercel) before any
// notification email is sent, so a failed email never loses a request.

let tableReady: Promise<void> | null = null;

function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL missing");
  return neon(url);
}

async function ensureTable(sql: ReturnType<typeof db>) {
  if (!tableReady) {
    tableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          created_at    timestamptz NOT NULL DEFAULT now(),
          lab           text NOT NULL,
          email         text NOT NULL,
          environment   text NOT NULL,
          notify_status text NOT NULL DEFAULT 'pending',
          notify_error  text
        )`;
    })().catch((e) => {
      tableReady = null; // retry on the next request
      throw e;
    });
  }
  return tableReady;
}

/** Saves a lead and returns its id. Throws if the database is unavailable. */
export async function saveLead(lab: string, email: string): Promise<string> {
  const sql = db();
  await ensureTable(sql);
  const environment = process.env.VERCEL_ENV ?? "development";
  const rows = (await sql`
    INSERT INTO leads (lab, email, environment)
    VALUES (${lab}, ${email}, ${environment})
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
