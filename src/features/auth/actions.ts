"use server";

import { redirect } from "next/navigation";
import { clearSessionTokens, setSessionTokens } from "@/lib/api/session";
import { createUser, login, requestOtp, verifyOtp } from "@/lib/api/auth";
import { getCurrentUser, getShellProfile } from "@/lib/api/accounts";
import type { AuthActionState } from "@/features/auth/state";
import { toBackendPhoneNumber } from "@/features/auth/phone";

async function resolveRedirectPath(accessToken: string) {
  const shellProfile = await getShellProfile(accessToken).catch(() => null);
  const role = shellProfile?.role ?? (await getCurrentUser(accessToken).catch(() => null))?.role;
  return role === "tenant" ? "/tenant/dashboard" : "/landlord/dashboard";
}

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const rawPhoneNumber = String(formData.get("phone_number") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const phoneNumber = toBackendPhoneNumber(rawPhoneNumber);

  if (!phoneNumber || !password) {
    return { error: "Phone number must contain the last 9 digits and password is required." };
  }

  let redirectPath: string | null = null;

  try {
    const tokenPair = await login({ phone_number: phoneNumber, password });
    await setSessionTokens({ accessToken: tokenPair.access, refreshToken: tokenPair.refresh });
    redirectPath = await resolveRedirectPath(tokenPair.access);
  } catch (error) {
    await clearSessionTokens();
    return {
      error: error instanceof Error ? error.message : "Unable to sign in right now.",
    };
  }

  redirect(redirectPath);
}

export async function requestTenantOtpAction(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawPhoneNumber = String(formData.get("phone_number") ?? "").trim();
  const phoneNumber = toBackendPhoneNumber(rawPhoneNumber);

  if (!phoneNumber) {
    return { error: "Phone number must contain the last 9 digits.", step: "request", phoneNumber: rawPhoneNumber };
  }

  try {
    const response = await requestOtp({ phone_number: phoneNumber });
    return {
      phoneNumber: rawPhoneNumber,
      step: "verify",
      message:
        response.message ??
        response.detail ??
        "OTP requested successfully. In development, the backend prints the code in the server console.",
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to request OTP right now.",
      step: "request",
      phoneNumber: rawPhoneNumber,
    };
  }
}

export async function verifyTenantOtpAction(
  _: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const rawPhoneNumber = String(formData.get("phone_number") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim();
  const phoneNumber = toBackendPhoneNumber(rawPhoneNumber);

  if (!phoneNumber || !code) {
    return { error: "Phone number must contain the last 9 digits and OTP code is required.", step: "verify", phoneNumber: rawPhoneNumber };
  }

  let redirectPath: string | null = null;

  try {
    const tokenPair = await verifyOtp({ phone_number: phoneNumber, code });
    await setSessionTokens({ accessToken: tokenPair.access, refreshToken: tokenPair.refresh });
    redirectPath = await resolveRedirectPath(tokenPair.access);
  } catch (error) {
    await clearSessionTokens();
    return {
      error: error instanceof Error ? error.message : "Invalid OTP code.",
      step: "verify",
      phoneNumber: rawPhoneNumber,
    };
  }

  redirect(redirectPath);
}

export async function landlordSignUpAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const rawPhoneNumber = String(formData.get("phone_number") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const passwordConfirm = String(formData.get("password2") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim();
  const phoneNumber = toBackendPhoneNumber(rawPhoneNumber);

  if (!phoneNumber || !password || !passwordConfirm) {
    return { error: "Phone number must contain the last 9 digits and both password fields are required." };
  }

  if (password !== passwordConfirm) {
    return { error: "Passwords do not match." };
  }

  let redirectPath: string | null = null;

  try {
    await createUser({
      phone_number: phoneNumber,
      password,
      password2: passwordConfirm,
      role: "landlord",
      email: email || null,
      first_name: companyName || "Landlord",
    });

    const tokenPair = await login({ phone_number: phoneNumber, password });
    await setSessionTokens({ accessToken: tokenPair.access, refreshToken: tokenPair.refresh });
    redirectPath = "/landlord/dashboard";
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to create the account right now.",
    };
  }

  redirect(redirectPath);
}

export async function logoutAction(formData: FormData) {
  const role = String(formData.get("role") ?? "").trim();
  await clearSessionTokens();
  redirect(role === "tenant" ? "/tenant/login" : "/landlord/sign-in");
}
