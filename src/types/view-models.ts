import type { Booking, Lease, Payment, Property, Tenant, Unit } from "@/types/domain";
import type { ApiPropertyStatus } from "@/types/api";

export type DataSource = "api" | "empty" | "error";

export interface DataMeta {
  source: DataSource;
  warning?: string;
}

export interface LandlordDashboardVm {
  kpis: {
    properties: number;
    occupiedUnits: number;
    activeLeases: number;
    pendingBookings: number;
    pendingPayments: number;
    tenants: number;
  };
  properties: Property[];
  units: Unit[];
  leases: Lease[];
  payments: Payment[];
  bookings: Booking[];
  meta: DataMeta;
}

export interface PropertyDetailVm {
  property: Property;
  units: Unit[];
  details: {
    propertyType: string;
    status: ApiPropertyStatus;
    addressContent: string;
    country: string;
    currency?: string | null;
    description?: string | null;
    yearBuilt?: number | null;
    squareFootage?: number | null;
    purchasePrice?: number | null;
    currentValue?: number | null;
    monthlyRentTotal?: number | null;
    occupancyRate?: number | null;
    vacantUnits?: number | null;
    amenities?: string[];
    facilities?: string[];
    mediaGallery?: string[];
    brandTier?: string | null;
  };
  meta: DataMeta;
}

export interface TenantDetailVm {
  tenant: Tenant;
  lease?: Lease;
  payments: Payment[];
  meta: DataMeta;
}

export interface UnitDetailVm {
  unit: Unit;
  payments: Payment[];
  details: {
    propertyName?: string | null;
    rent?: number | null;
    currency?: string | null;
    rentalPeriodicity?: string | null;
    description?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    squareFootage?: number | null;
    floorNumber?: number | null;
    securityDeposit?: number | null;
    securityDepositMonthsRequired?: number | null;
    bookingDeposit?: number | null;
    allowedPaymentMethods?: string[];
    advancePaymentPolicyText?: string | null;
    currentTenant?: string | null;
    currentTenantName?: string | null;
    currentLease?: string | null;
    currentLeaseNumber?: string | null;
    isFurnished: boolean;
    isActive: boolean;
  };
  meta: DataMeta;
}

export interface LeaseDetailVm {
  lease: Lease;
  tenant?: Tenant;
  unit?: Unit;
  paymentSchedule?: Array<{
    id: string;
    dueDate: string;
    amount: number;
    currency?: string;
    status?: string;
    label: string;
  }>;
  overdue?: {
    leaseId: string;
    leaseNumber: string;
    status?: Lease["overdueStatus"];
    daysOverdue: number;
    overdueAmount: number;
    currency?: string;
    missedPaymentCount: number;
    lastAlertSentAt?: string;
  };
  meta: DataMeta;
}

export interface LeaseOverdueSummaryVm {
  countOverdue: number;
  totalOverdueAmount: number | null;
  totalOverdueByCurrency?: Record<string, number>;
}

export interface BookingDetailVm {
  booking: Booking;
  tenant?: Tenant;
  property?: Property;
  unit?: Unit;
  meta: DataMeta;
}

export interface PaymentsPageVm {
  payments: Payment[];
  overduePayments: Payment[];
  tenants: Tenant[];
  leases: Lease[];
  summary?: {
    totalPaid: number;
    totalPending: number;
    totalOverdue: number;
    countPaid: number;
    countPending: number;
    countOverdue: number;
  };
  meta: DataMeta;
}

export interface PaymentDetailVm {
  payment: Payment;
  tenant?: Tenant;
  lease?: Lease;
  property?: Property;
  unit?: Unit;
  accountPhone?: string;
  meta: DataMeta;
}

export interface TenantDashboardVm {
  profileName: string;
  currentLease?: Lease;
  currentUnit?: Unit;
  currentProperty?: Property;
  payments: Payment[];
  leases: Lease[];
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    createdAt?: string;
    isRead: boolean;
  }>;
  residenceImage?: string;
  heroBanner?: string;
  automaticPaymentsEnabled?: boolean;
  nextDuePayment?: Payment;
  quickStats?: Record<string, number | string | null>;
  meta: DataMeta;
}
