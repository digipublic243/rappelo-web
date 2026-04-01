import { getCurrentUser, getUserById } from "@/lib/api/accounts";
import { getBookingById, listBookings } from "@/lib/api/bookings";
import { getLeaseById, listLeases } from "@/lib/api/leases";
import { getPaymentSummary, listPayments } from "@/lib/api/payments";
import { getEnrichedPropertyById, getPropertyById, getPropertyFinancials, getUnitById, listProperties, listUnits } from "@/lib/api/properties";
import { getSessionTokens } from "@/lib/api/session";
import { getTenantProfileById, listTenantProfiles } from "@/lib/api/tenants";
import type { ApiEnrichedProperty } from "@/types/api";
import type {
  BookingDetailVm,
  LandlordDashboardVm,
  LeaseDetailVm,
  PaymentsPageVm,
  PropertyDetailVm,
  TenantDetailVm,
  UnitDetailVm,
} from "@/types/view-models";
import {
  mapApiBookingToDomain,
  mapApiLeaseToDomain,
  mapApiPaymentToDomain,
  mapApiPropertyToDomain,
  mapApiUnitToDomain,
  mapTenantAggregateToDomain,
} from "@/features/landlord/mappers";

async function getAccessTokenForServer() {
  const tokens = await getSessionTokens();
  return tokens?.accessToken ?? null;
}

function errorMeta(warning: string) {
  return { source: "error" as const, warning };
}

async function buildLandlordDomainData() {
  const accessToken = await getAccessTokenForServer();
  if (!accessToken) {
    return {
      properties: [],
      units: [],
      leases: [],
      payments: [],
      tenants: [],
      bookings: [],
      meta: errorMeta("No authenticated landlord session found. Sign in to load live data."),
    };
  }

  const user = await getCurrentUser(accessToken).catch(() => null);
  if (!user || user.role !== "landlord") {
    return {
      properties: [],
      units: [],
      leases: [],
      payments: [],
      tenants: [],
      bookings: [],
      meta: errorMeta("Current session is not authorized for the landlord data scope."),
    };
  }

  const [properties, units, leases, payments, tenantProfiles, bookings] = await Promise.all([
    listProperties(accessToken).catch(() => null),
    listUnits(accessToken).catch(() => null),
    listLeases(accessToken).catch(() => null),
    listPayments(accessToken).catch(() => null),
    listTenantProfiles(accessToken).catch(() => null),
    listBookings(accessToken).catch(() => []),
  ]);

  if (!properties || !units || !leases || !payments || !tenantProfiles) {
    return {
      properties: [],
      units: [],
      leases: [],
      payments: [],
      tenants: [],
      bookings: [],
      meta: errorMeta("Some landlord endpoints failed to load. The UI is showing no data instead of static fallback."),
    };
  }

  const propertyFinancials = new Map<string, Awaited<ReturnType<typeof getPropertyFinancials>> | null>();
  await Promise.all(
    properties.map(async (property) => {
      const financials = await getPropertyFinancials(property.id, accessToken).catch(() => null);
      propertyFinancials.set(String(property.id), financials);
    }),
  );

  const propertyDomains = properties.map((property) =>
    mapApiPropertyToDomain(property, units, propertyFinancials.get(String(property.id)) ?? null),
  );
  const leaseDomains = leases.map(mapApiLeaseToDomain);
  const paymentDomains = payments.map(mapApiPaymentToDomain);
  const bookingDomains = bookings.map(mapApiBookingToDomain);
  const usersById = new Map<number, Awaited<ReturnType<typeof getUserById>> | null>();

  await Promise.all(
    tenantProfiles.map(async (profile) => {
      const tenantUser = await getUserById(profile.user, accessToken).catch(() => null);
      usersById.set(profile.user, tenantUser);
    }),
  );

  const unitTenantNames = new Map<string, string>();
  const tenantDomains = tenantProfiles.map((profile) => {
    const tenantLeases = leaseDomains
      .filter((lease) => lease.tenantId === String(profile.id))
      .map((lease) => {
        const unit = units.find((item) => String(item.id) === lease.unitId);
        return unit ? { ...lease, propertyId: String(unit.property) } : lease;
      });
    const tenantPayments = paymentDomains.filter((payment) => payment.tenantId === String(profile.id));
    const tenant = mapTenantAggregateToDomain({
      profile,
      user: usersById.get(profile.user) ?? null,
      leases: tenantLeases,
      payments: tenantPayments,
    });

    if (tenant.unitId) {
      unitTenantNames.set(tenant.unitId, tenant.fullName);
    }

    return tenant;
  });

  const unitDomains = units.map((unit) => mapApiUnitToDomain(unit, unitTenantNames.get(String(unit.id))));
  const enrichedPayments = paymentDomains.map((payment) => {
    const lease = leaseDomains.find((item) => item.id === payment.leaseId);
    return {
      ...payment,
      unitId: lease?.unitId ?? "",
    };
  });
  const enrichedLeases = leaseDomains.map((lease) => {
    const unit = unitDomains.find((item) => item.id === lease.unitId);
    return { ...lease, propertyId: unit?.propertyId ?? "" };
  });

  return {
    properties: propertyDomains,
    units: unitDomains,
    leases: enrichedLeases,
    payments: enrichedPayments,
    tenants: tenantDomains,
    bookings: bookingDomains,
    meta: { source: "api" as const },
  };
}

