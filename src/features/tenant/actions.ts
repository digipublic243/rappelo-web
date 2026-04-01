"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { submitTenantBooking } from "@/features/tenant/api";
import type { BookingRequestActionState } from "@/features/tenant/booking-state";

export async function submitTenantBookingAction(
  _: BookingRequestActionState,
  formData: FormData,
): Promise<BookingRequestActionState> {
  const unitId = String(formData.get("unitId") ?? "").trim();
  const checkIn = String(formData.get("check_in") ?? "").trim();
  const checkOut = String(formData.get("check_out") ?? "").trim();

  if (!unitId || !checkIn || !checkOut) {
    return { error: "Unit, check-in, and check-out are required." };
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
    return { error: result.error };
  }

  revalidatePath("/tenant/bookings");
  revalidatePath("/tenant/dashboard");
  redirect("/tenant/bookings");
}
