import { NextRequest, NextResponse } from "next/server";
import { ADMIN_USERS } from "@/data/adminUsers";
import {
  verifyPassword,
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

    const cleanUser = String(username).trim().toLowerCase();
    const cleanPass = String(password).trim();
    const rateLimitKey = `${ip}:${cleanUser}`;

    // 1. Rate Limiting Check
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

    // 2. Lookup Admin Record
    const matchedAdmin = ADMIN_USERS.find(
      (u) => u.username.toLowerCase() === cleanUser
    );

    if (!matchedAdmin) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { error: "Invalid coordinator credentials. Access denied." },
        { status: 401 }
      );
    }

    // 3. Cryptographic Constant-Time Password Verification (PBKDF2-SHA512)
    const isPasswordValid = verifyPassword(
      cleanPass,
      matchedAdmin.salt,
      matchedAdmin.passwordHash
    );

    if (!isPasswordValid) {
      recordFailedAttempt(rateLimitKey);
      return NextResponse.json(
        { error: "Invalid coordinator credentials. Access denied." },
        { status: 401 }
      );
    }

    // Clear rate limit on successful authentication
    clearRateLimit(rateLimitKey);

    // 4. Create Safe Session Payload (Excludes hashes & salts)
    const sessionUser: SafeAdminUser = {
      id: matchedAdmin.id,
      username: matchedAdmin.username,
      name: matchedAdmin.name,
      role: matchedAdmin.role,
      phone: matchedAdmin.phone,
      email: matchedAdmin.email,
      avatarColor: matchedAdmin.avatarColor,
    };

    // 5. Generate Signed HMAC-SHA256 Token
    const signedToken = await signSessionToken(sessionUser);

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
      message: "Terminal authenticated successfully.",
    });

    // 6. Set Cryptographically Secure httpOnly Cookie
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
