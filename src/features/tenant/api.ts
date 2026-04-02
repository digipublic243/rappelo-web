import { createBooking, listBookings } from "@/lib/api/bookings";
import { getCurrentUser, getShellProfile } from "@/lib/api/accounts";
import { getLeasePaymentSchedule, listLeases } from "@/lib/api/leases";
import { listPayments } from "@/lib/api/payments";
import {
  listAvailableUnits,
  listProperties,
  listUnits,
} from "@/lib/api/properties";
import { getSessionTokens } from "@/lib/api/session";
import {
  getTenantDashboard,
  listTenantNotifications,
  listTenantProfiles,
} from "@/lib/api/tenants";
import { formatFormApiError } from "@/lib/api/errors";
import type { PaymentDetailVm, TenantDashboardVm } from "@/types/view-models";
import {
  mapApiBookingToDomain,
  mapApiLeaseToDomain,
  mapApiPaymentToDomain,
  mapApiPropertyToDomain,
  mapApiUnitToDomain,
} from "@/features/tenant/mappers";

function errorMeta(warning: string) {
  return { source: "error" as const, warning };
}

async function buildTenantDomainData() {
  const tokens = await getSessionTokens();
  if (!tokens?.accessToken) {
    return {
      profileName: "Tenant",
      currentLease: undefined,
      currentUnit: undefined,
      currentProperty: undefined,
      payments: [],
      leases: [],
      notifications: [],
      residenceImage: undefined,
      heroBanner: undefined,
      automaticPaymentsEnabled: undefined,
      nextDuePayment: undefined,
      quickStats: undefined,
      meta: errorMeta(
        "No authenticated tenant session found. Sign in to load live data.",
      ),
      units: [],
      properties: [],
      accessToken: null,
      profileId: null,
      tenantActorId: null,
    };
  }

  const [
    user,
    shellProfile,
    profiles,
    leases,
    payments,
    units,
    properties,
    tenantDashboard,
    notifications,
  ] = await Promise.all([
    getCurrentUser(tokens.accessToken).catch(() => null),
    getShellProfile(tokens.accessToken).catch(() => null),
    listTenantProfiles(tokens.accessToken).catch(() => null),
    listLeases(tokens.accessToken).catch(() => null),
    listPayments(tokens.accessToken).catch(() => null),
    listUnits(tokens.accessToken).catch(() => null),
    listProperties(tokens.accessToken).catch(() => null),
    getTenantDashboard(tokens.accessToken).catch(() => null),
    listTenantNotifications(tokens.accessToken, { unreadOnly: true }).catch(
      () => [],
    ),
  ]);

  if (!user || !profiles || !leases || !payments || !units || !properties) {
    return {
      profileName: "Tenant",
      currentLease: undefined,
      currentUnit: undefined,
      currentProperty: undefined,
      payments: [],
      leases: [],
      notifications: [],
      residenceImage: tenantDashboard?.residence_image,
      heroBanner: tenantDashboard?.hero_banner,
      automaticPaymentsEnabled: tenantDashboard?.automatic_payments_enabled,
      nextDuePayment: tenantDashboard?.next_due_payment
        ? mapApiPaymentToDomain(tenantDashboard.next_due_payment)
        : undefined,
      quickStats: tenantDashboard?.quick_stats,
      meta: errorMeta(
        "Some tenant endpoints failed to load. The UI is showing no data instead of static fallback.",
      ),
      units: [],
      properties: [],
      accessToken: tokens.accessToken,
      profileId: null,
      tenantActorId: user ? String(user.id) : null,
    };
  }

  const currentProfile =
    profiles.find((profile) => profile.user?.id === user.id) ??
    profiles.find(
      (profile) =>
        (profile.user_phone_number &&
          profile.user_phone_number === user.phone_number) ||
        (profile.alternate_phone &&
          profile.alternate_phone === user.phone_number),
    ) ??
    (profiles.length === 1 ? profiles[0] : undefined);
  if (!currentProfile) {
    return {
      profileName: shellProfile?.full_name || user.full_name || "Tenant",
      currentLease: undefined,
      currentUnit: undefined,
      currentProperty: undefined,
      payments: [],
      leases: [],
      notifications: notifications.map((notification) => ({
        id: String(notification.id),
        title: notification.title ?? notification.type ?? "Notification",
        message:
          notification.message ?? notification.body ?? "No message provided.",
        createdAt: notification.created_at,
        isRead: Boolean(notification.is_read),
      })),
      residenceImage: tenantDashboard?.residence_image,
      heroBanner: tenantDashboard?.hero_banner,
      automaticPaymentsEnabled: tenantDashboard?.automatic_payments_enabled,
      nextDuePayment: tenantDashboard?.next_due_payment
        ? mapApiPaymentToDomain(tenantDashboard.next_due_payment)
        : undefined,
      quickStats: tenantDashboard?.quick_stats,
      meta: errorMeta("No tenant profile is linked to the current user."),
      units: units.map((unit) => mapApiUnitToDomain(unit)),
      properties: properties.map((property) => mapApiPropertyToDomain(property)),
      accessToken: tokens.accessToken,
      profileId: null,
      tenantActorId: String(user.id),
    };
  }

  const tenantActorId =
    currentProfile.user?.id != null
      ? String(currentProfile.user.id)
      : String(user.id);

  const tenantLeasesApi = leases
    .filter((lease) => String(lease.tenant) === tenantActorId)
    .map(mapApiLeaseToDomain)
    .map((lease) => {
      const unit = units.find((item) => String(item.id) === lease.unitId);
      return { ...lease, propertyId: unit ? String(unit.property) : "" };
    });

  const tenantPaymentsApi = payments
    .filter(
      (payment) => String(payment.tenant_id ?? payment.tenant) === tenantActorId,
    )
    .map(mapApiPaymentToDomain)
    .map((payment) => {
      const lease = tenantLeasesApi.find((item) => item.id === payment.leaseId);
      return { ...payment, unitId: lease?.unitId ?? "" };
    });

  const currentLease =
    tenantLeasesApi.find((lease) => lease.status === "active") ??
    tenantLeasesApi[0];
  const currentUnit = currentLease
    ? units.find((unit) => String(unit.id) === currentLease.unitId)
    : undefined;
  const currentProperty = currentUnit
    ? properties.find(
        (property) => String(property.id) === String(currentUnit.property),
      )
    : undefined;

  return {
    profileName: shellProfile?.full_name || user.full_name || "Tenant",
    leases: tenantLeasesApi,
    payments: tenantPaymentsApi,
    currentLease,
    currentUnit: currentUnit
      ? mapApiUnitToDomain(currentUnit, user.full_name)
      : undefined,
    currentProperty: currentProperty
      ? mapApiPropertyToDomain(currentProperty)
      : undefined,
    notifications: notifications.map((notification) => ({
      id: String(notification.id),
      title: notification.title ?? notification.type ?? "Notification",
      message:
        notification.message ?? notification.body ?? "No message provided.",
      createdAt: notification.created_at,
      isRead: Boolean(notification.is_read),
    })),
    residenceImage: tenantDashboard?.residence_image,
    heroBanner: tenantDashboard?.hero_banner,
    automaticPaymentsEnabled: tenantDashboard?.automatic_payments_enabled,
    nextDuePayment: tenantDashboard?.next_due_payment
      ? mapApiPaymentToDomain(tenantDashboard.next_due_payment)
      : undefined,
    quickStats: tenantDashboard?.quick_stats,
    meta: { source: "api" as const },
    units: units.map((unit) => mapApiUnitToDomain(unit, user.full_name)),
    properties: properties.map((property) => mapApiPropertyToDomain(property)),
    accessToken: tokens.accessToken,
    profileId: String(currentProfile.id),
    tenantActorId,
  };
}

