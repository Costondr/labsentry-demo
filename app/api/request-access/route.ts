import { NextRequest, NextResponse } from "next/server";
import { saveLead, markNotified, type Lead } from "@/lib/leads";

const NOTIFY_TO = "Diano.C@thecostongroup.com";
const NOTIFY_FROM = "LabSentry <noreply@costonai.com>";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fail(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

/** Trimmed string from the body, or "" when missing. */
function field(body: Record<string, unknown>, key: string): string {
  const v = body?.[key];
  return typeof v === "string" ? v.trim() : "";
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, "invalid_request");
  }

  const name = field(body, "name");
  const company = field(body, "company");
  const role = field(body, "role");
  const email = field(body, "email");
  const analyzersRaw = field(body, "analyzers");

  if (!EMAIL_RE.test(email) || email.length > 254) return fail(400, "invalid_email");
  if (!name || name.length > 120 || !company || company.length > 200 || !role || role.length > 120 || analyzersRaw.length > 500) {
    return fail(400, "invalid_fields");
  }

  const lead: Lead = { name, company, role, email, analyzers: analyzersRaw || null };
  const receivedAt = new Date().toISOString();

  // Structured log line: a short-lived backup record in Vercel runtime logs.
  console.log(JSON.stringify({ event: "access_request", ...lead, receivedAt }));

  // 1. Save first. A saved lead is never lost, even if the email fails.
  let leadId: string | null = null;
  try {
    leadId = await saveLead(lead);
  } catch (e) {
    console.error(JSON.stringify({ event: "lead_not_saved", detail: String(e), ...lead, receivedAt }));
  }

  // 2. Notify.
  const notify = await sendNotification(lead, receivedAt);
  if (leadId) {
    await markNotified(leadId, notify.ok ? "sent" : "failed", notify.ok ? undefined : notify.reason);
  }
  if (!notify.ok) {
    console.error(JSON.stringify({ event: "access_request_not_sent", reason: notify.reason, saved: !!leadId, ...lead, receivedAt }));
  }

  // 3. Success if the lead is stored anywhere: the database, or (degraded) your inbox.
  if (leadId || notify.ok) {
    if (!leadId) console.error(JSON.stringify({ event: "lead_degraded_email_only", ...lead, receivedAt }));
    return NextResponse.json({ ok: true });
  }
  return fail(502, "request_not_recorded");
}

async function sendNotification(
  lead: Lead,
  receivedAt: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY missing" };

  const row = (label: string, value: string) =>
    `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: NOTIFY_TO,
        reply_to: lead.email,
        subject: `LabSentry conversation request: ${lead.name.slice(0, 60)}, ${lead.company.slice(0, 60)}`,
        html: `
          <h2>New LabSentry conversation request</h2>
          ${row("Name", lead.name)}
          ${row("Company", lead.company)}
          ${row("Role", lead.role)}
          ${row("Email", lead.email)}
          ${row("Analyzers serviced", lead.analyzers ?? "Not given")}
          <p><strong>Received:</strong> ${new Date(receivedAt).toLocaleString("en-US", { timeZone: "America/New_York" })}</p>
          <hr>
          <p>Reply directly to this email to respond.</p>
        `,
      }),
    });
    if (!res.ok) return { ok: false, reason: `resend_${res.status}: ${(await res.text()).slice(0, 300)}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: `network: ${String(e).slice(0, 300)}` };
  }
}
