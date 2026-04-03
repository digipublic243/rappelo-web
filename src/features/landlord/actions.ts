"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { confirmBooking, rejectBooking } from "@/lib/api/bookings";
import {
  activateLease,
  alertLeaseOverdue,
  createLease,
  getLeaseById,
  renewLease,
  terminateLease,
} from "@/lib/api/leases";
import {
  createProperty,
  createUnit,
  updateProperty,
  updateUnit,
  updateUnitStatus,
} from "@/lib/api/properties";
import {
  checkEasyPayStatus,
  confirmPayment,
  createPayment,
  generatePaymentLink,
  sendPaymentReminders,
} from "@/lib/api/payments";
import { createTenantProfile } from "@/lib/api/tenants";
import { buildGlobalApiError, formatFormApiError } from "@/lib/api/errors";
import { getSessionTokens } from "@/lib/api/session";
import type {
  ApiCurrency,
  ApiEmploymentStatus,
  ApiLeaseCreateRequest,
  ApiPropertyStatus,
  ApiPropertyUpsertRequest,
  ApiRentalPeriodicity,
  ApiUnitCreateRequest,
  ApiUnitUpdateRequest,
  ApiUnitStatus,
} from "@/types/api";
import type { LeaseEditorActionState } from "@/features/landlord/lease-editor-state";
import type { LandlordEasyPayActionState } from "@/features/landlord/payment-easypay-state";
import type { LeaseOverdueActionState } from "@/features/landlord/lease-overdue-state";
import type { PropertyEditorActionState } from "@/features/landlord/property-editor-state";
import type { PaymentWorkflowActionState } from "@/features/landlord/payment-workflow-state";
import type { TenantEditorActionState } from "@/features/landlord/tenant-editor-state";
import type { UnitEditorActionState } from "@/features/landlord/unit-editor-state";
import { toBackendPhoneNumber } from "@/features/auth/phone";

async function requireAccessToken() {
  const tokens = await getSessionTokens();
  return tokens?.accessToken ?? null;
}

function buildPropertyPayload(formData: FormData): ApiPropertyUpsertRequest {
  const status = String(
    formData.get("status") ?? "active",
  ).trim() as ApiPropertyStatus;
  const totalUnitsRaw = String(formData.get("total_units") ?? "").trim();
  const totalUnits = Number(totalUnitsRaw);
  const city = String(formData.get("city") ?? "kinshasa").trim();
  const country = String(formData.get("country") ?? "RD CONGO").trim();
  const addressContent = String(formData.get("address_content") ?? "").trim();

  return {
    name: String(formData.get("name") ?? "").trim(),
    property_type: String(formData.get("property_type") ?? "apartment").trim(),
    status,
    address_content: addressContent,
    city,
    country,
    description: String(formData.get("description") ?? "").trim() || null,
    total_units: Number.isFinite(totalUnits) ? totalUnits : 0,
    currency:
      (String(formData.get("currency") ?? "USD").trim() || "USD") as ApiCurrency,
    is_active: status === "active" || status === "maintenance",
  };
}

function validatePropertyPayload(payload: ApiPropertyUpsertRequest) {
  const errors: string[] = [];

  if (!payload.name) {
    errors.push("Property name is required.");
  }

  if (!payload.address_content) {
    errors.push("Address is required.");
  }

  if (!payload.city) {
    errors.push("City is required.");
  }

  if (!payload.country) {
    errors.push("Country is required.");
  }

  if (!payload.total_units || payload.total_units < 1) {
    errors.push("Total units must be at least 1.");
  }

  return errors;
}

function buildUnitPayload(formData: FormData): ApiUnitCreateRequest {
  const property = String(formData.get("property") ?? "").trim();
  const rent = Number(String(formData.get("rent") ?? "").trim() || "0");

  return {
    property_id: property,
    unit_number: String(formData.get("unit_number") ?? "").trim(),
    unit_type:
      String(formData.get("unit_type") ?? "studio").trim() || undefined,
    rent: Number.isFinite(rent) ? rent : 0,
    currency: (String(formData.get("currency") ?? "").trim() || undefined) as
      | ApiCurrency
      | undefined,
    rental_periodicity: (String(
      formData.get("rental_periodicity") ?? "mensuel",
    ).trim() || "mensuel") as ApiRentalPeriodicity,
    description: String(formData.get("description") ?? "").trim() || null,
    is_furnished: String(formData.get("is_furnished") ?? "").trim() === "true",
  };
}

