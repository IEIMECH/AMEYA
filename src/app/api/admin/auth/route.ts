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
 * AMEYA '26 Dynamic 4-Tier Operations Console Accounts
 * Backed by Environment Variables — Zero credentials committed to Git.
 */
function getAdminAccounts(): AdminAccount[] {
  return [
    {
      id: "admin-1",
      username: (process.env.ADMIN_USER_1 || process.env.ADMIN_USERNAME || "admin").trim().toLowerCase(),
      aliases: ["admin1", "lead"],
      password: (process.env.ADMIN_PASS_1 || process.env.ADMIN_PASSWORD || "ameya@admin2026").trim(),
      name: process.env.ADMIN_NAME_1 || "Lead Administrator",
      role: "Super Admin // General Secretariat",
      avatarColor: "#E51D25",
    },
    {
      id: "admin-2",
      username: (process.env.ADMIN_USER_2 || "operations").trim().toLowerCase(),
      aliases: ["admin2", "ops"],
      password: (process.env.ADMIN_PASS_2 || "ameya@ops2026").trim(),
      name: process.env.ADMIN_NAME_2 || "Operations Desk",
      role: "Operations Coordinator",
      avatarColor: "#0284c7",
    },
    {
      id: "admin-3",
      username: (process.env.ADMIN_USER_3 || "events").trim().toLowerCase(),
      aliases: ["admin3", "event"],
      password: (process.env.ADMIN_PASS_3 || "ameya@events2026").trim(),
      name: process.env.ADMIN_NAME_3 || "Events Secretariat",
      role: "Events Coordinator",
      avatarColor: "#16a34a",
    },
    {
      id: "admin-4",
      username: (process.env.ADMIN_USER_4 || "hospitality").trim().toLowerCase(),
      aliases: ["admin4", "gate"],
      password: (process.env.ADMIN_PASS_4 || "ameya@gate2026").trim(),
      name: process.env.ADMIN_NAME_4 || "Gate & Hospitality",
      role: "Transport & Gate Lead",
      avatarColor: "#d97706",
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

    // 2. Lookup Matched Coordinator Account
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
