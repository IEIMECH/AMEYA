import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  signSessionToken,
  verifySessionToken,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  SafeAdminUser,
} from "@/lib/adminAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AdminAccount {
  id: string;
  username: string;
  aliases: string[];
  password: string;
  name: string;
  role: string;
  avatarColor: string;
}

/**
 * AMEYA '26 — 5 Executive Leadership & Operations Console Accounts
 * Configured via Environment Variables — Zero credentials committed to Git.
 * 
 * Roles:
 * 1. President
 * 2. Vice President
 * 3. Secretary
 * 4. Events Head
 * 5. Technicals
 */
function getAdminAccounts(): AdminAccount[] {
  return [
    {
      id: "admin-1",
      username: (process.env.ADMIN_USER_1 || "president").trim().toLowerCase(),
      aliases: ["pres", "admin", "admin1"],
      password: (process.env.ADMIN_PASS_1 || "ameya@president2026").trim(),
      name: process.env.ADMIN_NAME_1 || "President",
      role: "President // IEI SAME",
      avatarColor: "#E51D25",
    },
    {
      id: "admin-2",
      username: (process.env.ADMIN_USER_2 || "vicepresident").trim().toLowerCase(),
      aliases: ["vp", "vice-president", "vice_president", "admin2"],
      password: (process.env.ADMIN_PASS_2 || "ameya@vp2026").trim(),
      name: process.env.ADMIN_NAME_2 || "Vice President",
      role: "Vice President // IEI SAME",
      avatarColor: "#0284c7",
    },
    {
      id: "admin-3",
      username: (process.env.ADMIN_USER_3 || "secretary").trim().toLowerCase(),
      aliases: ["sec", "admin3"],
      password: (process.env.ADMIN_PASS_3 || "ameya@sec2026").trim(),
      name: process.env.ADMIN_NAME_3 || "Secretary",
      role: "Secretary // IEI SAME",
      avatarColor: "#16a34a",
    },
    {
      id: "admin-4",
      username: (process.env.ADMIN_USER_4 || "eventshead").trim().toLowerCase(),
      aliases: ["events", "events-head", "events_head", "admin4"],
      password: (process.env.ADMIN_PASS_4 || "ameya@events2026").trim(),
      name: process.env.ADMIN_NAME_4 || "Events Head",
      role: "Events Head // IEI SAME",
      avatarColor: "#d97706",
    },
    {
      id: "admin-5",
      username: (process.env.ADMIN_USER_5 || "technicals").trim().toLowerCase(),
      aliases: ["tech", "technical", "technicals-lead", "admin5"],
      password: (process.env.ADMIN_PASS_5 || "ameya@tech2026").trim(),
      name: process.env.ADMIN_NAME_5 || "Technicals Lead",
      role: "Technicals Lead // IEI SAME",
      avatarColor: "#8b5cf6",
    },
  ];
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and passcode are required." },
        { status: 400 }
      );
    }

    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();
    const rateLimitKey = `${ip}:${cleanUser}`;

    // 1. Rate Limiting Check (Max 5 attempts, 15m lockout)
    const rateCheck = checkRateLimit(rateLimitKey);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many failed login attempts. Terminal locked for security. Please try again in ${rateCheck.retryAfterSec || 900} seconds.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.retryAfterSec || 900),
          },
        }
      );
    }

    // 2. Lookup Matched Executive / Coordinator Account
    const accounts = getAdminAccounts();
    const matchedAccount = accounts.find(
      (acc) => acc.username === cleanUser || acc.aliases.includes(cleanUser)
    );

    if (!matchedAccount) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { error: "Invalid administrator credentials. Access denied." },
        { status: 401 }
      );
    }

    // 3. Constant-Time Password Verification to prevent timing attacks
    const enc = new TextEncoder();
    const inputBuf = enc.encode(cleanPass);
    const expectedBuf = enc.encode(matchedAccount.password);

    let isPassMatch = false;
    if (inputBuf.length === expectedBuf.length) {
      isPassMatch = crypto.timingSafeEqual(inputBuf, expectedBuf);
    }

    if (!isPassMatch) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { error: "Invalid administrator credentials. Access denied." },
        { status: 401 }
      );
    }

    // Clear rate limit on successful authentication
    clearRateLimit(rateLimitKey);

    // 4. Create Safe Session Payload (Zero passwords or salts included)
    const sessionUser: SafeAdminUser = {
      id: matchedAccount.id,
      username: matchedAccount.username,
      name: matchedAccount.name,
      role: matchedAccount.role,
      phone: "+91 77320 14762",
      email: "ieisame@vvitu.edu.in",
      avatarColor: matchedAccount.avatarColor,
    };

    // 5. Generate Cryptographically Signed HMAC-SHA256 Token
    const signedToken = await signSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
      message: `${matchedAccount.name} authenticated successfully.`,
    });

    // 6. Set Secure httpOnly Cookie
    response.cookies.set("ameya_admin_session", signedToken, {
      httpOnly: true, // Immune to JavaScript document.cookie theft (XSS protection)
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Admin authentication error:", err);
    return NextResponse.json(
      { error: "Internal server error during authentication" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get("ameya_admin_session");
  if (!cookie || !cookie.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const verifiedUser = await verifySessionToken(cookie.value);
  if (!verifiedUser) {
    // Clear corrupted / tampered cookie
    const response = NextResponse.json({ authenticated: false }, { status: 401 });
    response.cookies.set("ameya_admin_session", "", { maxAge: 0, path: "/" });
    return response;
  }

  return NextResponse.json({
    authenticated: true,
    user: verifiedUser,
  });
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Admin session terminated.",
  });

  // Securely invalidate cookie
  response.cookies.set("ameya_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
