import {
  BOOKING_STATUS_LABELS,
  LEASE_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  UNIT_STATUS_LABELS,
} from "@/constants/statuses";
import type {
  BookingStatus,
  LeaseOverdueStatus,
  LeaseStatus,
  PaymentMethod,
  PaymentStatus,
  PricingCadence,
  UnitStatus,
} from "@/types/domain";

function formatNumber(amount: number) {
  return new Intl.NumberFormat("fr-CD", {
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatMoney(amount: number, _currency?: string | null): string {
  void _currency;
  const normalizedCurrency = "USD";

  try {
    return new Intl.NumberFormat("fr-CD", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${formatNumber(amount)} ${normalizedCurrency}`;
  }
}

export function formatMoneyBreakdown(
  entries: Array<{ amount: number; currency?: string | null }>,
  emptyValue = formatMoney(0),
): string {
  if (entries.length === 0) {
    return emptyValue;
  }

  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
  return formatMoney(total, "USD");
}

export function formatMoneyBreakdownFromMap(
  totalsByCurrency?: Record<string, number | string> | null,
  emptyValue = formatMoney(0),
): string {
  if (!totalsByCurrency || Object.keys(totalsByCurrency).length === 0) {
    return emptyValue;
  }

  return formatMoneyBreakdown(
    Object.entries(totalsByCurrency).map(([currency, amount]) => ({
      currency,
      amount: Number(amount ?? 0),
    })),
    emptyValue,
  );
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
    quarter: "Par trimestre",
    semiAnnual: "Par semestre",
    year: "Par an",
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

export function formatPaymentMethod(method: PaymentMethod): string {
  const labels: Record<PaymentMethod, string> = {
    cash: "Espèces",
    bank_transfer: "Virement bancaire",
    easypay: "EasyPay",
  };

  return labels[method];
}

export function leaseStatusLabel(status: LeaseStatus): string {
  return LEASE_STATUS_LABELS[status];
}

export function bookingStatusLabel(status: BookingStatus): string {
  return BOOKING_STATUS_LABELS[status];
}

export function leaseOverdueStatusLabel(status?: LeaseOverdueStatus): string {
  const labels: Record<LeaseOverdueStatus, string> = {
    on_track: "À jour",
    overdue: "En retard",
    severely_overdue: "Retard sévère",
    resolved: "Retard résolu",
  };

  return status ? labels[status] : "Statut inconnu";
}
