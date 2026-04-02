"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api/accounts";
import { formatFormApiError } from "@/lib/api/errors";
import { initiateEasyPay, checkEasyPayStatus } from "@/lib/api/payments";
import { getSessionTokens } from "@/lib/api/session";
import { submitTenantBooking } from "@/features/tenant/api";
import type { BookingRequestActionState } from "@/features/tenant/booking-state";
import type { TenantEasyPayActionState } from "@/features/tenant/payment-easypay-state";
import { toBackendPhoneNumber } from "@/features/auth/phone";

async function requireAccessToken() {
  const tokens = await getSessionTokens();
  return tokens?.accessToken ?? null;
}

export async function submitTenantBookingAction(
  _: BookingRequestActionState,
  formData: FormData,
): Promise<BookingRequestActionState> {
  const unitId = String(formData.get("unitId") ?? "").trim();
  const checkIn = String(formData.get("check_in") ?? "").trim();
  const checkOut = String(formData.get("check_out") ?? "").trim();

  if (!unitId || !checkIn || !checkOut) {
    return {
      error: "Unit, check-in, and check-out are required.",
      errorDetails: ["unit: required", "check in: required", "check out: required"],
    };
  }

  const adultsCount = Number(String(formData.get("adults_count") ?? "1").trim() || "1");
  const childrenCount = Number(String(formData.get("children_count") ?? "0").trim() || "0");

  const result = await submitTenantBooking({
    unitId,
    checkIn,
    checkOut,
    preferredMoveInTime: String(formData.get("preferred_move_in_time") ?? "").trim() || undefined,
    occupantsCount: adultsCount + childrenCount,
    adultsCount,
    childrenCount,
    hasPets: String(formData.get("has_pets") ?? "") === "true",
    petDetails: String(formData.get("pet_details") ?? "").trim() || undefined,
    monthlyIncomeEstimate: String(formData.get("monthly_income_estimate") ?? "").trim() || undefined,
    employmentStatusSnapshot: String(formData.get("employment_status_snapshot") ?? "").trim() || undefined,
    emergencyContactName: String(formData.get("emergency_contact_name") ?? "").trim() || undefined,
    emergencyContactPhone: String(formData.get("emergency_contact_phone") ?? "").trim() || undefined,
    idDocumentUrl: String(formData.get("id_document_url") ?? "").trim() || undefined,
    selfieUrl: String(formData.get("selfie_url") ?? "").trim() || undefined,
    stayPurpose: String(formData.get("stay_purpose") ?? "").trim() || undefined,
    specialRequests: String(formData.get("special_requests") ?? "").trim() || undefined,
    sourceChannel: "web_app",
    bookingDeposit: Number(String(formData.get("booking_deposit") ?? "0").trim() || "0"),
    notes: String(formData.get("notes") ?? "").trim() || undefined,
  });

  if (!result.ok) {
    return { error: result.error, errorDetails: result.errorDetails };
  }

  revalidatePath("/tenant/bookings");
  revalidatePath("/tenant/dashboard");
  redirect("/tenant/bookings");
}

export async function initiateTenantEasyPayAction(
  _: TenantEasyPayActionState,
  formData: FormData,
): Promise<TenantEasyPayActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return {
      error: "Votre session a expiré. Reconnectez-vous pour lancer le paiement.",
    };
  }

  const paymentId = String(formData.get("paymentId") ?? "").trim();
  if (!paymentId) {
    return {
      error: "Aucun paiement n’a été sélectionné.",
      errorDetails: ["payment: requis"],
    };
  }

  const user = await getCurrentUser(accessToken).catch(() => null);
  const phoneSource = String(formData.get("phone_source") ?? "account").trim();
  const rawOtherPhone = String(formData.get("other_phone_number") ?? "").trim();
  const phoneNumber =
    phoneSource === "other"
      ? toBackendPhoneNumber(rawOtherPhone)
      : toBackendPhoneNumber(user?.phone_number ?? "");

  if (!phoneNumber) {
    return {
      error:
        phoneSource === "other"
          ? "Le numéro alternatif saisi est invalide."
          : "Aucun numéro de téléphone valide n’est associé à votre compte.",
      errorDetails: [
        phoneSource === "other"
          ? "other phone number: un numéro congolais valide est requis"
          : "phone number: un numéro congolais valide est requis",
      ],
    };
  }

  try {
    const response = await initiateEasyPay(
      paymentId,
      {
        phone_number: phoneNumber,
      },
      accessToken,
    );

    revalidatePath("/tenant/payments");
    revalidatePath(`/tenant/payments/${paymentId}`);
    revalidatePath("/tenant/dashboard");

    return {
      message:
        response.message ??
        "La demande EasyPay a été envoyée. Confirmez-la depuis votre téléphone.",
    };
  } catch (error) {
    const formatted = formatFormApiError(
      error,
      "Impossible de lancer la collecte EasyPay pour ce paiement.",
    );

    return {
      error: formatted.message,
      errorDetails: formatted.details,
    };
  }
}

export async function checkTenantEasyPayStatusAction(
  _: TenantEasyPayActionState,
  formData: FormData,
): Promise<TenantEasyPayActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return {
      error: "Votre session a expiré. Reconnectez-vous pour vérifier le paiement.",
    };
  }

  const paymentId = String(formData.get("paymentId") ?? "").trim();
  if (!paymentId) {
    return {
      error: "Aucun paiement n’a été sélectionné.",
      errorDetails: ["payment: requis"],
    };
  }

  try {
    const response = await checkEasyPayStatus(paymentId, accessToken);

    revalidatePath("/tenant/payments");
    revalidatePath(`/tenant/payments/${paymentId}`);
    revalidatePath("/tenant/dashboard");

    return {
      message: response.status
        ? `Statut EasyPay synchronisé : ${response.status}.`
        : "Le statut EasyPay a été synchronisé avec le serveur.",
    };
  } catch (error) {
    const formatted = formatFormApiError(
      error,
      "Impossible de vérifier le statut EasyPay pour ce paiement.",
    );

    return {
      error: formatted.message,
      errorDetails: formatted.details,
    };
  }
}