function validateUnitPayload(payload: ApiUnitCreateRequest) {
  if (!payload.property_id || !payload.unit_number || !payload.unit_type) {
    return "Le bien, le numéro d’unité et le type d’unité sont requis.";
  }

  if (payload.rent <= 0) {
    return "Le loyer doit être supérieur à zéro.";
  }

  return null;
}

function toOptionalDecimal(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function toOptionalInteger(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isInteger(parsed) ? parsed : null;
}

function buildUnitUpdatePayload(formData: FormData): ApiUnitUpdateRequest {
  const rent = Number(String(formData.get("rent") ?? "").trim() || "0");

  return {
    unit_number: String(formData.get("unit_number") ?? "").trim() || undefined,
    unit_type: String(formData.get("unit_type") ?? "").trim() || undefined,
    status: (String(formData.get("status") ?? "").trim() ||
      undefined) as ApiUnitStatus | undefined,
    rent: Number.isFinite(rent) ? rent : undefined,
    currency: (String(formData.get("currency") ?? "").trim() ||
      undefined) as ApiCurrency | undefined,
    rental_periodicity: (String(
      formData.get("rental_periodicity") ?? "",
    ).trim() || undefined) as ApiRentalPeriodicity | undefined,
    description: String(formData.get("description") ?? "").trim() || null,
    is_furnished: String(formData.get("is_furnished") ?? "").trim() === "true",
    is_active: String(formData.get("is_active") ?? "").trim() === "true",
    bedrooms: toOptionalInteger(formData.get("bedrooms")),
    bathrooms: toOptionalInteger(formData.get("bathrooms")),
    square_footage: toOptionalInteger(formData.get("square_footage")),
    floor_number: toOptionalInteger(formData.get("floor_number")),
    security_deposit: toOptionalDecimal(formData.get("security_deposit")),
    security_deposit_months_required: toOptionalInteger(
      formData.get("security_deposit_months_required"),
    ),
    booking_deposit: toOptionalDecimal(formData.get("booking_deposit")),
    allowed_payment_methods: [
      String(formData.get("payment_method_cash") ?? "").trim() === "true"
        ? "cash"
        : null,
      String(formData.get("payment_method_easypay") ?? "").trim() === "true"
        ? "easypay"
        : null,
      String(formData.get("payment_method_bank_transfer") ?? "").trim() ===
      "true"
        ? "bank_transfer"
        : null,
    ].filter((value): value is string => Boolean(value)),
    advance_payment_policy_text:
      String(formData.get("advance_payment_policy_text") ?? "").trim() || null,
  };
}

function validateUnitUpdatePayload(payload: ApiUnitUpdateRequest) {
  const errors: string[] = [];

  if (!payload.unit_number) {
    errors.push("Le numéro d’unité est requis.");
  }

  if (!payload.unit_type) {
    errors.push("Le type d’unité est requis.");
  }

  if ((payload.rent ?? 0) <= 0) {
    errors.push("Le loyer doit être supérieur à zéro.");
  }

  if (payload.security_deposit != null && payload.security_deposit < 0) {
    errors.push("Le dépôt de garantie ne peut pas être négatif.");
  }

  if (payload.booking_deposit != null && payload.booking_deposit < 0) {
    errors.push("L’acompte de réservation ne peut pas être négatif.");
  }

  if (
    payload.security_deposit_months_required != null &&
    payload.security_deposit_months_required < 0
  ) {
    errors.push(
      "Le nombre de mois de garantie requis ne peut pas être négatif.",
    );
  }

  return errors;
}

function buildLeasePayload(formData: FormData): ApiLeaseCreateRequest {
  return {
    tenant: String(formData.get("tenant") ?? "").trim(),
    unit: String(formData.get("unit") ?? "").trim(),
    start_date: String(formData.get("start_date") ?? "").trim(),
    end_date: String(formData.get("end_date") ?? "").trim(),
    move_in_date: String(formData.get("move_in_date") ?? "").trim() || null,
    monthly_rent: Number(
      String(formData.get("monthly_rent") ?? "").trim() || "0",
    ),
    security_deposit: toOptionalDecimal(formData.get("security_deposit")),
    security_deposit_months_taken:
      Number(String(formData.get("security_deposit_months_taken") ?? "").trim()) ||
      undefined,
    notes: String(formData.get("notes") ?? "").trim() || null,
    status: "draft",
  };
}

function validateLeasePayload(payload: ApiLeaseCreateRequest) {
  const errors: string[] = [];

  if (!payload.tenant) {
    errors.push("Le locataire est requis.");
  }

  if (!payload.unit) {
    errors.push("L’unité est requise.");
  }

  if (!payload.start_date) {
    errors.push("La date de début est requise.");
  }

  if (!payload.end_date) {
    errors.push("La date de fin est requise.");
  }

  if (payload.monthly_rent <= 0) {
    errors.push("Le loyer doit être supérieur à zéro.");
  }

  if (
    payload.start_date &&
    payload.end_date &&
    payload.end_date < payload.start_date
  ) {
    errors.push("La date de fin doit être postérieure à la date de début.");
  }

  if (
    payload.move_in_date &&
    payload.start_date &&
    payload.move_in_date < payload.start_date
  ) {
    errors.push(
      "La date d’entrée ne peut pas être antérieure à la date de début.",
    );
  }

  if (payload.security_deposit != null && payload.security_deposit < 0) {
    errors.push("Le dépôt de garantie ne peut pas être négatif.");
  }

  if (
    payload.security_deposit_months_taken != null &&
    payload.security_deposit_months_taken < 0
  ) {
    errors.push(
      "Le nombre de mois de garantie prélevés ne peut pas être négatif.",
    );
  }

  return errors;
}

function buildTenantProfilePayload(formData: FormData): FormData {
  const alternatePhone = toBackendPhoneNumber(
    String(formData.get("alternate_phone") ?? "").trim(),
  );
  const employmentStatusRaw = String(
    formData.get("employment_status") ?? "",
  ).trim();
  const maritalStatusRaw = String(formData.get("marital_status") ?? "").trim();
  const alternateEmail = String(formData.get("alternate_email") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const idCard = formData.get("id_card");
  const payload = new FormData();

  if (alternatePhone) {
    payload.append("alternate_phone", alternatePhone);
  }
  if (idCard instanceof File && idCard.size > 0) {
    payload.append("id_card", idCard);
  }
  if (alternateEmail) {
    payload.append("alternate_email", alternateEmail);
  }
  if (maritalStatusRaw) {
    payload.append("marital_status", maritalStatusRaw);
  }
  if (employmentStatusRaw) {
    payload.append(
      "employment_status",
      (employmentStatusRaw as ApiEmploymentStatus) ?? "",
    );
  }
  if (notes) {
    payload.append("notes", notes);
  }

  return payload;
}

function validateTenantPayload(formData: FormData) {
  const errors: string[] = [];
  const rawAlternatePhone = String(
    formData.get("alternate_phone") ?? "",
  ).trim();
  const alternatePhone = toBackendPhoneNumber(rawAlternatePhone);

  if (!alternatePhone) {
    errors.push(
      "Le numéro du locataire doit contenir les 9 derniers chiffres.",
    );
  }
  if (alternatePhone && alternatePhone.length > 15) {
    errors.push(
      "Le téléphone alternatif doit contenir au maximum 15 caractères.",
    );
  }

  return { errors };
}

export async function createPropertyAction(
  _: PropertyEditorActionState,
  formData: FormData,
): Promise<PropertyEditorActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return { error: "Aucune session bailleur authentifiée n’a été trouvée." };
  }

  const payload = buildPropertyPayload(formData);
  const validationErrors = validatePropertyPayload(payload);
  if (validationErrors.length > 0) {
    return {
      error: "Property details are incomplete or invalid.",
      errorDetails: validationErrors,
    };
  }

  let redirectPath: string | null = null;

  try {
    const property = await createProperty(payload, accessToken);
    revalidatePath("/landlord/properties");
    revalidatePath("/landlord/dashboard");
    redirectPath = `/landlord/properties/${property.id}`;
  } catch (error) {
    const globalError = buildGlobalApiError(error, {
      title: "Property Creation Failed",
      scope: "property-editor",
    });
    const formattedError = formatFormApiError(
      error,
      "Impossible de créer le bien pour le moment.",
    );
    return {
      error: globalError.message,
      errorDetails: formattedError.details,
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
    return { error: "Aucune session bailleur authentifiée n’a été trouvée." };
  }

  const propertyId = String(formData.get("propertyId") ?? "").trim();
  if (!propertyId) {
    return { error: "Property id is required." };
  }

  const payload = buildPropertyPayload(formData);
  const validationErrors = validatePropertyPayload(payload);
  if (validationErrors.length > 0) {
    return {
      error: "Property details are incomplete or invalid.",
      errorDetails: validationErrors,
    };
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
    const globalError = buildGlobalApiError(error, {
      title: "Property Update Failed",
      scope: "property-editor",
    });
    const formattedError = formatFormApiError(
      error,
      "Impossible de mettre à jour le bien pour le moment.",
    );
    return {
      error: globalError.message,
      errorDetails: formattedError.details,
    };
  }

  redirect(redirectPath);
}

export async function createUnitAction(
  _: UnitEditorActionState,
  formData: FormData,
): Promise<UnitEditorActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return { error: "No authenticated landlord session found." };
  }

  const payload = buildUnitPayload(formData);

  const validationError = validateUnitPayload(payload);
  if (validationError) {
    return { error: validationError, errorDetails: [validationError] };
  }

  let redirectPath: string | null = null;

  try {
    const unit = await createUnit(payload, accessToken);
    revalidatePath("/landlord/units");
    revalidatePath("/landlord/dashboard");
    revalidatePath("/landlord/properties");
    redirectPath = `/landlord/units/${unit.id}`;
  } catch (error) {
    const formattedError = formatFormApiError(
      error,
      "Impossible de créer l’unité pour le moment.",
    );
    return {
      error: formattedError.message,
      errorDetails: formattedError.details,
    };
  }

  redirect(redirectPath);
}

