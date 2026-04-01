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
    addressLine2?: string | null;
    state: string;
    postalCode: string;
    country: string;
    description?: string | null;
    yearBuilt?: number | null;
    squareFootage?: number | null;
    purchasePrice?: number | null;
    currentValue?: number | null;
    occupancyRate?: number | null;
    vacantUnits?: number | null;
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
  meta: DataMeta;
}

export interface LeaseDetailVm {
  lease: Lease;
  tenant?: Tenant;
  unit?: Unit;
  meta: DataMeta;
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
  tenants: Tenant[];
  leases: Lease[];
  meta: DataMeta;
}

export interface TenantDashboardVm {
  profileName: string;
  currentLease?: Lease;
  currentUnit?: Unit;
  currentProperty?: Property;
  payments: Payment[];
  leases: Lease[];
  meta: DataMeta;
}
