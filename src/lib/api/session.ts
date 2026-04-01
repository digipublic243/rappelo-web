import { cookies } from "next/headers";
import { refreshAccessToken, verifyToken } from "@/lib/api/auth";
import { SESSION_COOKIE_NAMES, SESSION_COOKIE_OPTIONS } from "@/config/api";
import type { SessionTokens } from "@/types/api";

export async function getSessionTokens(): Promise<SessionTokens | null> {
  const store = await cookies();
  const accessToken = store.get(SESSION_COOKIE_NAMES.accessToken)?.value;
  const refreshToken = store.get(SESSION_COOKIE_NAMES.refreshToken)?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  try {
    await verifyToken(accessToken);
    return { accessToken, refreshToken };
  } catch {
    try {
      const refreshed = await refreshAccessToken(refreshToken);
      const nextTokens = { accessToken: refreshed.access, refreshToken };

      try {
        store.set(SESSION_COOKIE_NAMES.accessToken, nextTokens.accessToken, SESSION_COOKIE_OPTIONS);
        store.set(SESSION_COOKIE_NAMES.refreshToken, nextTokens.refreshToken, SESSION_COOKIE_OPTIONS);
      } catch {
        // Cookie writes can fail in read-only server contexts; the refreshed access token still helps this request complete.
      }

      return nextTokens;
    } catch {
      try {
        store.delete(SESSION_COOKIE_NAMES.accessToken);
        store.delete(SESSION_COOKIE_NAMES.refreshToken);
      } catch {
        // Ignore cookie mutation errors in read-only server contexts.
      }

      return null;
    }
  }
}

export async function setSessionTokens(tokens: SessionTokens) {
  const store = await cookies();
  store.set(SESSION_COOKIE_NAMES.accessToken, tokens.accessToken, SESSION_COOKIE_OPTIONS);
  store.set(SESSION_COOKIE_NAMES.refreshToken, tokens.refreshToken, SESSION_COOKIE_OPTIONS);
}

export async function clearSessionTokens() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAMES.accessToken);
  store.delete(SESSION_COOKIE_NAMES.refreshToken);
}

export async function getAccessToken() {
  const tokens = await getSessionTokens();
  return tokens?.accessToken ?? null;
}