export async function updateUnitAction(
  unitId: string,
  _: UnitEditorActionState,
  formData: FormData,
): Promise<UnitEditorActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return { error: "Aucune session bailleur authentifiée n’a été trouvée." };
  }

  const payload = buildUnitUpdatePayload(formData);
  const validationErrors = validateUnitUpdatePayload(payload);
  if (validationErrors.length > 0) {
    return {
      error: "La configuration de l’unité est incomplète ou invalide.",
      errorDetails: validationErrors,
    };
  }

  try {
    await updateUnit(unitId, payload, accessToken);
    revalidatePath(`/landlord/units/${unitId}`);
    revalidatePath("/landlord/units");
    revalidatePath("/landlord/dashboard");
    revalidatePath("/landlord/properties");
    return { success: "Configuration enregistrée avec succès." };
  } catch (error) {
    const formattedError = formatFormApiError(
      error,
      "Impossible de mettre à jour l’unité pour le moment.",
    );
    return {
      error: formattedError.message,
      errorDetails: formattedError.details,
    };
  }
}

export async function createTenantAction(
  _: TenantEditorActionState,
  formData: FormData,
): Promise<TenantEditorActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return { error: "Aucune session bailleur authentifiée n’a été trouvée." };
  }

  const { errors } = validateTenantPayload(formData);
  if (errors.length > 0) {
    return {
      error: "Les informations du locataire sont incomplètes ou invalides.",
      errorDetails: errors,
    };
  }

  let redirectPath: string | null = null;

  try {
    const profile = await createTenantProfile(
      buildTenantProfilePayload(formData),
      accessToken,
    );

    revalidatePath("/landlord/tenants");
    revalidatePath("/landlord/dashboard");
    redirectPath = `/landlord/tenants/${profile.id}`;
  } catch (error) {
    const globalError = buildGlobalApiError(error, {
      title: "Échec de création du locataire",
      scope: "tenant-editor",
    });
    const formattedError = formatFormApiError(
      error,
      "Impossible de créer le locataire pour le moment.",
    );
    return {
      error: globalError.message,
      errorDetails: formattedError.details,
    };
  }

  redirect(redirectPath);
}

