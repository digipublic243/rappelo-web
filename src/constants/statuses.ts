import {
  type BookingStatus,
  type LeaseStatus,
  type PaymentStatus,
  type UnitStatus,
} from "@/types/domain";

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  vacant: "Vacant",
  occupied: "Occupied",
  reserved: "Reserved",
  maintenance: "Maintenance",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

export const LEASE_STATUS_LABELS: Record<LeaseStatus, string> = {
  draft: "Draft",
  active: "Active",
  terminated: "Terminated",
  expired: "Expired",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  new: "New",
  in_review: "In Review",
  approved: "Approved",
  rejected: "Rejected",
  waitlisted: "Waitlisted",
};

export const STATUS_TONE: Record<string, "neutral" | "success" | "warning" | "danger" | "info"> = {
  vacant: "info",
  occupied: "success",
  reserved: "warning",
  maintenance: "danger",
  pending: "warning",
  paid: "success",
  failed: "danger",
  refunded: "neutral",
  draft: "neutral",
  active: "success",
  terminated: "danger",
  expired: "warning",
  new: "info",
  in_review: "warning",
  approved: "success",
  rejected: "danger",
  waitlisted: "neutral",
};
