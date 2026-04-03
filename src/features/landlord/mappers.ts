import type {
  ApiPayment,
  ApiPaymentMethod,
  ApiProperty,
  ApiPropertyFinancials,
  ApiTenantProfile,
  ApiUnit,
  ApiUserDetail,
  ApiLease,
} from "@/types/api";
import type { ApiBooking } from "@/lib/api/bookings";
import type { Booking, Lease, Payment, PaymentMethod, Property, Tenant, Unit } from "@/types/domain";

function stringifyId(value: string | number | undefined | null) {
  return value == null ? "" : String(value);
}

export function mapApiPropertyToDomain(
  property: ApiProperty,
  units: ApiUnit[] = [],
  financials?: ApiPropertyFinancials | null,
): Property {
  const propertyId = stringifyId(property.id);
  const relatedUnits = units.filter((unit) => stringifyId(unit.property) === propertyId);
  const occupiedUnits = financials?.occupied_units ?? relatedUnits.filter((unit) => unit.status === "occupied").length;

  return {
    id: propertyId,
    name: property.name,
    address: property.address_content ?? property.address_line_1,
    city: property.city,
    currency: property.currency ?? financials?.currency ?? undefined,
    totalUnits: property.total_units,
    occupiedUnits,
    monthlyRevenue: property.monthly_rent_total ?? financials?.monthly_rent_total ?? 0,
  };
}

export function mapApiUnitToDomain(unit: ApiUnit, tenantName?: string): Unit {
  const rawCadence = String(
    unit.rental_periodicity ?? unit.rent_period ?? "mensuel",
  ).trim();
  const cadence =
    rawCadence === "journ" || rawCadence === "daily"
      ? "day"
      : rawCadence === "hebdo" || rawCadence === "weekly"
        ? "week"
        : rawCadence === "mensuel" || rawCadence === "monthly"
          ? "month"
          : rawCadence === "quarterly"
            ? "quarter"
            : rawCadence === "semi_annual"
              ? "semiAnnual"
              : rawCadence === "annual" || rawCadence === "yearly"
                ? "year"
                : rawCadence === "autre" || rawCadence === "other"
                  ? "custom"
                  : "month";
  const allowedPaymentMethods = (unit.allowed_payment_methods ?? [])
    .map((method) =>
      method === "mobile_money" || method === "easypay"
        ? "easypay"
        : method === "bank_transfer"
          ? "bank_transfer"
        : method === "cash"
          ? "cash"
          : null,
    )
    .filter((method): method is PaymentMethod => Boolean(method));
  const price = Number(unit.rent ?? unit.monthly_rent ?? 0);

  return {
    id: stringifyId(unit.id),
    propertyId: stringifyId(unit.property),
    label: unit.unit_number,
    type: unit.unit_type,
    price: Number.isFinite(price) ? price : 0,
    currency: unit.currency ?? undefined,
    pricingCadence: cadence,
    status: unit.status,
    depositEnabled: Boolean(
      (unit.security_deposit && unit.security_deposit > 0) ||
        (unit.booking_deposit && unit.booking_deposit > 0),
    ),
    allowedPaymentMethods,
    tenantName,
  };
}

export function mapApiLeaseToDomain(lease: ApiLease): Lease {
  const rentAmount = Number(lease.monthly_rent ?? 0);
  const cadence =
    lease.payment_frequency === "daily"
      ? "day"
      : lease.payment_frequency === "weekly"
        ? "week"
      : lease.payment_frequency === "quarterly"
      ? "quarter"
      : lease.payment_frequency === "semi_annual"
        ? "semiAnnual"
        : lease.payment_frequency === "annual"
          ? "year"
          : "month";

  return {
    id: stringifyId(lease.id),
    lease_number: lease.lease_number ?? stringifyId(lease.id),
    tenantId: stringifyId(lease.tenant),
    propertyId: "",
    unitId: stringifyId(lease.unit),
    startDate: lease.start_date,
    endDate: lease.end_date,
    status: lease.status,
    rentAmount: Number.isFinite(rentAmount) ? rentAmount : 0,
    currency: lease.currency ?? undefined,
    cadence,
    securityDeposit:
      lease.security_deposit != null ? Number(lease.security_deposit) : undefined,
    securityDepositMonthsTaken:
      lease.security_deposit_months_taken != null
        ? Number(lease.security_deposit_months_taken)
        : undefined,
  };
}