export async function getTenantDashboardVm(): Promise<TenantDashboardVm> {
  const domainData = await buildTenantDomainData();
  return {
    profileName: domainData.profileName,
    currentLease: domainData.currentLease,
    currentUnit: domainData.currentUnit,
    currentProperty: domainData.currentProperty,
    payments: domainData.payments,
    leases: domainData.leases,
    notifications: domainData.notifications,
    residenceImage: domainData.residenceImage,
    heroBanner: domainData.heroBanner,
    automaticPaymentsEnabled: domainData.automaticPaymentsEnabled,
    nextDuePayment: domainData.nextDuePayment,
    quickStats: domainData.quickStats,
    meta: domainData.meta,
  };
}

export async function getTenantLeasesData() {
  const domainData = await buildTenantDomainData();
  return { leases: domainData.leases, meta: domainData.meta };
}

export async function getTenantPaymentsData() {
  const domainData = await buildTenantDomainData();
  return { payments: domainData.payments, meta: domainData.meta };
}

export async function getTenantPaymentDetailVm(
  paymentId: string,
): Promise<PaymentDetailVm | null> {
  const domainData = await buildTenantDomainData();
  const payment = domainData.payments.find((item) => item.id === paymentId);

  if (!payment) {
    return null;
  }

  const lease = domainData.leases.find((item) => item.id === payment.leaseId);
  const unit = domainData.units.find((item) => item.id === payment.unitId);
  const property = domainData.properties.find(
    (item) => item.id === (lease?.propertyId ?? unit?.propertyId),
  );

  return {
    payment,
    lease,
    unit: unit ?? domainData.currentUnit,
    property: property ?? domainData.currentProperty,
    meta: domainData.meta,
  };
}

