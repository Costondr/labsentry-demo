import { NextRequest, NextResponse } from "next/server";

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

  // Structured log line: a second record of every request, visible in Vercel
  // runtime logs even if the notification email below fails.
  console.log(JSON.stringify({ event: "access_request", lab, email, receivedAt }));

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error(JSON.stringify({ event: "access_request_not_sent", reason: "RESEND_API_KEY missing", lab, email, receivedAt }));
    return fail(503, "notification_unavailable");
  }

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

    if (!res.ok) {
      console.error(JSON.stringify({ event: "access_request_not_sent", reason: `resend_${res.status}`, detail: await res.text(), lab, email, receivedAt }));
      return fail(502, "notification_failed");
    }
  } catch (e) {
    console.error(JSON.stringify({ event: "access_request_not_sent", reason: "network", detail: String(e), lab, email, receivedAt }));
    return fail(502, "notification_failed");
  }

  return NextResponse.json({ ok: true });
}
