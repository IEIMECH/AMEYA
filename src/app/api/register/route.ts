import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { Resend } from "resend";
import { supabaseAdmin, isDatabaseConfigured, getEventTableName } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy");
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ameyafest.org";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, form, isTeam } = body;

    if (!event || !form || !form.name || !form.email) {
      return NextResponse.json({ error: "INPUT ERROR // Missing required registration parameters." }, { status: 400 });
    }

    const eventId = String(event.id || "general");
    const isVisitor = eventId === "visitor-pass" || eventId === "visitor";

    // Generate unique AMEYA '26 docket tokens
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const eventPrefix = isVisitor
      ? "VISIT"
      : eventId.substring(0, 4).toUpperCase();
    const ticketId = `AMEYA-2026-${eventPrefix}-${randomSuffix}`;
    const teamId = isVisitor
      ? `VIS-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
      : isTeam
      ? `TEAM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`
      : `SOLO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Target dedicated table in Supabase
    const targetTable = getEventTableName(eventId);

    // Persist to Supabase if configured
    if (isDatabaseConfigured() && supabaseAdmin) {
      try {
        let insertPayload: Record<string, any> = {
          ticket_id: ticketId,
          payment_status: isVisitor ? "free" : "confirmed",
        };

        if (isVisitor) {
          insertPayload = {
            ...insertPayload,
            visitor_id: teamId,
            full_name: form.name,
            email: form.email,
            phone: form.phone || "N/A",
            college: form.college || "Visitor / Guest",
            year: form.year || "General Delegate",
            attending_days: form.attendingDays || "Both Days (Oct 04–05)",
            areas_of_interest: form.areasOfInterest || ["Keynote Lectures", "Robotics Arena Spectator", "Project Expo"],
            purpose_of_visit: form.purposeOfVisit || null,
          };
        } else {
          // Standard Event Registration Base
          insertPayload = {
            ...insertPayload,
            team_id: teamId,
            leader_name: form.name,
            leader_email: form.email,
            leader_phone: form.phone || "N/A",
            college: form.college || "VVIIT Nambur",
            year: form.year || "1st Year",
          };

          // Tailored Event-Specific Attributes
          switch (eventId) {
            case "hackathon":
              insertPayload.team_name = form.teamName || "HackSprint Squad";
              insertPayload.members = isTeam && Array.isArray(form.members) ? form.members : [];
              insertPayload.domain_track = form.domainTrack || "Automation & Robotics";
              insertPayload.project_title = form.projectTitle || null;
              insertPayload.proposal_synopsis = form.proposalSynopsis || null;
              insertPayload.hardware_requirements = form.hardwareRequirements || null;
              break;

            case "paper-presentation":
              insertPayload.team_name = form.teamName || null;
              insertPayload.members = isTeam && Array.isArray(form.members) ? form.members : [];
              insertPayload.paper_title = form.paperTitle || `${form.name} Research Paper`;
              insertPayload.research_track = form.researchTrack || "Machine Design & Dynamics";
              insertPayload.abstract_text = form.abstractText || null;
              insertPayload.drive_link = form.driveLink || null;
              break;

            case "cad-design":
              insertPayload.software_preference = form.softwarePreference || "SolidWorks";
              insertPayload.experience_level = form.experienceLevel || "Intermediate";
              insertPayload.bringing_own_laptop = Boolean(form.bringingOwnLaptop ?? true);
              break;

            case "robo-race":
              insertPayload.team_name = form.teamName || "Bot Combatants";
              insertPayload.members = isTeam && Array.isArray(form.members) ? form.members : [];
              insertPayload.bot_name = form.botName || "Kinetic Striker";
              insertPayload.weight_category = form.weightCategory || "Featherweight <15kg";
              insertPayload.drive_system = form.driveSystem || "4WD";
              insertPayload.weapon_mechanism = form.weaponMechanism || "Spinner";
              insertPayload.frequency_band = form.frequencyBand || "2.4GHz Spread Spectrum";
              break;

            case "circuit-debug":
              insertPayload.preferred_controller = form.preferredController || "Arduino / AVR";
              insertPayload.lab_experience = form.labExperience || "Academic Coursework";
              break;

            case "quiz":
              insertPayload.team_name = form.teamName || "Brainiac Duo";
              insertPayload.members = isTeam && Array.isArray(form.members) ? form.members : [];
              break;

            case "treasure-hunt":
              insertPayload.team_name = form.teamName || "Gear Hunters";
              insertPayload.members = isTeam && Array.isArray(form.members) ? form.members : [];
              insertPayload.emergency_contact = form.emergencyContact || null;
              break;

            case "photography":
              insertPayload.device_type = form.deviceType || "DSLR / Mirrorless";
              insertPayload.camera_model = form.cameraModel || null;
              insertPayload.portfolio_link = form.portfolioLink || null;
              break;

            case "debate":
              insertPayload.topic_preference = form.topicPreference || "Autonomous Manufacturing";
              insertPayload.prior_debate_experience = form.priorDebateExperience || "First Time";
              break;

            default:
              // Fallback
              insertPayload.event_id = eventId;
              insertPayload.event_name = event.name;
              insertPayload.is_team = Boolean(isTeam);
              insertPayload.team_name = form.teamName || null;
              insertPayload.members = isTeam && Array.isArray(form.members) ? form.members : [];
              break;
          }
        }

        // Insert into dedicated table
        const { error: dbError } = await supabaseAdmin.from(targetTable).insert(insertPayload);
        if (dbError) {
          console.error(`Supabase ${targetTable} insert error:`, dbError);
          // If specific table fails (e.g. not migrated yet), fallback to general registrations table
          if (targetTable !== "registrations") {
            try {
              await supabaseAdmin.from("registrations").insert({
              ticket_id: ticketId,
              event_id: eventId,
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
            } catch (fallbackErr) {
              console.error('Fallback insert error:', fallbackErr);
            }
          }
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
            <td style="padding:8px 0;color:#605B56;font-family:monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">${isVisitor ? "VISITOR" : "DELEGATE"}</td>
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
            <td style="padding:8px 0;color:#605B56;font-family:monospace;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;">TICKET TOKEN</td>
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

    return NextResponse.json({ ticketId, teamId, targetTable }, { status: 200 });
  } catch (err) {
    console.error("Registration route error:", err);
    return NextResponse.json({ error: "Registration transmission failed" }, { status: 500 });
  }
}