export async function getLandlordDashboardVm(): Promise<LandlordDashboardVm> {
  const domainData = await buildLandlordDomainData();

  return {
    kpis: {
      properties: domainData.properties.length,
      occupiedUnits: domainData.units.filter((unit) => unit.status === "occupied").length,
      activeLeases: domainData.leases.filter((lease) => lease.status === "active").length,
      pendingBookings: domainData.bookings.filter((booking) => booking.status === "new" || booking.status === "in_review").length,
      pendingPayments: domainData.payments.filter((payment) => payment.status === "pending").length,
      tenants: domainData.tenants.length,
    },
    properties: domainData.properties,
    units: domainData.units,
    leases: domainData.leases,
    payments: domainData.payments,
    bookings: domainData.bookings,
    meta: domainData.meta,
  };
}

export async function getLandlordPropertiesData() {
  const domainData = await buildLandlordDomainData();
  return { properties: domainData.properties, meta: domainData.meta };
}

export async function getLandlordPropertyDetailVm(propertyId: string): Promise<PropertyDetailVm | null> {
  const accessToken = await getAccessTokenForServer();
  if (!accessToken) {
    return null;
  }

  const [property, units] = await Promise.all([
    getEnrichedPropertyById(propertyId, accessToken)
      .catch(() => getPropertyById(propertyId, accessToken).catch(() => null)),
    listUnits(accessToken).catch(() => null),
  ]);

  if (!property || !units) {
    return null;
  }

  const financials = await getPropertyFinancials(propertyId, accessToken).catch(() => null);
  const propertyDomain = mapApiPropertyToDomain(property, units, financials);
  const unitDomains = units.filter((unit) => String(unit.property) === String(property.id)).map((unit) => mapApiUnitToDomain(unit));
  const enrichedProperty = property as ApiEnrichedProperty;

  return {
    property: propertyDomain,
    units: unitDomains,
    details: {
      propertyType: property.property_type,
      status: property.status,
      addressLine2: property.address_line_2 ?? null,
      state: property.state,
      postalCode: property.postal_code,
      country: property.country,
      description: property.description ?? null,
      yearBuilt: property.year_built ?? null,
      squareFootage: property.square_footage ?? null,
      purchasePrice: property.purchase_price ?? financials?.purchase_price ?? null,
      currentValue: property.current_value ?? financials?.current_value ?? null,
      occupancyRate: financials?.occupancy_rate ?? null,
      vacantUnits: financials?.vacant_units ?? null,
      amenities: (enrichedProperty.amenities ?? []).map((item) => item.label ?? item.name ?? "").filter(Boolean),
      facilities: (enrichedProperty.facilities ?? []).map((item) => item.label ?? item.name ?? "").filter(Boolean),
      mediaGallery: (enrichedProperty.media_gallery ?? [])
        .map((item) => item.image_url ?? item.url ?? item.file ?? "")
        .filter(Boolean),
      brandTier: enrichedProperty.branding?.tier ?? enrichedProperty.branding?.brand_tier ?? null,
    },
    meta: { source: "api" },
  };
}

export async function getLandlordUnitsData() {
  const domainData = await buildLandlordDomainData();
  return { units: domainData.units, meta: domainData.meta };
}

export async function getLandlordUnitDetailVm(unitId: string): Promise<UnitDetailVm | null> {
  const domainData = await buildLandlordDomainData();
  const unit = domainData.units.find((item) => item.id === unitId);
  if (!unit) {
    return null;
  }

  return {
    unit,
    payments: domainData.payments.filter((payment) => payment.unitId === unitId),
    meta: domainData.meta,
  };
}