export async function createLeaseAction(
  _: LeaseEditorActionState,
  formData: FormData,
): Promise<LeaseEditorActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return { error: "Aucune session bailleur authentifiée n’a été trouvée." };
  }

  const payload = buildLeasePayload(formData);

  // console.log(payload)

  const validationErrors = validateLeasePayload(payload);
  if (validationErrors.length > 0) {
    return {
      error: "Les informations du bail sont incomplètes ou invalides.",
      errorDetails: validationErrors,
    };
  }

  let redirectPath: string | null = null;

  try {
    const lease = await createLease(payload, accessToken);
    revalidatePath("/landlord/leases");
    revalidatePath("/landlord/dashboard");
    revalidatePath("/landlord/tenants");
    revalidatePath("/landlord/units");
    redirectPath = `/landlord/leases/${lease.id}`;
  } catch (error) {
    const globalError = buildGlobalApiError(error, {
      title: "Échec de création du bail",
      scope: "lease-editor",
    });
    const formattedError = formatFormApiError(
      error,
      "Impossible de créer le bail pour le moment.",
    );
    return {
      error: globalError.message,
      errorDetails: formattedError.details,
    };
  }

  redirect(redirectPath);
}

export async function alertLeaseOverdueAction(
  _: LeaseOverdueActionState,
  formData: FormData,
): Promise<LeaseOverdueActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return {
      error: "Votre session a expiré. Reconnectez-vous pour envoyer une alerte.",
    };
  }

  const leaseId = String(formData.get("leaseId") ?? "").trim();
  if (!leaseId) {
    return {
      error: "Aucun bail n’a été sélectionné.",
      errorDetails: ["lease: requis"],
    };
  }

  try {
    const response = await alertLeaseOverdue(leaseId, accessToken);
    revalidatePath("/landlord/leases");
    revalidatePath(`/landlord/leases/${leaseId}`);
    revalidatePath("/landlord/dashboard");

    return {
      message:
        response.message ?? "L’alerte de retard a bien été enregistrée.",
    };
  } catch (error) {
    const formatted = formatFormApiError(
      error,
      "Impossible d’enregistrer l’alerte de retard pour ce bail.",
    );

    return {
      error: formatted.message,
      errorDetails: formatted.details,
    };
  }
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

  await renewLease(leaseId, { new_end_date: newEndDate }, accessToken).catch(
    () => null,
  );
  revalidatePath("/landlord/leases");
  revalidatePath(`/landlord/leases/${leaseId}`);
  revalidatePath("/landlord/dashboard");
}

