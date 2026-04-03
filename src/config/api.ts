export const API_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export const API_PREFIX = "/api";

const cookieSameSite = process.env.SESSION_COOKIE_SAME_SITE;
type SessionCookieSameSite = "lax" | "strict" | "none";

function resolveCookieSecure() {
  if (process.env.SESSION_COOKIE_SECURE === "true") {
    return true;
  }

  if (process.env.SESSION_COOKIE_SECURE === "false") {
    return false;
  }

  return process.env.NODE_ENV === "production";
}

export const SESSION_COOKIE_MAX_AGE =
  Number(process.env.SESSION_COOKIE_MAX_AGE ?? 60 * 60 * 24 * 7) || 60 * 60 * 24 * 7;

export const SESSION_COOKIE_NAMES = {
  accessToken: "rappelo_access_token",
  refreshToken: "rappelo_refresh_token",
} as const;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite:
    cookieSameSite === "strict" || cookieSameSite === "none"
      ? cookieSameSite
      : ("lax" as SessionCookieSameSite),
  secure: resolveCookieSecure(),
  path: "/",
  maxAge: SESSION_COOKIE_MAX_AGE,
  ...(process.env.SESSION_COOKIE_DOMAIN
    ? { domain: process.env.SESSION_COOKIE_DOMAIN }
    : {}),
};
