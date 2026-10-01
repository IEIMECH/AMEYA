import nodemailer, { type SendMailOptions } from "nodemailer";
import { Resend } from "resend";

interface TicketEmailParams {
  email: string;
  name: string;
  ticketId: string;
  eventName: string;
  day: number;
  category: string;
  branch: string;
  collegeRollNumber: string;
  ticketUrl: string;
}

interface SendEmailResult {
  success: boolean;
  provider: "smtp" | "resend" | "none";
  messageId?: string;
  error?: string;
}

function getSmtpTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

function buildEmailHtml(params: {
  name: string;
  ticketId: string;
  eventName: string;
  day: number;
  category: string;
  branch: string;
  collegeRollNumber: string;
  ticketUrl: string;
}) {
  const { name, ticketId, eventName, day, category, branch, collegeRollNumber, ticketUrl } = params;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AMEYA '26 Registration Confirmation - ${eventName}</title>
</head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#F2EDE8;">
  <div style="max-width:620px;margin:0 auto;padding:40px 16px;">
    
    <!-- Festival Masthead -->
    <div style="text-align:center;margin-bottom:24px;">
      <div style="color:#E51D25;font-family:monospace;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;">
        IEI SAME // DEPARTMENT OF MECHANICAL ENGINEERING
      </div>
      <h1 style="color:#FFFFFF;font-size:32px;font-weight:900;letter-spacing:0.04em;margin:10px 0 6px;">
        AMEYA &apos;26
      </h1>
      <p style="color:#96908B;font-size:13px;margin:0;letter-spacing:0.02em;">
        October 08–09, 2026 • Vasireddy Venkatadri Institute of Technology, Nambur
      </p>
    </div>

    <!-- Main Container Card -->
    <div style="background:#0C0C0C;border:1px solid rgba(255,255,255,0.12);border-top:3px solid #E51D25;border-radius:6px;overflow:hidden;box-shadow:0 16px 40px rgba(0,0,0,0.7);">
      
      <!-- Status Header -->
      <div style="padding:20px 26px;border-bottom:1px solid rgba(255,255,255,0.08);background:#111111;">
        <span style="display:inline-block;background:rgba(16,185,129,0.15);color:#10B981;border:1px solid rgba(16,185,129,0.3);padding:3px 10px;border-radius:3px;font-family:monospace;font-size:11px;letter-spacing:0.14em;font-weight:700;text-transform:uppercase;">
          &#10003; REGISTRATION SUCCESSFUL
        </span>
        <h2 style="color:#FFFFFF;font-size:22px;font-weight:800;margin:10px 0 3px;">
          ${eventName}
        </h2>
        <span style="color:#96908B;font-family:monospace;font-size:12px;letter-spacing:0.06em;">
          DAY 0${day} // ${category.toUpperCase()} COMPETITION
        </span>
      </div>

      <!-- Participant Message Draft -->
      <div style="padding:24px 26px;border-bottom:1px solid rgba(255,255,255,0.08);background:#0E0E0E;line-height:1.65;">
        <p style="margin:0 0 10px;font-size:16px;color:#FFFFFF;font-weight:700;">
          Dear ${name},
        </p>
        <p style="margin:0 0 12px;color:#D5D0CB;font-size:14px;">
          Greetings from <strong style="color:#FFFFFF;">Team IEI SAME</strong>! We are delighted to inform you that your registration for <strong style="color:#FFFFFF;">${eventName}</strong> at <strong style="color:#E51D25;">AMEYA &apos;26</strong> is <strong style="color:#10B981;">successful</strong>.
        </p>
        <p style="margin:0 0 12px;color:#D5D0CB;font-size:14px;">
          Get ready to showcase your technical skills and compete with participants from across the region. Please ensure you report to the campus registration desks on the morning of your scheduled event.
        </p>
        <p style="margin:0;color:#96908B;font-size:13px;">
          Your unique Registration ID is <strong style="color:#E51D25;font-family:monospace;font-size:14px;">${ticketId}</strong>. Please present this ticket ID along with your College ID card upon arrival for instant check-in.
        </p>
      </div>

      <!-- Ticket Data Breakdown -->
      <div style="padding:24px 26px;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
          <tr>
            <td style="padding:8px 0;color:#78726D;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">PARTICIPANT</td>
            <td style="padding:8px 0;color:#FFFFFF;font-size:14px;font-weight:700;text-align:right;">${name}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:8px 0;color:#78726D;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">BRANCH</td>
            <td style="padding:8px 0;color:#FFFFFF;font-size:14px;font-weight:600;text-align:right;">${branch}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:8px 0;color:#78726D;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">COLLEGE ROLL NO</td>
            <td style="padding:8px 0;color:#FFFFFF;font-size:14px;font-weight:700;text-align:right;font-family:monospace;">${collegeRollNumber}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:8px 0;color:#78726D;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">EVENT NAME</td>
            <td style="padding:8px 0;color:#FFFFFF;font-size:14px;font-weight:600;text-align:right;">${eventName}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:8px 0;color:#78726D;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">TICKET ID</td>
            <td style="padding:8px 0;color:#E51D25;font-family:monospace;font-size:15px;font-weight:800;text-align:right;">${ticketId}</td>
          </tr>
        </table>

        <!-- Pass View Link Button -->
        <div style="text-align:center;margin:22px 0 26px;">
          <a href="${ticketUrl}" style="display:inline-block;background:#E51D25;color:#FFFFFF;font-family:monospace;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;padding:12px 28px;border-radius:3px;">
            VIEW REGISTRATION PASS ONLINE &rarr;
          </a>
        </div>

        <!-- Student Points of Contact (POCs) Panel -->
        <div style="background:#121212;border:1px solid rgba(255,255,255,0.08);border-left:3px solid #E51D25;border-radius:4px;padding:18px 20px;margin-bottom:22px;">
          <div style="color:#E51D25;font-family:monospace;font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;margin-bottom:12px;">
            &#9742; STUDENT POINTS OF CONTACT (POCs)
          </div>
          
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr>
              <td style="padding:6px 0;color:#8E8882;font-family:monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;vertical-align:top;width:42%;">FOR ANY QUERIES</td>
              <td style="padding:6px 0;color:#FFFFFF;vertical-align:top;">
                <div style="margin-bottom:4px;">
                  <span style="font-weight:600;">S. Sai Kumar:</span>
                  <a href="tel:+917732014762" style="color:#E51D25;text-decoration:none;font-weight:700;font-family:monospace;margin-left:4px;">+91 77320 14762</a>
                </div>
                <div>
                  <span style="font-weight:600;">S. Sameer Basha:</span>
                  <a href="tel:+919676419146" style="color:#E51D25;text-decoration:none;font-weight:700;font-family:monospace;margin-left:4px;">+91 96764 19146</a>
                </div>
              </td>
            </tr>
            <tr style="border-top:1px solid rgba(255,255,255,0.05);">
              <td style="padding:6px 0;color:#8E8882;font-family:monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;vertical-align:top;">EVENTS COORDINATOR</td>
              <td style="padding:6px 0;color:#FFFFFF;vertical-align:top;">
                <span style="font-weight:600;">T. Jaya Kumar:</span>
                <a href="tel:+917416532304" style="color:#E51D25;text-decoration:none;font-weight:700;font-family:monospace;margin-left:4px;">+91 74165 32304</a>
              </td>
            </tr>
            <tr style="border-top:1px solid rgba(255,255,255,0.05);">
              <td style="padding:6px 0;color:#8E8882;font-family:monospace;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;vertical-align:top;">TRANSPORT &amp; HOSPITALITY</td>
              <td style="padding:6px 0;color:#FFFFFF;vertical-align:top;">
                <span style="font-weight:600;">S. Durga Sai Ram:</span>
                <a href="tel:+919392458746" style="color:#E51D25;text-decoration:none;font-weight:700;font-family:monospace;margin-left:4px;">+91 93924 58746</a>
              </td>
            </tr>
          </table>
        </div>

        <!-- Sign-Off Section -->
        <div style="padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);text-align:left;">
          <p style="color:#A8A29E;font-size:13px;line-height:1.5;margin:0 0 4px;">
            Warm regards &amp; best of luck,
          </p>
          <p style="color:#FFFFFF;font-size:16px;font-weight:800;letter-spacing:0.04em;margin:0 0 4px;">
            Team - IEI SAME
          </p>
          <p style="color:#78726D;font-size:12px;margin:0;line-height:1.4;">
            Department of Mechanical Engineering<br>
            Vasireddy Venkatadri Institute of Technology (VVIT)<br>
            NH-16, Nambur, Guntur, Andhra Pradesh &ndash; 522508
          </p>
        </div>

      </div>
    </div>

    <!-- Footer Note -->
    <div style="text-align:center;margin-top:28px;">
      <p style="color:#605B56;font-size:12px;margin:0 0 4px;">
        AMEYA '26 • National Level Technical Symposium
      </p>
      <p style="color:#45413E;font-size:11px;margin:0;">
        Have questions? Feel free to contact our student coordinators or reply directly to this email.
      </p>
    </div>

  </div>
</body>
</html>`;
}

function buildEmailText(params: {
  name: string;
  ticketId: string;
  eventName: string;
  day: number;
  category: string;
  branch: string;
  collegeRollNumber: string;
  ticketUrl: string;
}) {
  const { name, ticketId, eventName, day, category, branch, collegeRollNumber, ticketUrl } = params;

  return `Dear ${name},

Greetings from Team IEI SAME!

We are pleased to inform you that your registration for ${eventName} at AMEYA '26 has been successfully confirmed.

REGISTRATION & TICKET DETAILS:
--------------------------------------------------
Participant: ${name}
Branch: ${branch}
College Roll No: ${collegeRollNumber}
Event Name: ${eventName}
Day & Category: Day 0${day} // ${category}
Registration Ticket ID: ${ticketId}

VIEW YOUR REGISTRATION PASS ONLINE:
${ticketUrl}

VENUE & REPORTING INSTRUCTIONS:
- Dates: October 08–09, 2026
- Venue: Department of Mechanical Engineering, Vasireddy Venkatadri Institute of Technology (VVIT), Nambur, Guntur
- Please present this Registration Ticket ID (${ticketId}) or your College ID card at the registration desk upon your arrival.

STUDENT POINTS OF CONTACT (POCs):
--------------------------------------------------
For Any Queries:
  - S. Sai Kumar: +91 77320 14762
  - S. Sameer Basha: +91 96764 19146

Events Coordinator:
  - T. Jaya Kumar: +91 74165 32304

Transport & Hospitality:
  - S. Durga Sai Ram: +91 93924 58746

Warm regards & best of luck,
Team - IEI SAME
Department of Mechanical Engineering
Vasireddy Venkatadri Institute of Technology (VVIT)
NH-16, Nambur, Guntur, Andhra Pradesh – 522508
`;
}

export async function sendTicketEmail(params: TicketEmailParams): Promise<SendEmailResult> {
  const { email, name, ticketId, eventName, day, category, branch, collegeRollNumber, ticketUrl } = params;

  const htmlContent = buildEmailHtml({
    name,
    ticketId,
    eventName,
    day,
    category,
    branch,
    collegeRollNumber,
    ticketUrl,
  });

  const textContent = buildEmailText({
    name,
    ticketId,
    eventName,
    day,
    category,
    branch,
    collegeRollNumber,
    ticketUrl,
  });

  const subject = `AMEYA '26 Registration Confirmed - ${eventName} [${ticketId}]`;

  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const fromAddress = process.env.SMTP_FROM || `"AMEYA '26" <${process.env.SMTP_USER}>`;

      const mailOptions: SendMailOptions = {
        from: fromAddress,
        to: email,
        subject,
        text: textContent,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email:SMTP] Successfully sent confirmation email to ${email} (MessageId: ${info.messageId})`);
      return { success: true, provider: "smtp", messageId: info.messageId };
    } catch (smtpErr: any) {
      console.error("[Email:SMTP] Failed to send via SMTP:", smtpErr);
    }
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && !resendApiKey.includes("dummy") && !resendApiKey.includes("your_")) {
    try {
      const resend = new Resend(resendApiKey);
      const resendFrom = process.env.RESEND_FROM_EMAIL || "AMEYA '26 <onboarding@resend.dev>";

      const resendResult = await resend.emails.send({
        from: resendFrom,
        to: [email],
        subject,
        text: textContent,
        html: htmlContent,
      });

      if (resendResult.error) {
        console.error("[Email:Resend] Dispatch failed:", resendResult.error);
        return { success: false, provider: "resend", error: resendResult.error.message };
      }

      console.log(`[Email:Resend] Sent confirmation email to ${email}`);
      return { success: true, provider: "resend", messageId: resendResult.data?.id };
    } catch (resendErr: any) {
      console.error("[Email:Resend] Caught error:", resendErr);
      return { success: false, provider: "resend", error: resendErr.message };
    }
  }

  return { success: false, provider: "none", error: "No email provider configured" };
}
