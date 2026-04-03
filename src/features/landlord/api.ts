import { getCurrentUser } from "@/lib/api/accounts";
import { getBookingById, listBookings } from "@/lib/api/bookings";
import {
  getLeaseOverdueStatus,
  getLeaseOverdueSummary,
  getLeaseById,
  getLeasePaymentSchedule,
  listLeases,
} from "@/lib/api/leases";
import {
  getPaymentSummary,
  listOverduePayments,
  listPayments,
} from "@/lib/api/payments";
import {
  getEnrichedPropertyById,
  getPropertyById,
  getPropertyFinancials,
  getUnitById,
  listProperties,
  listUnits,
} from "@/lib/api/properties";
import { getSessionTokens } from "@/lib/api/session";
import { getTenantProfileById, listTenantProfiles } from "@/lib/api/tenants";
import type { ApiEnrichedProperty } from "@/types/api";
import type {
  Booking,
  Lease,
  Payment,
  Property,
  Tenant,
  Unit,
} from "@/types/domain";
import type {
  BookingDetailVm,
  DataMeta,
  LandlordDashboardVm,
  LeaseDetailVm,
  LeaseOverdueSummaryVm,
  PaymentDetailVm,
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

function normalizeOverdueMetric(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

interface LandlordDomainData {
  properties: Property[];
  units: Unit[];
  leases: Lease[];
  payments: Payment[];
  tenants: Tenant[];
  bookings: Booking[];
  meta: DataMeta;
}

async function getAccessTokenForServer() {
  const tokens = await getSessionTokens();
  return tokens?.accessToken ?? null;
}

function errorMeta(warning: string) {
  return { source: "error" as const, warning };
}

async function buildLandlordDomainData(): Promise<LandlordDomainData> {
  const accessToken = await getAccessTokenForServer();
  if (!accessToken) {
    return {
      properties: [],
      units: [],
      leases: [],
      payments: [],
      tenants: [],
      bookings: [],
      meta: errorMeta(
        "No authenticated landlord session found. Sign in to load live data.",
      ),
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
      meta: errorMeta(
        "Current session is not authorized for the landlord data scope.",
      ),
    };
  }

  const [properties, units, leases, payments, tenantProfiles, bookings] =
    await Promise.all([
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
      meta: errorMeta(
        "Some landlord endpoints failed to load. The UI is showing no data instead of static fallback.",
      ),
    };
  }

  const propertyFinancials = new Map<
    string,
    Awaited<ReturnType<typeof getPropertyFinancials>> | null
  >();
  await Promise.all(
    properties.map(async (property) => {
      const financials = await getPropertyFinancials(
        property.id,
        accessToken,
      ).catch(() => null);
      propertyFinancials.set(String(property.id), financials);
    }),
  );

  const propertyDomains = properties.map((property) =>
    mapApiPropertyToDomain(
      property,
      units,
      propertyFinancials.get(String(property.id)) ?? null,
    ),
  );
  const leaseDomains = leases.map(mapApiLeaseToDomain);
  const paymentDomains = payments.map(mapApiPaymentToDomain);
  const bookingDomains = bookings.map(mapApiBookingToDomain);
  const tenantProfileDetails = new Map<
    string,
    Awaited<ReturnType<typeof getTenantProfileById>> | null
  >();

  await Promise.all(
    tenantProfiles.map(async (profile) => {
      const tenantProfile = await getTenantProfileById(
        profile.id,
        accessToken,
      ).catch(() => null);
      tenantProfileDetails.set(String(profile.id), tenantProfile);
    }),
  );

  const unitTenantNames = new Map<string, string>();
  const tenantNamesByActorId = new Map<string, string>();
  const tenantDomains = tenantProfiles.map((profile) => {
    const detailedProfile =
      tenantProfileDetails.get(String(profile.id)) ?? profile;
    const tenantUserId =
      detailedProfile?.user?.id != null
        ? String(detailedProfile.user.id)
        : null;
    const tenantLeases = leaseDomains
      .filter((lease) =>
        tenantUserId
          ? lease.tenantId === tenantUserId
          : lease.tenantId === String(profile.id),
      )
      .map((lease) => {
        const unit = units.find((item) => String(item.id) === lease.unitId);
        return unit ? { ...lease, propertyId: String(unit.property) } : lease;
      });
    const tenantPayments = paymentDomains.filter((payment) =>
      tenantUserId
        ? payment.tenantId === tenantUserId
        : payment.tenantId === String(profile.id),
    );
    const tenant = mapTenantAggregateToDomain({
      profile: detailedProfile ?? profile,
      user: null,
      leases: tenantLeases,
      payments: tenantPayments,
    });

    if (tenant.unitId) {
      unitTenantNames.set(tenant.unitId, tenant.fullName);
    }

    if (tenantUserId) {
      tenantNamesByActorId.set(tenantUserId, tenant.fullName);
    }
    tenantNamesByActorId.set(String(profile.id), tenant.fullName);

    return tenant;
  });

  const unitDomains = units.map((unit) =>
    mapApiUnitToDomain(unit, unitTenantNames.get(String(unit.id))),
  );
  const enrichedPayments = paymentDomains.map((payment) => {
    const lease = leaseDomains.find((item) => item.id === payment.leaseId);
    return {
      ...payment,
      tenantName: tenantNamesByActorId.get(payment.tenantId),
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
      occupiedUnits: domainData.units.filter(
        (unit) => unit.status === "occupied",
      ).length,
      activeLeases: domainData.leases.filter(
        (lease) => lease.status === "active",
      ).length,
      pendingBookings: domainData.bookings.filter(
        (booking) => booking.status === "new" || booking.status === "in_review",
      ).length,
      pendingPayments: domainData.payments.filter(
        (payment) => payment.status === "pending",
      ).length,
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

export async function getLandlordPropertyDetailVm(
  propertyId: string,
): Promise<PropertyDetailVm | null> {
  const accessToken = await getAccessTokenForServer();
  if (!accessToken) {
    return null;
  }

  const [property, units] = await Promise.all([
    getEnrichedPropertyById(propertyId, accessToken).catch(() =>
      getPropertyById(propertyId, accessToken).catch(() => null),
    ),
    listUnits(accessToken).catch(() => null),
  ]);

  if (!property || !units) {
    return null;
  }

  const financials = await getPropertyFinancials(propertyId, accessToken).catch(
    () => null,
  );
  const propertyDomain = mapApiPropertyToDomain(property, units, financials);
  const unitDomains = units
    .filter((unit) => String(unit.property) === String(property.id))
    .map((unit) => mapApiUnitToDomain(unit));
  const enrichedProperty = property as ApiEnrichedProperty;

  return {
    property: propertyDomain,
    units: unitDomains,
      details: {
        propertyType: property.property_type,
        status: property.status,
        addressContent: property.address_content ?? property.address_line_1,
        country: property.country,
        currency: property.currency ?? financials?.currency ?? null,
        description: property.description ?? null,
      yearBuilt: property.year_built ?? null,
      squareFootage: property.square_footage ?? null,
      purchasePrice:
        property.purchase_price ?? financials?.purchase_price ?? null,
      currentValue: property.current_value ?? financials?.current_value ?? null,
      monthlyRentTotal:
        property.monthly_rent_total ?? financials?.monthly_rent_total ?? null,
      occupancyRate: financials?.occupancy_rate ?? null,
      vacantUnits: financials?.vacant_units ?? null,
      amenities: (enrichedProperty.amenities ?? [])
        .map((item) => item.label ?? item.name ?? "")
        .filter(Boolean),
      facilities: (enrichedProperty.facilities ?? [])
        .map((item) => item.label ?? item.name ?? "")
        .filter(Boolean),
      mediaGallery: (enrichedProperty.media_gallery ?? [])
        .map((item) => item.image_url ?? item.url ?? item.file ?? "")
        .filter(Boolean),
      brandTier:
        enrichedProperty.branding?.tier ??
        enrichedProperty.branding?.brand_tier ??
        null,
    },
    meta: { source: "api" },
  };
}

export async function getLandlordUnitsData() {
  const domainData = await buildLandlordDomainData();
  return { units: domainData.units, meta: domainData.meta };
}

export async function getLandlordUnitDetailVm(
  unitId: string,
): Promise<UnitDetailVm | null> {
  const accessToken = await getAccessTokenForServer();
  if (!accessToken) {
    return null;
  }

  const apiUnit = await getUnitById(unitId, accessToken).catch(() => null);
  if (!apiUnit) {
    return null;
  }

  const domainData = await buildLandlordDomainData();
  const unit =
    domainData.units.find((item) => item.id === String(apiUnit.id)) ??
    mapApiUnitToDomain(apiUnit);
  const payments = domainData.payments.filter(
    (payment) => payment.unitId === unitId,
  );
  const property = domainData.properties.find(
    (item) => item.id === unit.propertyId,
  );
  const currentLease =
    domainData.leases.find((item) => item.id === String(apiUnit.current_lease)) ??
    domainData.leases.find(
      (item) => item.unitId === unit.id && item.status === "active",
    );
  const currentTenant =
    domainData.tenants.find((item) => item.id === String(apiUnit.current_tenant)) ??
    domainData.tenants.find((item) => item.unitId === unit.id);

  return {
    unit,
    payments,
    details: {
      propertyName: property?.name ?? null,
      rent: Number(apiUnit.rent ?? apiUnit.monthly_rent ?? 0) || 0,
      currency: apiUnit.currency ?? null,
      rentalPeriodicity: apiUnit.rental_periodicity ?? null,
      description: apiUnit.description ?? null,
      bedrooms: apiUnit.bedrooms ?? null,
      bathrooms: apiUnit.bathrooms ?? null,
      squareFootage: apiUnit.square_footage ?? null,
      floorNumber: apiUnit.floor_number ?? null,
      securityDeposit: apiUnit.security_deposit ?? null,
      securityDepositMonthsRequired:
        apiUnit.security_deposit_months_required ?? null,
      bookingDeposit: apiUnit.booking_deposit ?? null,
      allowedPaymentMethods: apiUnit.allowed_payment_methods ?? [],
      advancePaymentPolicyText: apiUnit.advance_payment_policy_text ?? null,
      currentTenant:
        apiUnit.current_tenant != null ? String(apiUnit.current_tenant) : null,
      currentTenantName: currentTenant?.fullName ?? unit.tenantName ?? null,
      currentLease:
        apiUnit.current_lease != null ? String(apiUnit.current_lease) : null,
      currentLeaseNumber: currentLease?.lease_number ?? null,
      isFurnished: apiUnit.is_furnished,
      isActive: apiUnit.is_active,
    },
    meta:
      domainData.meta.source === "api" ? domainData.meta : { source: "api" },
  };
}

export async function getLandlordTenantsData() {
  const domainData = await buildLandlordDomainData();
  return { tenants: domainData.tenants, meta: domainData.meta };
}

export async function getLandlordTenantDetailVm(
  tenantId: string,
): Promise<TenantDetailVm | null> {
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
  const accessToken = await getAccessTokenForServer();
  const overdueSummary = accessToken
    ? await getLeaseOverdueSummary(accessToken).catch(() => null)
    : null;
  const overdueByLeaseId = new Map(
    (overdueSummary?.leases ?? []).map((lease) => [
      String(lease.lease_id ?? lease.id ?? ""),
      lease,
    ]),
  );

  return {
    leases: domainData.leases.map((lease) => {
      const overdue = overdueByLeaseId.get(lease.id);
      return overdue
        ? {
            ...lease,
            overdueStatus: overdue.overdue_status,
            daysOverdue: overdue.days_overdue,
            overdueAmount: normalizeOverdueMetric(overdue.overdue_amount),
            overdueCurrency: overdue.currency ?? lease.currency,
            missedPaymentCount: overdue.missed_payment_count,
            lastOverdueAlertSentAt:
              overdue.last_overdue_alert_sent_at ?? undefined,
          }
        : lease;
    }),
    overdueSummary: overdueSummary
      ? ({
          countOverdue: overdueSummary.count_overdue,
          totalOverdueAmount:
            overdueSummary.total_overdue_amount != null
              ? normalizeOverdueMetric(overdueSummary.total_overdue_amount)
              : null,
          totalOverdueByCurrency: Object.fromEntries(
            Object.entries(overdueSummary.total_overdue_by_currency ?? {}).map(
              ([currency, amount]) => [currency, normalizeOverdueMetric(amount)],
            ),
          ),
        } satisfies LeaseOverdueSummaryVm)
      : undefined,
    meta: domainData.meta,
  };
}

export async function getLandlordLeaseCreationData() {
  const domainData = await buildLandlordDomainData();
  return {
    tenants: domainData.tenants,
    units: domainData.units.filter((unit) => unit.status !== "occupied"),
    meta: domainData.meta,
  };
}

export async function getLandlordLeaseDetailVm(
  leaseId: string,
): Promise<LeaseDetailVm | null> {
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
  const schedule = await getLeasePaymentSchedule(leaseId, accessToken).catch(
    () => [],
  );
  const overdue = await getLeaseOverdueStatus(leaseId, accessToken).catch(
    () => null,
  );
  const tenantProfile = await getTenantProfileById(
    apiLease.tenant,
    accessToken,
  ).catch(() => null);

  return {
    lease: {
      ...lease,
      propertyId: unit ? String(unit.property) : "",
    },
    unit: unit ? mapApiUnitToDomain(unit) : undefined,
    tenant: tenantProfile
      ? mapTenantAggregateToDomain({
          profile: tenantProfile,
          user: null,
          leases: [lease],
          payments: [],
        })
      : undefined,
    paymentSchedule: schedule.map((item, index) => ({
      id: String(item.id ?? `${leaseId}-${index}`),
      dueDate: String(item.due_date ?? lease.startDate),
      amount: Number(item.amount ?? lease.rentAmount) || lease.rentAmount,
      currency: String((item as { currency?: string }).currency ?? lease.currency ?? ""),
      status: item.status,
      label: item.label ?? item.name ?? `Échéance ${index + 1}`,
    })),
    overdue: overdue
      ? {
          leaseId: String(overdue.lease_id ?? leaseId),
          leaseNumber: overdue.lease_number ?? lease.lease_number,
          status: overdue.overdue_status,
          daysOverdue: overdue.days_overdue,
          overdueAmount: normalizeOverdueMetric(overdue.overdue_amount),
          currency: overdue.currency ?? lease.currency,
          missedPaymentCount: overdue.missed_payment_count,
          lastAlertSentAt: overdue.last_overdue_alert_sent_at ?? undefined,
        }
      : undefined,
    meta: { source: "api" },
  };
}

export async function getLandlordPaymentsVm(): Promise<PaymentsPageVm> {
  const domainData = await buildLandlordDomainData();
  const accessToken = await getAccessTokenForServer();
  const [summary, overduePayments] = accessToken
    ? await Promise.all([
        getPaymentSummary(accessToken).catch(() => null),
        listOverduePayments(accessToken).catch(() => []),
      ])
    : [null, []];
  return {
    payments: domainData.payments,
    overduePayments: overduePayments
      .map(mapApiPaymentToDomain)
      .map((payment) => {
        const lease = domainData.leases.find(
          (item) => item.id === payment.leaseId,
        );
        return {
          ...payment,
          unitId: lease?.unitId ?? "",
        };
      }),
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
  const [domainData, paymentsVm] = await Promise.all([
    buildLandlordDomainData(),
    getLandlordPaymentsVm(),
  ]);
  return {
    payments: domainData.payments,
    overduePayments: paymentsVm.overduePayments,
    leases: domainData.leases,
    tenants: domainData.tenants,
    summary: paymentsVm.summary,
    meta: domainData.meta,
  };
}

export async function getLandlordPaymentDetailVm(
  paymentId: string,
): Promise<PaymentDetailVm | null> {
  const domainData = await buildLandlordDomainData();
  const payment = domainData.payments.find((item) => item.id === paymentId);

  if (!payment) {
    return null;
  }

  const lease = domainData.leases.find((item) => item.id === payment.leaseId);
  const tenant =
    domainData.tenants.find((item) => item.id === payment.tenantId) ??
    domainData.tenants.find((item) => item.fullName === payment.tenantName);
  const unit = domainData.units.find((item) => item.id === payment.unitId);
  const property = domainData.properties.find(
    (item) => item.id === (lease?.propertyId ?? unit?.propertyId),
  );

  return {
    payment,
    tenant,
    lease,
    property,
    unit,
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

export async function getLandlordBookingDetail(
  bookingId: string,
): Promise<BookingDetailVm | null> {
  const accessToken = await getAccessTokenForServer();
  if (!accessToken) {
    return null;
  }

  const booking = await getBookingById(bookingId, accessToken).catch(
    () => null,
  );
  if (!booking) {
    return null;
  }

  const domainData = await buildLandlordDomainData();
  const mappedBooking = mapApiBookingToDomain(booking);
  const tenant = domainData.tenants.find(
    (item) => item.id === mappedBooking.tenantId,
  );
  const property = domainData.properties.find(
    (item) => item.id === mappedBooking.propertyId,
  );
  const unit = domainData.units.find(
    (item) => item.id === mappedBooking.unitId,
  );

  return {
    booking: mappedBooking,
    tenant,
    property,
    unit,
    meta: { source: "api" as const },
  };
}
