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
    totalUnits: property.total_units,
    occupiedUnits,
    monthlyRevenue: property.monthly_rent_total ?? financials?.monthly_rent_total ?? 0,
  };
}

export function mapApiUnitToDomain(unit: ApiUnit, tenantName?: string): Unit {
  const cadence =
    unit.rental_periodicity === "journ"
      ? "day"
      : unit.rental_periodicity === "hebdo"
        ? "week"
        : unit.rental_periodicity === "autre"
          ? "custom"
          : unit.rent_period === "daily"
            ? "day"
            : unit.rent_period === "weekly"
              ? "week"
              : unit.rent_period === "other"
                ? "custom"
                : "month";
  const allowedPaymentMethods = (unit.allowed_payment_methods ?? [])
    .map((method) =>
      method === "mobile_money" || method === "easypay"
        ? "easypay"
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
  return {
    id: stringifyId(lease.id),
    tenantId: stringifyId(lease.tenant),
    propertyId: "",
    unitId: stringifyId(lease.unit),
    startDate: lease.start_date,
    endDate: lease.end_date,
    status: lease.status,
    rentAmount: lease.monthly_rent,
    cadence: "month",
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
  if (method === "mobile_money") {
    return "easypay";
  }

  return "cash";
}

export function mapApiPaymentToDomain(payment: ApiPayment): Payment {
  return {
    id: stringifyId(payment.id),
    tenantId: stringifyId(payment.tenant),
    leaseId: stringifyId(payment.lease),
    unitId: "",
    amount: payment.amount,
    dueDate: payment.due_date,
    paidAt: payment.paid_at ?? undefined,
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
  const latestLease =
    [...args.leases].sort((left, right) => right.endDate.localeCompare(left.endDate))[0];
  const latestPayment =
    [...args.payments].sort((left, right) => (right.paidAt ?? right.dueDate).localeCompare(left.paidAt ?? left.dueDate))[0];

  return {
    id: stringifyId(args.profile.id),
    fullName: args.user?.full_name ?? "Tenant Profile",
    email: args.user?.email ?? "No email on file",
    phone: args.user?.phone_number ?? "N/A",
    propertyId: latestLease?.propertyId ?? "",
    unitId: latestLease?.unitId ?? "",
    leaseStatus: latestLease?.status ?? "draft",
    paymentStatus: latestPayment?.status ?? "pending",
  };
}
