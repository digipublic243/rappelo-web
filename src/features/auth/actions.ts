"use server";

import { redirect } from "next/navigation";
import { clearSessionTokens, setSessionTokens } from "@/lib/api/session";
import { createUser, login } from "@/lib/api/auth";
import { getCurrentUser } from "@/lib/api/accounts";
import type { AuthActionState } from "@/features/auth/state";

export async function loginAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const phoneNumber = String(formData.get("phone_number") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!phoneNumber || !password) {
    return { error: "Phone number and password are required." };
  }

  let redirectPath: string | null = null;

  try {
    const tokenPair = await login({ phone_number: phoneNumber, password });
    await setSessionTokens({ accessToken: tokenPair.access, refreshToken: tokenPair.refresh });
    const user = await getCurrentUser(tokenPair.access);
    redirectPath = user.role === "tenant" ? "/tenant/dashboard" : "/landlord/dashboard";
  } catch (error) {
    await clearSessionTokens();
    return {
      error: error instanceof Error ? error.message : "Unable to sign in right now.",
    };
  }

  redirect(redirectPath);
}

export async function landlordSignUpAction(_: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const phoneNumber = String(formData.get("phone_number") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const passwordConfirm = String(formData.get("password2") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const companyName = String(formData.get("company_name") ?? "").trim();

  if (!phoneNumber || !password || !passwordConfirm) {
    return { error: "Phone number and both password fields are required." };
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
