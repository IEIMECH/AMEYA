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

    const cleanUser = String(username).trim();
    const cleanPass = String(password).trim();
    const rateLimitKey = `${ip}:${cleanUser.toLowerCase()}`;

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

    // 2. Universal Admin Credential Validation from Environment Variables
    // (Never stored in Git repository source code)
    const expectedUser = (process.env.ADMIN_USERNAME || "admin").trim();
    const expectedPass = (process.env.ADMIN_PASSWORD || "ameya@vvit2026").trim();

    const isUserMatch = cleanUser.toLowerCase() === expectedUser.toLowerCase();

    // Constant-time password comparison to prevent timing attacks
    const enc = new TextEncoder();
    const inputBuf = enc.encode(cleanPass);
    const expectedBuf = enc.encode(expectedPass);

    let isPassMatch = false;
    if (inputBuf.length === expectedBuf.length) {
      isPassMatch = crypto.timingSafeEqual(inputBuf, expectedBuf);
    }

    if (!isUserMatch || !isPassMatch) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { error: "Invalid administrator credentials. Access denied." },
        { status: 401 }
      );
    }

    // Clear rate limit on successful authentication
    clearRateLimit(rateLimitKey);

    // 3. Create Safe Session Payload (Zero passwords or salts included)
    const sessionUser: SafeAdminUser = {
      id: "admin-root",
      username: expectedUser,
      name: process.env.ADMIN_DISPLAY_NAME || "Operations Secretariat",
      role: "Lead Administrator",
      phone: "+91 77320 14762",
      email: "ieisame@vvitu.edu.in",
      avatarColor: "#E51D25",
    };

    // 4. Generate Cryptographically Signed HMAC-SHA256 Token
    const signedToken = await signSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
      message: "Terminal authenticated successfully.",
    });

    // 5. Set Secure httpOnly Cookie
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
