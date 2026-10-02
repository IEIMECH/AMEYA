import { NextRequest, NextResponse } from "next/server";

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    console.error("[SECURITY ALERT] ADMIN_SESSION_SECRET is missing in production environment!");
    return "";
  }
  return "ameya_fest_dev_only_secret_key_non_production_environment";
}

/**
 * Universal WebCrypto Token Verifier (Edge and Node compatible)
 */
async function verifyEdgeToken(token: string): Promise<boolean> {
  try {
    const secret = getSessionSecret();
    if (!secret || !token || typeof token !== "string") return false;

    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [header, payload, signature] = parts;
    const dataToVerify = `${header}.${payload}`;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    // Decode base64url signature
    let sigBase64 = signature.replace(/-/g, "+").replace(/_/g, "/");
    while (sigBase64.length % 4) {
      sigBase64 += "=";
    }
    const binaryStr = atob(sigBase64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      bytes,
      enc.encode(dataToVerify)
    );

    if (!isValid) return false;

    // Check expiration timestamp
    let payloadBase64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    while (payloadBase64.length % 4) {
      payloadBase64 += "=";
    }
    const payloadObj = JSON.parse(atob(payloadBase64));
    if (payloadObj.exp && payloadObj.exp < Date.now()) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Next.js Security Middleware Route Guard
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isAuthApi = pathname === "/api/admin/auth";

  const sessionCookie = req.cookies.get("ameya_admin_session");
  const isAuthenticated = sessionCookie
    ? await verifyEdgeToken(sessionCookie.value)
    : false;

  // 1. If already authenticated and accessing login page, redirect directly to /admin
  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // 2. Allow login page and auth API through
  if (isLoginPage || isAuthApi) {
    return NextResponse.next();
  }

  // 3. Enforce strict authentication on all /admin pages and /api/admin endpoints
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      // For API routes: Reject with 401 Unauthorized immediately
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { error: "Unauthorized: Administrator credentials required." },
          { status: 401 }
        );
      }

      // For page routes: Redirect immediately to /admin/login
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