export async function confirmPaymentAction(formData: FormData) {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return;
  }

  const paymentId = String(formData.get("paymentId") ?? "");
  if (!paymentId) {
    return;
  }

  await confirmPayment(paymentId, accessToken).catch(() => null);
  revalidatePath("/landlord/payments");
  revalidatePath(`/landlord/payments/${paymentId}`);
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

  await rejectBooking(bookingId, reason || undefined, accessToken).catch(
    () => null,
  );
  revalidatePath("/landlord/bookings");
  revalidatePath(`/landlord/bookings/${bookingId}`);
  revalidatePath("/landlord/dashboard");
}

export async function generatePaymentLinkAction(
  _: PaymentWorkflowActionState,
  formData: FormData,
): Promise<PaymentWorkflowActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return { error: "No authenticated landlord session found." };
  }

  const leaseId = String(formData.get("leaseId") ?? "").trim();
  const existingPaymentId = String(formData.get("paymentId") ?? "").trim();
  const gateway = String(formData.get("gateway") ?? "cash").trim() as
    | "cash"
    | "bank_transfer"
    | "easypay";
  const expiresInHours = Number(
    String(formData.get("expires_in_hours") ?? "48").trim() || "48",
  );
  const dueDate = String(formData.get("due_date") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!leaseId || !dueDate) {
    return {
      error: "Le bail et l’échéance sont requis.",
      errorDetails: [
        "bail : requis",
        "date d’échéance : requise",
      ],
    };
  }

  try {
    await getLeaseById(leaseId, accessToken);

    const payment =
      existingPaymentId ||
      (
        await createPayment(
          {
            lease: leaseId,
            due_date: dueDate,
            payment_method: gateway,
            notes: notes || undefined,
          },
          accessToken,
        )
      ).id;

    const link = await generatePaymentLink(
      payment,
      { gateway, expires_in_hours: expiresInHours },
      accessToken,
    );

    revalidatePath("/landlord/payments");

    return {
      message: "Le lien de paiement a été généré avec succès.",
      paymentId: String(payment),
      linkUrl: link.link_url,
      gatewayUrl: link.gateway_url,
      gatewayReference: link.gateway_reference,
      expiresAt: link.expires_at,
    };
  } catch (error) {
    const formattedError = formatFormApiError(
      error,
      "Impossible de générer le lien de paiement pour le moment.",
    );
    return {
      error: formattedError.message,
      errorDetails: formattedError.details,
    };
  }
}

