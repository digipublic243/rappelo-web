import type { Booking, Lease, Payment, Unit } from "@/types/domain";

export const tenantProfile = {
  id: "TEN-001",
  fullName: "Julian Foster",
  phone: "+15125550999",
  email: "julian.foster@example.com",
};

export const tenantUnit: Unit = {
  id: "U-402",
  propertyId: "P-100",
  label: "Unit 402",
  type: "Executive Suite",
  price: 2450,
  pricingCadence: "month",
  status: "occupied",
  depositEnabled: true,
  tenantName: "Julian Foster",
};

export const tenantBookings: Booking[] = [
  {
    id: "TBK-100",
    tenantId: "TEN-001",
    propertyId: "P-100",
    unitId: "U-402",
    requestedFrom: "2026-05-10",
    requestedTo: "2026-08-10",
    status: "approved",
    depositAmount: 450,
  },
  {
    id: "TBK-101",
    tenantId: "TEN-001",
    propertyId: "P-220",
    unitId: "U-12A",
    requestedFrom: "2026-06-01",
    requestedTo: "2026-11-30",
    status: "in_review",
    depositAmount: 400,
  },
];

export const tenantLeases: Lease[] = [
  {
    id: "TL-200",
    tenantId: "TEN-001",
    propertyId: "P-100",
    unitId: "U-402",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "active",
    rentAmount: 2450,
    cadence: "month",
  },
  {
    id: "TL-180",
    tenantId: "TEN-001",
    propertyId: "P-330",
    unitId: "U-109",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "expired",
    rentAmount: 1200,
    cadence: "month",
  },
];

export const tenantPayments: Payment[] = [
  {
    id: "TP-310",
    tenantId: "TEN-001",
    leaseId: "TL-200",
    unitId: "U-402",
    amount: 2450,
    dueDate: "2026-04-01",
    method: "easypay",
    status: "pending",
  },
  {
    id: "TP-311",
    tenantId: "TEN-001",
    leaseId: "TL-200",
    unitId: "U-402",
    amount: 2450,
    dueDate: "2026-03-01",
    paidAt: "2026-03-01",
    method: "cash",
    status: "paid",
  },
  {
    id: "TP-312",
    tenantId: "TEN-001",
    leaseId: "TL-200",
    unitId: "U-402",
    amount: 200,
    dueDate: "2026-02-11",
    paidAt: "2026-02-13",
    method: "easypay",
    status: "refunded",
  },
];

export const discoverableUnits: Unit[] = [
  {
    id: "DU-01",
    propertyId: "P-220",
    label: "Unit 12A",
    type: "Business Loft",
    price: 1850,
    pricingCadence: "month",
    status: "vacant",
    depositEnabled: true,
  },
  {
    id: "DU-02",
    propertyId: "P-100",
    label: "Unit 205",
    type: "Garden Studio",
    price: 1650,
    pricingCadence: "week",
    status: "vacant",
    depositEnabled: false,
  },
  {
    id: "DU-03",
    propertyId: "P-330",
    label: "Unit 901",
    type: "Executive Penthouse",
    price: 400,
    pricingCadence: "day",
    status: "reserved",
    depositEnabled: true,
  },
];
