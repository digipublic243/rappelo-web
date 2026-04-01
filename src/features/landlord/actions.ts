"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { confirmBooking, rejectBooking } from "@/lib/api/bookings";
import { activateLease, renewLease, terminateLease } from "@/lib/api/leases";
import { createProperty, updateProperty, updateUnitStatus } from "@/lib/api/properties";
import { getSessionTokens } from "@/lib/api/session";
import type { ApiPropertyStatus, ApiPropertyUpsertRequest, ApiUnitStatus } from "@/types/api";
import type { PropertyEditorActionState } from "@/features/landlord/property-editor-state";

async function requireAccessToken() {
  const tokens = await getSessionTokens();
  return tokens?.accessToken ?? null;
}

function toOptionalNumber(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildPropertyPayload(formData: FormData): ApiPropertyUpsertRequest {
  const status = String(formData.get("status") ?? "active").trim() as ApiPropertyStatus;
  const totalUnitsRaw = String(formData.get("total_units") ?? "").trim();
  const totalUnits = Number(totalUnitsRaw);

  return {
    name: String(formData.get("name") ?? "").trim(),
    property_type: String(formData.get("property_type") ?? "apartment").trim(),
    status,
    address_line_1: String(formData.get("address_line_1") ?? "").trim(),
    address_line_2: String(formData.get("address_line_2") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim(),
    state: String(formData.get("state") ?? "").trim(),
    postal_code: String(formData.get("postal_code") ?? "").trim(),
    country: String(formData.get("country") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    year_built: toOptionalNumber(formData.get("year_built")),
    total_units: Number.isFinite(totalUnits) ? totalUnits : 0,
    square_footage: toOptionalNumber(formData.get("square_footage")),
    purchase_price: toOptionalNumber(formData.get("purchase_price")),
    current_value: toOptionalNumber(formData.get("current_value")),
    is_active: status === "active" || status === "maintenance",
  };
}

function validatePropertyPayload(payload: ApiPropertyUpsertRequest) {
  if (!payload.name || !payload.address_line_1 || !payload.city || !payload.state || !payload.postal_code || !payload.country) {
    return "Name, address, city, state, postal code, and country are required.";
  }

  if (!payload.total_units || payload.total_units < 1) {
    return "Total units must be at least 1.";
  }

  return null;
}

export async function createPropertyAction(
  _: PropertyEditorActionState,
  formData: FormData,
): Promise<PropertyEditorActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return { error: "No authenticated landlord session found." };
  }

  const payload = buildPropertyPayload(formData);
  const validationError = validatePropertyPayload(payload);
  if (validationError) {
    return { error: validationError };
  }

  let redirectPath: string | null = null;

  try {
    const property = await createProperty(payload, accessToken);
    revalidatePath("/landlord/properties");
    revalidatePath("/landlord/dashboard");
    redirectPath = `/landlord/properties/${property.id}`;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to create the property right now.",
    };
  }

  redirect(redirectPath);
}

export async function updatePropertyAction(
  _: PropertyEditorActionState,
  formData: FormData,
): Promise<PropertyEditorActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return { error: "No authenticated landlord session found." };
  }

  const propertyId = String(formData.get("propertyId") ?? "").trim();
  if (!propertyId) {
    return { error: "Property id is required." };
  }

  const payload = buildPropertyPayload(formData);
  const validationError = validatePropertyPayload(payload);
  if (validationError) {
    return { error: validationError };
  }

  let redirectPath: string | null = null;

  try {
    const property = await updateProperty(propertyId, payload, accessToken);
    revalidatePath("/landlord/properties");
    revalidatePath(`/landlord/properties/${propertyId}`);
    revalidatePath(`/landlord/properties/${propertyId}/edit`);
    revalidatePath("/landlord/dashboard");
    redirectPath = `/landlord/properties/${property.id}`;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to update the property right now.",
    };
  }

  redirect(redirectPath);
}

export async function updateUnitStatusAction(formData: FormData) {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return;
  }

  const unitId = String(formData.get("unitId") ?? "");
  const status = String(formData.get("status") ?? "") as ApiUnitStatus;

  if (!unitId || !status) {
    return;
  }

  await updateUnitStatus(unitId, status, accessToken).catch(() => null);
  revalidatePath("/landlord/units");
  revalidatePath(`/landlord/units/${unitId}`);
  revalidatePath("/landlord/dashboard");
}

export async function activateLeaseAction(formData: FormData) {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return;
  }

  const leaseId = String(formData.get("leaseId") ?? "");
  if (!leaseId) {
    return;
  }

  await activateLease(leaseId, accessToken).catch(() => null);
  revalidatePath("/landlord/leases");
  revalidatePath(`/landlord/leases/${leaseId}`);
  revalidatePath("/landlord/dashboard");
}

export async function terminateLeaseAction(formData: FormData) {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return;
  }

  const leaseId = String(formData.get("leaseId") ?? "");
  if (!leaseId) {
    return;
  }

  await terminateLease(leaseId, {}, accessToken).catch(() => null);
  revalidatePath("/landlord/leases");
  revalidatePath(`/landlord/leases/${leaseId}`);
  revalidatePath("/landlord/dashboard");
}

export async function renewLeaseAction(formData: FormData) {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return;
  }

  const leaseId = String(formData.get("leaseId") ?? "");
  const newEndDate = String(formData.get("newEndDate") ?? "");
  if (!leaseId || !newEndDate) {
    return;
  }

  await renewLease(leaseId, { new_end_date: newEndDate }, accessToken).catch(() => null);
  revalidatePath("/landlord/leases");
  revalidatePath(`/landlord/leases/${leaseId}`);
  revalidatePath("/landlord/dashboard");
}

export async function confirmBookingAction(formData: FormData) {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return;
  }

  const bookingId = String(formData.get("bookingId") ?? "");
  if (!bookingId) {
    return;
  }

  await confirmBooking(bookingId, accessToken).catch(() => null);
  revalidatePath("/landlord/bookings");
  revalidatePath(`/landlord/bookings/${bookingId}`);
  revalidatePath("/landlord/dashboard");
}

export async function rejectBookingAction(formData: FormData) {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return;
  }

  const bookingId = String(formData.get("bookingId") ?? "");
  const reason = String(formData.get("reason") ?? "");
  if (!bookingId) {
    return;
  }

  await rejectBooking(bookingId, reason || undefined, accessToken).catch(() => null);
  revalidatePath("/landlord/bookings");
  revalidatePath(`/landlord/bookings/${bookingId}`);
  revalidatePath("/landlord/dashboard");
}