export async function generatePaymentLinkForPaymentAction(
  _: PaymentWorkflowActionState,
  formData: FormData,
): Promise<PaymentWorkflowActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return { error: "Aucune session bailleur authentifiée n’a été trouvée." };
  }

  const paymentId = String(formData.get("paymentId") ?? "").trim();
  const gateway = String(formData.get("gateway") ?? "cash").trim() as
    | "cash"
    | "bank_transfer"
    | "easypay";
  const expiresInHours = Number(
    String(formData.get("expires_in_hours") ?? "48").trim() || "48",
  );

  if (!paymentId) {
    return {
      error: "Aucun paiement n’a été sélectionné.",
      errorDetails: ["paiement : requis"],
    };
  }

  try {
    const link = await generatePaymentLink(
      paymentId,
      { gateway, expires_in_hours: expiresInHours },
      accessToken,
    );

    revalidatePath("/landlord/payments");
    revalidatePath(`/landlord/payments/${paymentId}`);

    return {
      message: "Le lien de paiement est prêt à être partagé.",
      paymentId,
      linkUrl: link.link_url,
      gatewayUrl: link.gateway_url,
      gatewayReference: link.gateway_reference,
      expiresAt: link.expires_at,
    };
  } catch (error) {
    const formattedError = formatFormApiError(
      error,
      "Impossible de générer le lien de paiement pour ce paiement.",
    );
    return {
      error: formattedError.message,
      errorDetails: formattedError.details,
    };
  }
}

export async function sendPaymentReminderAction(
  _: PaymentWorkflowActionState,
  formData: FormData,
): Promise<PaymentWorkflowActionState> {
  const accessToken = await requireAccessToken();
  if (!accessToken) {
    return { error: "Aucune session bailleur authentifiée n’a été trouvée." };
  }

  const paymentId = String(formData.get("paymentId") ?? "").trim();
  const reminderStyle = String(formData.get("reminder_style") ?? "soft").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!paymentId) {
    return {
      error: "Un paiement doit être sélectionné avant l’envoi du rappel.",
      errorDetails: ["paiement : requis"],
    };
  }

  try {
    const response = await sendPaymentReminders(
      {
        payment_ids: [paymentId],
        reminder_style: reminderStyle,
        message,
      },
      accessToken,
    );

    revalidatePath("/landlord/payments");

    return {
      message:
        response.message ??
        response.detail ??
        "Le rappel a été envoyé avec succès.",
    };
  } catch (error) {
    const formattedError = formatFormApiError(
      error,
      "Impossible d’envoyer le rappel pour le moment.",
    );
    return {
      error: formattedError.message,
      errorDetails: formattedError.details,
    };
  }
}

export async function checkLandlordEasyPayStatusAction(
  _: LandlordEasyPayActionState,
  formData: FormData,
): Promise<LandlordEasyPayActionState> {
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
      errorDetails: ["paiement : requis"],
    };
  }

  try {
    const response = await checkEasyPayStatus(paymentId, accessToken);

    revalidatePath("/landlord/payments");
    revalidatePath(`/landlord/payments/${paymentId}`);
    revalidatePath("/landlord/dashboard");

    return {
      message: response.easypay_status?.status
        ? `Statut EasyPay synchronisé : ${response.easypay_status.status}.`
        : "Le statut EasyPay a été synchronisé avec le serveur.",
      easypayStatus: response.easypay_status?.status ?? response.status,
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
