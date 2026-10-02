import { NextRequest } from "next/server";
import crypto from "crypto";

export interface SafeAdminUser {
  id: string;
  username: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  avatarColor: string;
  exp?: number;
}

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  "ameya_fest_2026_super_secure_vault_secret_key_998877665544";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Helper for Base64URL encoding/decoding
function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("utf8");
}

// Universal WebCrypto HMAC Key generator
async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

/**
 * Cryptographically sign a session token using HMAC-SHA256 (JWT-style)
 */
export async function signSessionToken(user: SafeAdminUser): Promise<string> {
  const enc = new TextEncoder();
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payloadData: SafeAdminUser = {
    ...user,
    exp: Date.now() + SESSION_DURATION_MS,
  };
  const payload = base64UrlEncode(JSON.stringify(payloadData));
  const dataToSign = `${header}.${payload}`;

  const key = await getCryptoKey();
  const sigBuffer = await crypto.subtle.sign("HMAC", key, enc.encode(dataToSign));
  const signature = Buffer.from(sigBuffer)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${dataToSign}.${signature}`;
}

/**
 * Verify HMAC-SHA256 signature and expiration of a session token
 */
export async function verifySessionToken(token: string): Promise<SafeAdminUser | null> {
  try {
    if (!token || typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, payload, signature] = parts;
    const dataToVerify = `${header}.${payload}`;

    const key = await getCryptoKey();
    if (!key) return null;
    const enc = new TextEncoder();

    // Decode signature
    let sigBase64 = signature.replace(/-/g, "+").replace(/_/g, "/");
    while (sigBase64.length % 4) {
      sigBase64 += "=";
    }
    const sigBytes = Buffer.from(sigBase64, "base64");

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      enc.encode(dataToVerify)
    );

    if (!isValid) {
      console.warn("Security Alert: Invalid session token signature detected.");
      return null;
    }

    const payloadObj = JSON.parse(base64UrlDecode(payload)) as SafeAdminUser;

    // Check expiration
    if (payloadObj.exp && payloadObj.exp < Date.now()) {
      console.warn("Session expired for user:", payloadObj.username);
      return null;
    }

    return payloadObj;
  } catch (err) {
    console.error("Token verification error:", err);
    return null;
  }
}

/**
 * Extract and authenticate admin user from Next.js request cookies
 */
export async function getAuthenticatedAdmin(req: NextRequest): Promise<SafeAdminUser | null> {
  const cookie = req.cookies.get("ameya_admin_session");
  if (!cookie || !cookie.value) return null;
  return await verifySessionToken(cookie.value);
}

// ---------------------------------------------------------------------------
// Rate Limiting (In-Memory IP & Username Tracker)
// ---------------------------------------------------------------------------
interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

const loginAttempts = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes lockout

export function checkRateLimit(key: string): { allowed: boolean; remaining: number; retryAfterSec?: number } {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  // Check if locked out
  if (record.lockedUntil && record.lockedUntil > now) {
    const retryAfterSec = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  // Reset if window passed
  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(key);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    return { allowed: false, remaining: 0, retryAfterSec: Math.ceil(LOCKOUT_MS / 1000) };
  }

  return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
}

export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const record = loginAttempts.get(key);

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(key, { count: 1, firstAttempt: now });
  } else {
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_MS;
    }
  }
}

export function clearRateLimit(key: string): void {
  loginAttempts.delete(key);
}

// ---------------------------------------------------------------------------
// PBKDF2 Constant-Time Password Verification
// ---------------------------------------------------------------------------
export function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const computedHash = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");

    const a = Buffer.from(computedHash, "hex");
    const b = Buffer.from(expectedHash, "hex");

    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
