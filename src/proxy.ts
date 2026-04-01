import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

const API_PREFIX = "/api";

const SESSION_COOKIE_NAMES = {
  accessToken: "rappelo_access_token",
  refreshToken: "rappelo_refresh_token",
} as const;

type UserRole = "landlord" | "tenant" | "property_manager" | "admin";

async function fetchCurrentUser(accessToken: string) {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/accounts/users/me/`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as { role?: UserRole };
}

async function refreshAccessToken(refreshToken: string) {
  const response = await fetch(`${API_BASE_URL}${API_PREFIX}/auth/refresh/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as { access?: string };
  return payload.access ?? null;
}

function isLandlordRole(role: UserRole | undefined) {
  return role === "landlord" || role === "property_manager" || role === "admin";
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.delete(SESSION_COOKIE_NAMES.accessToken);
  response.cookies.delete(SESSION_COOKIE_NAMES.refreshToken);
}

function redirectTo(request: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLandlordPath = pathname.startsWith("/landlord");
  const isTenantPath = pathname.startsWith("/tenant");
  const isLandlordAuthPage = pathname === "/landlord/sign-in" || pathname === "/landlord/sign-up";
  const isTenantAuthPage = pathname === "/tenant/login";
  const isProtectedLandlordPath = isLandlordPath && !isLandlordAuthPage;
  const isProtectedTenantPath = isTenantPath && !isTenantAuthPage;

  if (!isLandlordPath && !isTenantPath) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(SESSION_COOKIE_NAMES.accessToken)?.value;
  const refreshToken = request.cookies.get(SESSION_COOKIE_NAMES.refreshToken)?.value;

  if (!accessToken && !refreshToken) {
    if (isProtectedLandlordPath) {
      return redirectTo(request, "/landlord/sign-in");
    }

    if (isProtectedTenantPath) {
      return redirectTo(request, "/tenant/login");
    }

    return NextResponse.next();
  }

  let resolvedAccessToken = accessToken ?? null;
  let user = resolvedAccessToken ? await fetchCurrentUser(resolvedAccessToken) : null;

  if (!user && refreshToken) {
    const refreshedAccessToken = await refreshAccessToken(refreshToken);
    if (refreshedAccessToken) {
      resolvedAccessToken = refreshedAccessToken;
      user = await fetchCurrentUser(refreshedAccessToken);
    }
  }

  if (!user?.role) {
    const target = isLandlordPath ? "/landlord/sign-in" : "/tenant/login";
    const response = redirectTo(request, target);
    clearSessionCookies(response);
    return response;
  }

  const response = NextResponse.next();

  if (resolvedAccessToken && resolvedAccessToken !== accessToken) {
    response.cookies.set(SESSION_COOKIE_NAMES.accessToken, resolvedAccessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });
  }

  if (isProtectedLandlordPath && !isLandlordRole(user.role)) {
    return redirectTo(request, "/tenant/dashboard");
  }

  if (isProtectedTenantPath && isLandlordRole(user.role)) {
    return redirectTo(request, "/landlord/dashboard");
  }

  if (isLandlordAuthPage && isLandlordRole(user.role)) {
    return redirectTo(request, "/landlord/dashboard");
  }

  if (isTenantAuthPage && user.role === "tenant") {
    return redirectTo(request, "/tenant/dashboard");
  }

  return response;
}

export const config = {
  matcher: ["/landlord/:path*", "/tenant/:path*"],
};
