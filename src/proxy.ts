import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  API_BASE_URL,
  API_PREFIX,
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_NAMES,
  SESSION_COOKIE_OPTIONS,
} from "@/config/api";

type UserRole = "landlord" | "tenant" | "property_manager" | "admin";

async function fetchCurrentUser(accessToken: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}${API_PREFIX}/accounts/users/shell_profile/`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as { role?: UserRole };
  } catch (error) {
    // TO DO : put this error in a global state
    console.log("API FETCH ERROR :::", error);
  }
}

async function refreshAccessToken(refreshToken: string) {
  try {
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
  } catch (error) {
    // TO DO : put this error in a global state
    console.log("API FETCH ERROR :::", error);
  }
}

function isLandlordRole(role: UserRole | undefined) {
  return role === "landlord" || role === "property_manager" || role === "admin";
}

function clearSessionCookies(response: NextResponse) {
  response.cookies.set(SESSION_COOKIE_NAMES.accessToken, "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });
  response.cookies.set(SESSION_COOKIE_NAMES.refreshToken, "", {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
  });
}

function redirectTo(request: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLandlordPath = pathname.startsWith("/landlord");
  const isTenantPath = pathname.startsWith("/tenant");
  const isLandlordAuthPage =
    pathname === "/landlord/sign-in" || pathname === "/landlord/sign-up";
  const isTenantAuthPage = pathname === "/tenant/login";
  const isProtectedLandlordPath = isLandlordPath && !isLandlordAuthPage;
  const isProtectedTenantPath = isTenantPath && !isTenantAuthPage;

  if (!isLandlordPath && !isTenantPath) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(
    SESSION_COOKIE_NAMES.accessToken,
  )?.value;
  const refreshToken = request.cookies.get(
    SESSION_COOKIE_NAMES.refreshToken,
  )?.value;

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
  let user = resolvedAccessToken
    ? await fetchCurrentUser(resolvedAccessToken)
    : null;

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
    response.cookies.set(
      SESSION_COOKIE_NAMES.accessToken,
      resolvedAccessToken,
      { ...SESSION_COOKIE_OPTIONS, maxAge: SESSION_COOKIE_MAX_AGE },
    );
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
