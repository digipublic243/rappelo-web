import { createBooking, listBookings } from "@/lib/api/bookings";
import { getCurrentUser } from "@/lib/api/accounts";
import { listLeases } from "@/lib/api/leases";
import { listPayments } from "@/lib/api/payments";
import { listAvailableUnits, listProperties, listUnits } from "@/lib/api/properties";
import { getSessionTokens } from "@/lib/api/session";
import { listTenantProfiles } from "@/lib/api/tenants";
import type { TenantDashboardVm } from "@/types/view-models";
import { mapApiBookingToDomain, mapApiLeaseToDomain, mapApiPaymentToDomain, mapApiPropertyToDomain, mapApiUnitToDomain } from "@/features/tenant/mappers";

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
      meta: errorMeta("No authenticated tenant session found. Sign in to load live data."),
      accessToken: null,
      profileId: null,
    };
  }

  const [user, profiles, leases, payments, units, properties] = await Promise.all([
    getCurrentUser(tokens.accessToken).catch(() => null),
    listTenantProfiles(tokens.accessToken).catch(() => null),
    listLeases(tokens.accessToken).catch(() => null),
    listPayments(tokens.accessToken).catch(() => null),
    listUnits(tokens.accessToken).catch(() => null),
    listProperties(tokens.accessToken).catch(() => null),
  ]);

  if (!user || !profiles || !leases || !payments || !units || !properties) {
    return {
      profileName: "Tenant",
      currentLease: undefined,
      currentUnit: undefined,
      currentProperty: undefined,
      payments: [],
      leases: [],
      meta: errorMeta("Some tenant endpoints failed to load. The UI is showing no data instead of static fallback."),
      accessToken: tokens.accessToken,
      profileId: null,
    };
  }

  const currentProfile = profiles.find((profile) => profile.user === user.id);
  if (!currentProfile) {
    return {
      profileName: user.full_name || "Tenant",
      currentLease: undefined,
      currentUnit: undefined,
      currentProperty: undefined,
      payments: [],
      leases: [],
      meta: errorMeta("No tenant profile is linked to the current user."),
      accessToken: tokens.accessToken,
      profileId: null,
    };
  }

  const tenantLeasesApi = leases
    .filter((lease) => String(lease.tenant) === String(currentProfile.id))
    .map(mapApiLeaseToDomain)
    .map((lease) => {
      const unit = units.find((item) => String(item.id) === lease.unitId);
      return { ...lease, propertyId: unit ? String(unit.property) : "" };
    });

  const tenantPaymentsApi = payments
    .filter((payment) => String(payment.tenant) === String(currentProfile.id))
    .map(mapApiPaymentToDomain)
    .map((payment) => {
      const lease = tenantLeasesApi.find((item) => item.id === payment.leaseId);
      return { ...payment, unitId: lease?.unitId ?? "" };
    });

  const currentLease = tenantLeasesApi.find((lease) => lease.status === "active") ?? tenantLeasesApi[0];
  const currentUnit = currentLease ? units.find((unit) => String(unit.id) === currentLease.unitId) : undefined;
  const currentProperty = currentUnit ? properties.find((property) => String(property.id) === String(currentUnit.property)) : undefined;

  return {
    profileName: user.full_name || "Tenant",
    leases: tenantLeasesApi,
    payments: tenantPaymentsApi,
    currentLease,
    currentUnit: currentUnit ? mapApiUnitToDomain(currentUnit, user.full_name) : undefined,
    currentProperty: currentProperty ? mapApiPropertyToDomain(currentProperty) : undefined,
    meta: { source: "api" as const },
    accessToken: tokens.accessToken,
    profileId: String(currentProfile.id),
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

export async function getTenantBookStayData() {
  const domainData = await buildTenantDomainData();

  if (!domainData.accessToken) {
    return { units: [], meta: domainData.meta };
  }

  const availableUnits = await listAvailableUnits(domainData.accessToken).catch(() => null);
  if (!availableUnits) {
    return { units: [], meta: errorMeta("Unable to load available units from the API.") };
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
    return { bookings: [], meta: errorMeta("Unable to load tenant bookings from the API.") };
  }

  const filteredBookings = domainData.profileId
    ? bookings.filter((booking) => String(booking.tenant ?? "") === domainData.profileId)
    : [];

  return {
    bookings: filteredBookings.map(mapApiBookingToDomain),
    meta: { source: "api" as const },
  };
}

export async function submitTenantBooking(input: {
  unitId: string;
  checkIn: string;
  checkOut: string;
  bookingDeposit?: number;
  notes?: string;
}) {
  const tokens = await getSessionTokens();
  if (!tokens?.accessToken) {
    return { ok: false as const, error: "No authenticated tenant session found." };
  }

  try {
    await createBooking(
      {
        unit: input.unitId,
        check_in: input.checkIn,
        check_out: input.checkOut,
        booking_deposit: input.bookingDeposit,
        notes: input.notes,
      },
      tokens.accessToken,
    );

    return { ok: true as const };
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : "Unable to submit booking." };
  }
}
