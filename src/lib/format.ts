import {
  BOOKING_STATUS_LABELS,
  LEASE_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  UNIT_STATUS_LABELS,
} from "@/constants/statuses";
import type { BookingStatus, LeaseStatus, PaymentStatus, PricingCadence, UnitStatus } from "@/types/domain";

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("fr-CD", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("fr-CD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(isoDate));
}

export function formatCadence(cadence: PricingCadence): string {
  const labels: Record<PricingCadence, string> = {
    day: "Par jour",
    week: "Par semaine",
    month: "Par mois",
    custom: "Cadence personnalisée",
  };

  return labels[cadence];
}

export function formatPhone(phone: string): string {
  return phone.replace(/(\+\d{1,2})(\d{3})(\d{3})(\d{4})/, "$1 $2 $3 $4");
}

export function unitStatusLabel(status: UnitStatus): string {
  return UNIT_STATUS_LABELS[status];
}

export function paymentStatusLabel(status: PaymentStatus): string {
  return PAYMENT_STATUS_LABELS[status];
}

export function leaseStatusLabel(status: LeaseStatus): string {
  return LEASE_STATUS_LABELS[status];
}

export function bookingStatusLabel(status: BookingStatus): string {
  return BOOKING_STATUS_LABELS[status];
}
