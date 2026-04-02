import {
  type BookingStatus,
  type LeaseStatus,
  type PaymentStatus,
  type UnitStatus,
} from "@/types/domain";

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  vacant: "Vacante",
  occupied: "Occupée",
  reserved: "Réservée",
  maintenance: "Maintenance",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "En attente",
  paid: "Payé",
  failed: "Échoué",
  refunded: "Remboursé",
};

export const LEASE_STATUS_LABELS: Record<LeaseStatus, string> = {
  draft: "Brouillon",
  active: "Actif",
  terminated: "Résilié",
  expired: "Expiré",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  new: "Nouvelle",
  in_review: "En revue",
  approved: "Approuvée",
  rejected: "Rejetée",
  waitlisted: "En attente",
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
