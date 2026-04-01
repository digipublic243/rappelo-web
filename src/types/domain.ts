export type Role = "landlord" | "tenant";

export type UnitStatus = "vacant" | "occupied" | "reserved" | "maintenance";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type LeaseStatus = "draft" | "active" | "terminated" | "expired";
export type BookingStatus = "new" | "in_review" | "approved" | "rejected" | "waitlisted";
export type PricingCadence = "day" | "week" | "month" | "custom";
export type PaymentMethod = "cash" | "easypay";

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  totalUnits: number;
  occupiedUnits: number;
  monthlyRevenue: number;
}

export interface Unit {
  id: string;
  propertyId: string;
  label: string;
  type: string;
  price: number;
  pricingCadence: PricingCadence;
  status: UnitStatus;
  depositEnabled: boolean;
  allowedPaymentMethods?: PaymentMethod[];
  tenantName?: string;
}

export interface Tenant {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  propertyId: string;
  unitId: string;
  leaseStatus: LeaseStatus;
  paymentStatus: PaymentStatus;
}

export interface Booking {
  id: string;
  tenantId: string;
  propertyId: string;
  unitId: string;
  requestedFrom: string;
  requestedTo: string;
  status: BookingStatus;
  depositAmount: number;
}

export interface Lease {
  id: string;
  tenantId: string;
  propertyId: string;
  unitId: string;
  startDate: string;
  endDate: string;
  status: LeaseStatus;
  rentAmount: number;
  cadence: PricingCadence;
}

export interface Payment {
  id: string;
  tenantId: string;
  leaseId?: string;
  unitId: string;
  amount: number;
  dueDate: string;
  paidAt?: string;
  method: PaymentMethod;
  status: PaymentStatus;
}