export async function getLandlordTenantsData() {
  const domainData = await buildLandlordDomainData();
  return { tenants: domainData.tenants, meta: domainData.meta };
}

export async function getLandlordTenantDetailVm(tenantId: string): Promise<TenantDetailVm | null> {
  const domainData = await buildLandlordDomainData();
  const tenant = domainData.tenants.find((item) => item.id === tenantId);
  if (!tenant) {
    return null;
  }

  return {
    tenant,
    lease: domainData.leases.find((item) => item.tenantId === tenantId),
    payments: domainData.payments.filter((item) => item.tenantId === tenantId),
    meta: domainData.meta,
  };
}

export async function getLandlordLeasesData() {
  const domainData = await buildLandlordDomainData();
  return { leases: domainData.leases, meta: domainData.meta };
}

export async function getLandlordLeaseDetailVm(leaseId: string): Promise<LeaseDetailVm | null> {
  const accessToken = await getAccessTokenForServer();
  if (!accessToken) {
    return null;
  }

  const apiLease = await getLeaseById(leaseId, accessToken).catch(() => null);
  if (!apiLease) {
    return null;
  }

  const lease = mapApiLeaseToDomain(apiLease);
  const unit = await getUnitById(apiLease.unit, accessToken).catch(() => null);
  const tenantProfile = await getTenantProfileById(apiLease.tenant, accessToken).catch(() => null);
  const tenantUser = tenantProfile ? await getUserById(tenantProfile.user, accessToken).catch(() => null) : null;

  return {
    lease: {
      ...lease,
      propertyId: unit ? String(unit.property) : "",
    },
    unit: unit ? mapApiUnitToDomain(unit) : undefined,
    tenant: tenantProfile
      ? mapTenantAggregateToDomain({
          profile: tenantProfile,
          user: tenantUser,
          leases: [lease],
          payments: [],
        })
      : undefined,
    meta: { source: "api" },
  };
}

export async function getLandlordPaymentsVm(): Promise<PaymentsPageVm> {
  const domainData = await buildLandlordDomainData();
  const accessToken = await getAccessTokenForServer();
  const summary = accessToken ? await getPaymentSummary(accessToken).catch(() => null) : null;
  return {
    payments: domainData.payments,
    tenants: domainData.tenants,
    leases: domainData.leases,
    summary: summary
      ? {
          totalPaid: summary.total_paid,
          totalPending: summary.total_pending,
          totalOverdue: summary.total_overdue,
          countPaid: summary.count_paid,
          countPending: summary.count_pending,
          countOverdue: summary.count_overdue,
        }
      : undefined,
    meta: domainData.meta,
  };
}

export async function getLandlordReportsData() {
  const domainData = await buildLandlordDomainData();
  return {
    properties: domainData.properties,
    leases: domainData.leases,
    payments: domainData.payments,
    meta: domainData.meta,
  };
}

export async function getLandlordPaymentWorkflowData() {
  const [domainData, paymentsVm] = await Promise.all([buildLandlordDomainData(), getLandlordPaymentsVm()]);
  return {
    payments: domainData.payments,
    leases: domainData.leases,
    tenants: domainData.tenants,
    summary: paymentsVm.summary,
    meta: domainData.meta,
  };
}

export async function getLandlordBookingsData() {
  const domainData = await buildLandlordDomainData();
  return {
    bookings: domainData.bookings,
    meta: domainData.meta,
  };
}

export async function getLandlordBookingDetail(bookingId: string): Promise<BookingDetailVm | null> {
  const accessToken = await getAccessTokenForServer();
  if (!accessToken) {
    return null;
  }

  const booking = await getBookingById(bookingId, accessToken).catch(() => null);
  if (!booking) {
    return null;
  }

  const domainData = await buildLandlordDomainData();
  const mappedBooking = mapApiBookingToDomain(booking);
  const tenant = domainData.tenants.find((item) => item.id === mappedBooking.tenantId);
  const property = domainData.properties.find((item) => item.id === mappedBooking.propertyId);
  const unit = domainData.units.find((item) => item.id === mappedBooking.unitId);

  return {
    booking: mappedBooking,
    tenant,
    property,
    unit,
    meta: { source: "api" as const },
  };
}
