import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "study_blog_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14;

function authSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) {
    throw new Error("缺少 AUTH_SECRET");
  }
  return secret;
}

function safeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function sign(payload: string) {
  const mac = createHmac("sha256", authSecret()).update(payload).digest("base64url");
  return `${payload}.${mac}`;
}

function readSession(token: string) {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) {
    return null;
  }

  const payload = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  const expected = createHmac("sha256", authSecret()).update(payload).digest("base64url");
  const actualBuffer = Buffer.from(mac);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: number;
    };
    if (!data.exp || data.exp < Date.now()) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export function credentialsMatch(username: string, password: string) {
  const expectedUser = process.env.ADMIN_USERNAME?.trim() ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedUser || !expectedPassword) {
    return false;
  }
  return safeEqual(username, expectedUser) && safeEqual(password, expectedPassword);
}

export function safeNextPath(value: unknown) {
  const path = String(value ?? "");
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/login")) {
    return "/";
  }
  return path;
}

export async function isLoggedIn() {
  try {
    const store = await cookies();
    const token = store.get(COOKIE_NAME)?.value;
    if (!token) {
      return false;
    }
    return readSession(token) !== null;
  } catch {
    return false;
  }
}

export async function setSession() {
  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + MAX_AGE_SECONDS * 1000 }),
  ).toString("base64url");
  const store = await cookies();
  store.set(COOKIE_NAME, sign(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
