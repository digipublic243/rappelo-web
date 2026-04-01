import type { LeaseStatus, PaymentStatus, UnitStatus } from "@/types/domain";

export function unitActions(status: UnitStatus) {
  return {
    canAssignTenant: status === "vacant" || status === "reserved",
    canScheduleMaintenance: status !== "maintenance",
  };
}

export function leaseActions(status: LeaseStatus) {
  return {
    canActivate: status === "draft",
    canTerminate: status === "active",
    canRenew: status === "active" || status === "expired",
  };
}

export function paymentActions(status: PaymentStatus) {
  return {
    canRetry: status === "failed",
    canRefund: status === "paid",
    canSendReminder: status === "pending",
  };
}