export function mapApiBookingToDomain(booking: ApiBooking): Booking {
  const apiStatus = String(booking.status ?? "pending");
  const status: Booking["status"] =
    apiStatus === "pending"
      ? "in_review"
      : apiStatus === "confirmed"
        ? "approved"
        : apiStatus === "rejected"
          ? "rejected"
          : apiStatus === "cancelled"
            ? "waitlisted"
            : apiStatus === "new"
              ? "new"
              : apiStatus === "approved"
                ? "approved"
                : "in_review";

  return {
    id: stringifyId(booking.id),
    tenantId: stringifyId(booking.tenant),
    propertyId: stringifyId(booking.property),
    unitId: stringifyId(booking.unit),
    requestedFrom: booking.check_in,
    requestedTo: booking.check_out,
    status,
    depositAmount: Number(booking.booking_deposit ?? 0),
  };
}

function mapPaymentMethod(method?: ApiPaymentMethod): Payment["method"] {
  if (method === "mobile_money" || method === "easypay") {
    return "easypay";
  }

  if (method === "bank_transfer") {
    return "bank_transfer";
  }

  return "cash";
}

export function mapApiPaymentToDomain(payment: ApiPayment): Payment {
  const resolvedTenantId = payment.tenant_id ?? payment.tenant;

  return {
    id: stringifyId(payment.id),
    tenantId: stringifyId(resolvedTenantId),
    leaseId: stringifyId(payment.lease),
    paymentLabel: payment.payment_label ?? undefined,
    unitId: "",
    amount: payment.amount,
    currency: payment.currency ?? undefined,
    dueDate: payment.due_date,
    paidAt: payment.paid_at ?? undefined,
    createdAt: payment.created_at ?? undefined,
    transactionReference: payment.transaction_reference ?? undefined,
    notes: payment.notes ?? undefined,
    easypayReferenceId: payment.easypay_reference_id ?? undefined,
    easypayTransactionId: payment.easypay_transaction_id ?? undefined,
    easypayProvider: payment.easypay_provider ?? undefined,
    easypayAttempts:
      payment.easypay_attempts != null
        ? Number(payment.easypay_attempts)
        : undefined,
    easypayLastCheck: payment.easypay_last_check ?? undefined,
    easypayGatewayReference: undefined,
    easypayLastPhoneNumber: undefined,
    method: mapPaymentMethod(payment.payment_method),
    status: payment.status,
  };
}

export function mapTenantAggregateToDomain(args: {
  profile: ApiTenantProfile;
  user?: ApiUserDetail | null;
  leases: Lease[];
  payments: Payment[];
}): Tenant {
  const firstDefinedText = (...values: Array<string | null | undefined>) =>
    values.find((value) => typeof value === "string" && value.trim().length > 0);

  const latestLease =
    [...args.leases].sort((left, right) => right.endDate.localeCompare(left.endDate))[0];
  const latestPayment =
    [...args.payments].sort((left, right) => (right.paidAt ?? right.dueDate).localeCompare(left.paidAt ?? left.dueDate))[0];

  return {
    id: stringifyId(args.profile.id),
    fullName:
      firstDefinedText(
        args.user?.full_name,
        args.profile.user?.full_name,
        args.profile.user_full_name,
      ) ?? "Profil locataire",
    email:
      firstDefinedText(
        args.user?.email ?? undefined,
        args.profile.user?.email ?? undefined,
        args.profile.user_email ?? undefined,
        args.profile.alternate_email ?? undefined,
      ) ?? "Aucun email renseigné",
    phone:
      firstDefinedText(
        args.user?.phone_number,
        args.profile.user?.phone_number,
        args.profile.user_phone_number,
        args.profile.alternate_phone,
      ) ?? "N/A",
    propertyId: latestLease?.propertyId ?? "",
    unitId: latestLease?.unitId ?? "",
    leaseStatus: latestLease?.status ?? "draft",
    paymentStatus: latestPayment?.status ?? "pending",
  };
}
