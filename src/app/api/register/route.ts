import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { Resend } from "resend";
import { supabaseAdmin, isDatabaseConfigured } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ameyafest.org";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, form, isTeam } = body;

    if (!event || !form || !form.name || !form.email) {
      return NextResponse.json({ error: "INPUT ERROR // Missing required registration parameters." }, { status: 400 });
    }

    // Generate unique AMEYA '26 docket tokens
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `AMEYA-2026-REG-${randomSuffix}`;
    const teamId = isTeam
      ? `TEAM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
      : `SOLO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Persist to Supabase if configured
    if (isDatabaseConfigured() && supabaseAdmin) {
      try {
        const { error: dbError } = await supabaseAdmin.from("registrations").insert({
          ticket_id: ticketId,
          event_id: String(event.id || "arena-general"),
          event_name: event.name,
          is_team: Boolean(isTeam),
          team_id: teamId,
          team_name: isTeam ? form.teamName : null,
          leader_name: form.name,
          leader_email: form.email,
          leader_phone: form.phone || null,
          college: form.college || "VVIIT Nambur",
          year: form.year || "1st Year",
          members: isTeam && Array.isArray(form.members) ? form.members : [],
          payment_status: "confirmed",
        });

        if (dbError) {
          console.error("Supabase registrations insert error:", dbError);
        }
      } catch (dbErr) {
        console.error("Supabase DB error:", dbErr);
      }
    }

    // Generate QR code pointing to official ticket verification reveal
    const ticketUrl = `${BASE_URL}/ticket/${ticketId}?teamId=${teamId}&event=${encodeURIComponent(event.name)}&name=${encodeURIComponent(form.name)}${isTeam ? `&team=${encodeURIComponent(form.teamName || "")}` : ""}`;
    const qrDataUrl = await QRCode.toDataURL(ticketUrl, {
      width: 280,
      margin: 2,
      color: { dark: "#080808", light: "#ffffff" },
    });

    // Build member list for email if team
    const memberList = isTeam && form.members && form.members.length > 0
      ? `<div style="margin-top:20px;padding:16px;background:#141414;border:1px solid rgba(255,255,255,0.08);border-radius:4px;">
          <strong style="color:#ff4d4d;font-size:12px;font-family:monospace;text-transform:uppercase;letter-spacing:0.12em;">Enrolled Squad Operatives</strong>
          <ul style="margin:10px 0 0;padding-left:18px;color:#F2EDE8;font-size:14px;line-height:1.6;">
            ${form.members.map((m: { name: string; email?: string }) => `<li>${m.name} ${m.email ? `(${m.email})` : ""}</li>`).join("")}
          </ul>
        </div>`
      : "";

    // Send email via Resend if API key is provided
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("dummy") && !process.env.RESEND_API_KEY.includes("your_")) {
      const emailRecipients = [form.email];
      if (isTeam && Array.isArray(form.members)) {
        form.members.forEach((m: { email: string }) => {
          if (m.email && !emailRecipients.includes(m.email)) emailRecipients.push(m.email);
        });
      }

      const emailHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AMEYA '26 Accreditation Docket</title>
</head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#F2EDE8;">
  <div style="max-width:620px;margin:0 auto;padding:40px 20px;">
    <!-- Brand Kicker -->
    <div style="text-align:center;margin-bottom:30px;">
      <div style="color:#E51D25;font-family:monospace;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;">
        ● IEI SAME // DEPARTMENT OF MECHANICAL ENGINEERING
      </div>
      <h1 style="color:#FFFFFF;font-size:32px;font-weight:800;margin:10px 0 6px;letter-spacing:-0.02em;">
        AMEYA &apos;26
      </h1>
      <p style="color:#96908B;font-size:13px;margin:0;">
        October 04–05, 2026 · Vasireddy Venkatadri Institute of Technology (VVIIT), Nambur
      </p>
    </div>

    <!-- Ticket Card -->
    <div style="background:#0C0C0C;border:1px solid rgba(255,255,255,0.1);border-top:3px solid #E51D25;border-radius:4px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.8);">
      <div style="padding:24px 28px;border-bottom:1px solid rgba(255,255,255,0.08);background:#101010;">
        <span style="color:#96908B;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">ACCREDITATION CONFIRMED</span>
        <h2 style="color:#FFFFFF;font-size:22px;font-weight:700;margin:6px 0 0;">${event.name}</h2>
      </div>

      <div style="padding:28px;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr>
            <td style="padding:8px 0;color:#605B56;font-family:monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">DELEGATE</td>
            <td style="padding:8px 0;color:#FFFFFF;font-size:14px;font-weight:600;text-align:right;">${form.name}</td>
          </tr>
          ${isTeam ? `<tr>
            <td style="padding:8px 0;color:#605B56;font-family:monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">TEAM MONIKER</td>
            <td style="padding:8px 0;color:#FFFFFF;font-size:14px;font-weight:600;text-align:right;">${form.teamName || "Squad"}</td>
          </tr>` : ""}
          <tr>
            <td style="padding:8px 0;color:#605B56;font-family:monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">COLLEGE / AFFILIATION</td>
            <td style="padding:8px 0;color:#FFFFFF;font-size:14px;font-weight:600;text-align:right;">${form.college} (${form.year})</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#605B56;font-family:monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">REGISTRATION ID</td>
            <td style="padding:8px 0;color:#E51D25;font-family:monospace;font-size:15px;font-weight:700;text-align:right;">${ticketId}</td>
          </tr>
        </table>

        ${memberList}

        <!-- QR Code Block -->
        <div style="margin-top:28px;padding-top:24px;border-top:1px dashed rgba(255,255,255,0.12);text-align:center;">
          <div style="background:#FFFFFF;display:inline-block;padding:12px;border-radius:4px;">
            <img src="${qrDataUrl}" alt="Check-in QR" width="160" height="160" style="display:block;" />
          </div>
          <p style="color:#96908B;font-family:monospace;font-size:11px;letter-spacing:0.1em;margin:12px 0 0;text-transform:uppercase;">
            Scan at VVITU Campus Gate for Physical Clearance
          </p>
        </div>
      </div>
    </div>

    <!-- Footer Help -->
    <p style="color:#605B56;font-size:12px;text-align:center;margin-top:30px;">
      AMEYA &apos;26 Operations Desk · Email: ieisame@vvit.net · Nambur, Guntur, AP
    </p>
  </div>
</body>
</html>
      `;

      await resend.emails.send({
        from: "AMEYA '26 <noreply@ameyafest.org>",
        to: emailRecipients,
        subject: `🎟️ AMEYA '26 Accreditation Dossier — ${event.name}`,
        html: emailHtml,
      }).catch((e) => console.error("Resend dispatch error:", e));
    }

    return NextResponse.json({ ticketId, teamId }, { status: 200 });
  } catch (err) {
    console.error("Registration route error:", err);
    return NextResponse.json({ error: "Registration transmission failed" }, { status: 500 });
  }
}
