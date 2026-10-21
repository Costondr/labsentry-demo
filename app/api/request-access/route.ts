import { NextRequest, NextResponse } from "next/server";
import { saveLead, markNotified } from "@/lib/leads";

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

export async function POST(req: NextRequest) {
  let email = "";
  let lab = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim();
    lab = String(body?.lab ?? "").trim();
  } catch {
    return fail(400, "invalid_request");
  }

  if (!EMAIL_RE.test(email) || email.length > 254) return fail(400, "invalid_email");
  if (!lab || lab.length > 200) return fail(400, "invalid_lab");

  const receivedAt = new Date().toISOString();

  // Structured log line: a short-lived backup record in Vercel runtime logs.
  console.log(JSON.stringify({ event: "access_request", lab, email, receivedAt }));

  // 1. Save first. A saved lead is never lost, even if the email fails.
  let leadId: string | null = null;
  try {
    leadId = await saveLead(lab, email);
  } catch (e) {
    console.error(JSON.stringify({ event: "lead_not_saved", detail: String(e), lab, email, receivedAt }));
  }

  // 2. Notify.
  const notify = await sendNotification(lab, email, receivedAt);
  if (leadId) {
    await markNotified(leadId, notify.ok ? "sent" : "failed", notify.ok ? undefined : notify.reason);
  }
  if (!notify.ok) {
    console.error(JSON.stringify({ event: "access_request_not_sent", reason: notify.reason, saved: !!leadId, lab, email, receivedAt }));
  }

  // 3. Success if the lead is stored anywhere: the database, or (degraded) your inbox.
  if (leadId || notify.ok) {
    if (!leadId) console.error(JSON.stringify({ event: "lead_degraded_email_only", lab, email, receivedAt }));
    return NextResponse.json({ ok: true });
  }
  return fail(502, "request_not_recorded");
}

async function sendNotification(
  lab: string,
  email: string,
  receivedAt: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, reason: "RESEND_API_KEY missing" };

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
        reply_to: email,
        subject: `LabSentry access request: ${lab.slice(0, 80)}`,
        html: `
          <h2>New LabSentry access request</h2>
          <p><strong>Lab:</strong> ${escapeHtml(lab)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Received:</strong> ${new Date(receivedAt).toLocaleString("en-US", { timeZone: "America/New_York" })}</p>
          <hr>
          <p>Reply directly to this email to respond to the prospect.</p>
        `,
      }),
    });
    if (!res.ok) return { ok: false, reason: `resend_${res.status}: ${(await res.text()).slice(0, 300)}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: `network: ${String(e).slice(0, 300)}` };
  }
}
