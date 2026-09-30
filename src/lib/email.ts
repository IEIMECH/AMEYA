import nodemailer, { type SendMailOptions } from "nodemailer";
import QRCode from "qrcode";
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
  hasCidQr: boolean;
  base64Qr?: string;
}) {
  const { name, ticketId, eventName, day, category, branch, collegeRollNumber, ticketUrl, hasCidQr, base64Qr } = params;
  const qrSrc = hasCidQr ? "cid:ticketqr" : (base64Qr || "");

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AMEYA '26 Accreditation Clearance Docket</title>
</head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#F2EDE8;">
  <div style="max-width:620px;margin:0 auto;padding:40px 16px;">
    
    <div style="text-align:center;margin-bottom:28px;">
      <div style="color:#E51D25;font-family:monospace;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
        IEI SAME // DEPARTMENT OF MECHANICAL ENGINEERING
      </div>
      <h1 style="color:#FFFFFF;font-size:32px;font-weight:900;letter-spacing:0.04em;margin:10px 0 6px;">
        AMEYA &apos;26
      </h1>
      <p style="color:#96908B;font-size:13px;margin:0;letter-spacing:0.02em;">
        October 08–09, 2026 • Vasireddy Venkatadri Institute of Technology, Nambur
      </p>
    </div>

    <div style="background:#0C0C0C;border:1px solid rgba(255,255,255,0.12);border-top:3px solid #E51D25;border-radius:4px;overflow:hidden;box-shadow:0 12px 36px rgba(0,0,0,0.6);">
      
      <div style="padding:22px 26px;border-bottom:1px solid rgba(255,255,255,0.08);background:#111111;">
        <span style="color:#E51D25;font-family:monospace;font-size:11px;letter-spacing:0.14em;font-weight:700;text-transform:uppercase;">
          OFFICIAL CLEARANCE PASS // CONFIRMED
        </span>
        <h2 style="color:#FFFFFF;font-size:22px;font-weight:800;margin:6px 0 2px;">
          ${eventName}
        </h2>
        <span style="color:#96908B;font-family:monospace;font-size:12px;letter-spacing:0.06em;">
          DAY 0${day} // ${category.toUpperCase()} COMPETITION (SOLO)
        </span>
      </div>

      <div style="padding:26px;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <tr>
            <td style="padding:9px 0;color:#78726D;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">PARTICIPANT</td>
            <td style="padding:9px 0;color:#FFFFFF;font-size:14px;font-weight:700;text-align:right;">${name}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:9px 0;color:#78726D;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">BRANCH</td>
            <td style="padding:9px 0;color:#FFFFFF;font-size:14px;font-weight:600;text-align:right;">${branch}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:9px 0;color:#78726D;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">COLLEGE ROLL NO</td>
            <td style="padding:9px 0;color:#FFFFFF;font-size:14px;font-weight:700;text-align:right;font-family:monospace;">${collegeRollNumber}</td>
          </tr>
          <tr style="border-top:1px solid rgba(255,255,255,0.05);">
            <td style="padding:9px 0;color:#78726D;font-family:monospace;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">CLEARANCE TOKEN</td>
            <td style="padding:9px 0;color:#E51D25;font-family:monospace;font-size:15px;font-weight:800;text-align:right;">${ticketId}</td>
          </tr>
        </table>

        ${qrSrc ? `
        <div style="margin-top:24px;padding-top:22px;border-top:1px dashed rgba(255,255,255,0.15);text-align:center;">
          <div style="background:#FFFFFF;display:inline-block;padding:12px;border-radius:4px;box-shadow:0 4px 16px rgba(0,0,0,0.4);">
            <img src="${qrSrc}" alt="AMEYA 26 Entry QR Code" width="180" height="180" style="display:block;border:0;" />
          </div>
          <p style="color:#96908B;font-family:monospace;font-size:11px;letter-spacing:0.12em;margin:14px 0 4px;text-transform:uppercase;font-weight:600;">
            SCAN FOR PHYSICAL GATE ACCESS &amp; LAB VERIFICATION
          </p>
          <p style="color:#605B56;font-size:12px;margin:0;">
            (Save this email or image to your gallery for offline gate entry)
          </p>
        </div>` : ""}

        <div style="margin-top:28px;text-align:center;">
          <a href="${ticketUrl}" style="display:inline-block;background:#E51D25;color:#FFFFFF;font-family:monospace;font-size:12px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;text-decoration:none;padding:13px 28px;border-radius:2px;">
            VIEW ACCREDITATION PASS ONLINE →
          </a>
        </div>
      </div>
    </div>

    <div style="text-align:center;margin-top:32px;">
      <p style="color:#605B56;font-size:12px;margin:0 0 6px;">
        Vasireddy Venkatadri Institute of Technology (VVIT) • Nambur, Guntur, AP
      </p>
      <p style="color:#45413E;font-size:11px;margin:0;">
        Have questions about your event? Reply directly to this email for assistance.
      </p>
    </div>

  </div>
</body>
</html>
  `;
}

export async function sendTicketEmail(params: TicketEmailParams): Promise<SendEmailResult> {
  const { email, name, ticketId, eventName, day, category, branch, collegeRollNumber, ticketUrl } = params;

  let qrPngBuffer: Buffer | null = null;
  let qrDataUrl: string = "";

  try {
    qrPngBuffer = await QRCode.toBuffer(ticketUrl, {
      width: 320,
      margin: 2,
      color: { dark: "#050505", light: "#ffffff" },
    });
    qrDataUrl = await QRCode.toDataURL(ticketUrl, {
      width: 320,
      margin: 2,
      color: { dark: "#050505", light: "#ffffff" },
    });
  } catch (qrErr) {
    console.error("[Email] QR Code generation error:", qrErr);
  }

  const transporter = getSmtpTransporter();
  if (transporter) {
    try {
      const fromAddress = process.env.SMTP_FROM || `"AMEYA '26" <${process.env.SMTP_USER}>`;

      const mailOptions: SendMailOptions = {
        from: fromAddress,
        to: email,
        subject: `🎫 AMEYA '26 Entry Pass — ${eventName} [${ticketId}]`,
        html: buildEmailHtml({
          name,
          ticketId,
          eventName,
          day,
          category,
          branch,
          collegeRollNumber,
          ticketUrl,
          hasCidQr: !!qrPngBuffer,
          base64Qr: qrDataUrl,
        }),
        attachments: qrPngBuffer
          ? [
              {
                filename: `ameya-ticket-${ticketId}.png`,
                content: qrPngBuffer,
                cid: "ticketqr",
              },
            ]
          : [],
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[Email:SMTP] Successfully sent ticket to ${email} (MessageId: ${info.messageId})`);
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

      const resendHtml = buildEmailHtml({
        name,
        ticketId,
        eventName,
        day,
        category,
        branch,
        collegeRollNumber,
        ticketUrl,
        hasCidQr: false,
        base64Qr: qrDataUrl,
      });

      const resendResult = await resend.emails.send({
        from: resendFrom,
        to: [email],
        subject: `🎫 AMEYA '26 Entry Pass — ${eventName} [${ticketId}]`,
        html: resendHtml,
      });

      if (resendResult.error) {
        console.error("[Email:Resend] Resend API error:", resendResult.error);
        return { success: false, provider: "resend", error: resendResult.error.message };
      }

      console.log(`[Email:Resend] Successfully sent ticket to ${email} (Id: ${resendResult.data?.id})`);
      return { success: true, provider: "resend", messageId: resendResult.data?.id };
    } catch (resendErr: any) {
      console.error("[Email:Resend] Dispatch error:", resendErr);
      return { success: false, provider: "resend", error: resendErr.message };
    }
  }

  console.warn("[Email] Neither SMTP nor valid Resend credentials configured. Email skipped.");
  return { success: false, provider: "none", error: "No email provider configured." };
}
