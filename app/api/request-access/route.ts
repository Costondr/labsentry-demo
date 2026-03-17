import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, lab } = await req.json();

    // Send notification to DC via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "LabSentry <noreply@costonai.com>",
        to: "Diano.C@thecostongroup.com",
        reply_to: email,
        subject: `🔔 LabSentry Demo Request — ${lab}`,
        html: `
          <h2>New Demo Request</h2>
          <p><strong>Lab:</strong> ${lab}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })}</p>
          <hr>
          <p>Reply directly to this email to respond to the prospect.</p>
        `,
        tags: [
          { name: "type", value: "demo-request" },
          { name: "lab", value: lab },
        ],
      }),
    });

    if (!res.ok) {
      console.error("Resend error:", await res.text());
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Request access error:", e);
    return NextResponse.json({ ok: true }); // don't leak errors to client
  }
}