export async function getTenantBookStayData() {
  const domainData = await buildTenantDomainData();

  if (!domainData.accessToken) {
    return { units: [], meta: domainData.meta };
  }

  const availableUnits = await listAvailableUnits(domainData.accessToken).catch(
    () => null,
  );
  if (!availableUnits) {
    return {
      units: [],
      meta: errorMeta("Unable to load available units from the API."),
    };
  }

  return {
    units: availableUnits.map((unit) => mapApiUnitToDomain(unit)),
    meta: { source: "api" as const },
  };
}

export async function getTenantBookingsData() {
  const domainData = await buildTenantDomainData();

  if (!domainData.accessToken) {
    return { bookings: [], meta: domainData.meta };
  }

  const bookings = await listBookings(domainData.accessToken).catch(() => null);
  if (!bookings) {
    return {
      bookings: [],
      meta: errorMeta("Unable to load tenant bookings from the API."),
    };
  }

  const filteredBookings = domainData.tenantActorId
    ? bookings.filter(
        (booking) =>
          String(booking.tenant ?? "") === domainData.tenantActorId,
      )
    : bookings;

  return {
    bookings:
      (filteredBookings.length > 0 ? filteredBookings : bookings)?.map?.(
        mapApiBookingToDomain,
      ) || [],
    meta: { source: "api" as const },
  };
}

export async function getTenantLeaseDetailVm(leaseId: string) {
  const domainData = await buildTenantDomainData();
  const lease = domainData.leases.find((item) => item.id === leaseId);

  if (!lease) {
    return null;
  }

  const paymentSchedule =
    domainData.accessToken != null
      ? await getLeasePaymentSchedule(leaseId, domainData.accessToken).catch(
          () => [],
        )
      : [];

  return {
    lease,
    unit:
      domainData.units.find((item) => item.id === lease.unitId) ??
      domainData.currentUnit,
    property:
      domainData.properties.find((item) => item.id === lease.propertyId) ??
      domainData.currentProperty,
    paymentSchedule: paymentSchedule.map((item, index) => ({
      id: String(item.id ?? `${leaseId}-${index}`),
      dueDate: String(item.due_date ?? lease.startDate),
      amount: Number(item.amount ?? lease.rentAmount) || lease.rentAmount,
      status: item.status,
      label: item.label ?? item.name ?? `Échéance ${index + 1}`,
    })),
    meta: domainData.meta,
  };
}

export async function submitTenantBooking(input: {
  unitId: string;
  checkIn: string;
  checkOut: string;
  preferredMoveInTime?: string;
  occupantsCount?: number;
  adultsCount?: number;
  childrenCount?: number;
  hasPets?: boolean;
  petDetails?: string;
  monthlyIncomeEstimate?: string;
  employmentStatusSnapshot?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  idDocumentUrl?: string;
  selfieUrl?: string;
  stayPurpose?: string;
  specialRequests?: string;
  sourceChannel?: string;
  bookingDeposit?: number;
  notes?: string;
}) {
  const tokens = await getSessionTokens();
  if (!tokens?.accessToken) {
    return {
      ok: false as const,
      error: "No authenticated tenant session found.",
    };
  }

  try {
    await createBooking(
      {
        unit: input.unitId,
        check_in: input.checkIn,
        check_out: input.checkOut,
        preferred_move_in_time: input.preferredMoveInTime,
        occupants_count: input.occupantsCount,
        adults_count: input.adultsCount,
        children_count: input.childrenCount,
        has_pets: input.hasPets,
        pet_details: input.petDetails,
        monthly_income_estimate: input.monthlyIncomeEstimate,
        employment_status_snapshot: input.employmentStatusSnapshot,
        emergency_contact_name: input.emergencyContactName,
        emergency_contact_phone: input.emergencyContactPhone,
        id_document_url: input.idDocumentUrl,
        selfie_url: input.selfieUrl,
        stay_purpose: input.stayPurpose,
        special_requests: input.specialRequests,
        source_channel: input.sourceChannel,
        booking_deposit: input.bookingDeposit,
        notes: input.notes,
      },
      tokens.accessToken,
    );

    return { ok: true as const };
  } catch (error) {
    const formattedError = formatFormApiError(
      error,
      "Unable to submit booking.",
    );
    return {
      ok: false as const,
      error: formattedError.message,
      errorDetails: formattedError.details,
    };
  }
}
