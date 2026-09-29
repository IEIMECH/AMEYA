import nodemailer from "nodemailer";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

// Load .env.local manually
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const [key, ...vals] = trimmed.split("=");
    if (key && vals.length > 0) {
      process.env[key.trim()] = vals.join("=").trim().replace(/^["']|["']$/g, "");
    }
  }
}

const recipient = process.argv[2];
if (!recipient) {
  console.error("❌ Please provide a recipient email address:");
  console.error("Usage: node scripts/test-email.mjs your-email@gmail.com");
  process.exit(1);
}

const host = process.env.SMTP_HOST || "smtp.gmail.com";
const port = Number(process.env.SMTP_PORT) || 465;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

console.log("=========================================");
console.log("  AMEYA '26 // SMTP DIAGNOSTIC TEST");
console.log("=========================================");
console.log(`Host:     ${host}`);
console.log(`Port:     ${port}`);
console.log(`User:     ${user ? user : "❌ NOT SET in .env.local"}`);
console.log(`Password: ${pass ? "•••••••••••••••• (16 chars)" : "❌ NOT SET in .env.local"}`);
console.log(`To:       ${recipient}`);
console.log("=========================================\n");

if (!user || !pass) {
  console.error("❌ Error: SMTP_USER or SMTP_PASS is missing in .env.local.");
  console.error("Please add SMTP_USER and SMTP_PASS and run this test again.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
});

async function run() {
  console.log("🔄 1. Verifying SMTP connection to " + host + "...");
  try {
    await transporter.verify();
    console.log("✅ SMTP Server Connection Verified Successfully!\n");
  } catch (verifyErr) {
    console.error("❌ SMTP Verification Failed:", verifyErr.message);
    console.error("\nCommon fixes:");
    console.error("• If Gmail: Ensure you used a 16-character 'App Password', NOT your standard Gmail password.");
    console.error("• Ensure 2-Step Verification is turned ON on your Google Account.");
    process.exit(1);
  }

  console.log("🔄 2. Generating QR Code Ticket buffer...");
  const qrBuffer = await QRCode.toBuffer("https://ameyafest.vercel.app/ticket/AMEYA-2026-TEST-7777", {
    width: 300,
    margin: 2,
    color: { dark: "#050505", light: "#ffffff" }
  });
  console.log("✅ QR Code generated successfully!\n");

  console.log("🔄 3. Dispatching test email to " + recipient + "...");
  try {
    const fromAddress = process.env.SMTP_FROM || `"AMEYA '26" <${user}>`;
    const info = await transporter.sendMail({
      from: fromAddress,
      to: recipient,
      subject: "🎫 AMEYA '26 Test Entry Pass [AMEYA-2026-TEST-7777]",
      html: `
        <div style="background:#050505;color:#F2EDE8;font-family:sans-serif;padding:30px;max-width:550px;margin:0 auto;border-radius:6px;border-top:3px solid #E51D25;">
          <h2 style="color:#FFFFFF;margin-top:0;">AMEYA '26 Accreditation Test</h2>
          <p style="color:#96908B;">If you are reading this email, your <strong>SMTP and QR code pipeline is working 100%</strong>.</p>
          <div style="background:#111;padding:16px;border-radius:4px;border:1px solid #333;margin:20px 0;">
            <p style="margin:4px 0;"><strong>Event:</strong> AutoCAD (Solo Technical)</p>
            <p style="margin:4px 0;"><strong>Token:</strong> <span style="color:#E51D25;">AMEYA-2026-TEST-7777</span></p>
            <p style="margin:4px 0;"><strong>Status:</strong> PASS CONFIRMED</p>
          </div>
          <div style="text-align:center;padding:15px;background:#FFF;border-radius:4px;display:inline-block;">
            <img src="cid:testqr" style="width:180px;height:180px;display:block;" />
          </div>
          <p style="color:#605B56;font-size:12px;margin-top:20px;">AMEYA '26 • VVIT Nambur</p>
        </div>
      `,
      attachments: [
        {
          filename: "ameya-test-qr.png",
          content: qrBuffer,
          cid: "testqr"
        }
      ]
    });

    console.log("🎉 SUCCESS! Email dispatched successfully!");
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Check inbox or spam folder of: ${recipient}`);
  } catch (sendErr) {
    console.error("❌ Email dispatch failed:", sendErr.message);
  }
}

run();
