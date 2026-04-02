export type ApiUserRole = "landlord" | "tenant" | "property_manager" | "admin";
export type ApiPropertyStatus = "active" | "inactive" | "maintenance" | "sold";
export type ApiUnitStatus = "vacant" | "occupied" | "maintenance" | "reserved";
export type ApiRentalPeriodicity = "journ" | "hebdo" | "mensuel" | "autre";
export type ApiLeaseStatus = "draft" | "active" | "terminated" | "expired";
export type ApiLeaseOverdueStatus =
  | "on_track"
  | "overdue"
  | "severely_overdue"
  | "resolved";
export type ApiPaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type ApiPaymentMethod =
  | "cash"
  | "bank_transfer"
  | "easypay"
  | "mobile_money"
  | "card"
  | "other";
export type ApiEmploymentStatus = "employed" | "self_employed" | "unemployed" | "student" | "retired" | "military" | "officer";
export type ApiMaritalStatus = "single" | "married" | "divorced" | "widowed" | "separated";

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
  code?: string;
  [key: string]: unknown;
}

export interface ApiPaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface GlobalApiErrorState {
  id: string;
  title: string;
  message: string;
  status?: number;
  code?: string;
  scope?: string;
  timestamp: number;
}

export interface ApiTokenPair {
  access: string;
  refresh: string;
}

export interface ApiLoginRequest {
  phone_number: string;
  password: string;
}

export interface ApiOtpRequest {
  phone_number: string;
}

export interface ApiOtpVerifyRequest {
  phone_number: string;
  code: string;
}

export interface ApiUserCreateRequest {
  phone_number: string;
  password: string;
  password2: string;
  role: ApiUserRole;
  email?: string | null;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string | null;
}

export interface ApiUserStatistics {
  total_users: number;
  active_users: number;
  landlords: number;
  tenants: number;
  property_managers: number;
}

export interface ApiUserDetail {
  id: number;
  phone_number: string;
  email: string | null;
  first_name: string;
  last_name: string;
  full_name: string;
  role: ApiUserRole;
  date_of_birth: string | null;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
}

export interface ApiShellProfile {
  id?: number | string;
  user_id?: number | string;
  full_name?: string;
  role?: ApiUserRole;
  phone_number?: string;
  email?: string | null;
  unread_notifications?: number;
  [key: string]: unknown;
}

export interface ApiProperty {
  id: number | string;
  name: string;
  property_type: string;
  status: ApiPropertyStatus;
  address_content?: string;
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  description?: string | null;
  year_built?: number | null;
  total_units: number;
  square_footage?: number | null;
  purchase_price?: number | null;
  current_value?: number | null;
  monthly_rent_total?: number | null;
  landlord?: number;
  is_active: boolean;
  [key: string]: unknown;
}

export interface ApiPropertyUpsertRequest {
  name: string;
  property_type: string;
  status: ApiPropertyStatus;
  address_content: string;
  city: string;
  country: string;
  description?: string | null;
  total_units: number;
  is_active: boolean;
}

export interface ApiPropertyAmenity {
  id?: string | number;
  name?: string;
  label?: string;
  [key: string]: unknown;
}

export interface ApiPropertyFacility {
  id?: string | number;
  name?: string;
  label?: string;
  [key: string]: unknown;
}

export interface ApiPropertyMediaAsset {
  id?: string | number;
  image_url?: string;
  url?: string;
  file?: string;
  title?: string;
  [key: string]: unknown;
}

export interface ApiPropertyBranding {
  tier?: string;
  brand_tier?: string;
  [key: string]: unknown;
}

export interface ApiEnrichedProperty extends ApiProperty {
  amenities?: ApiPropertyAmenity[];
  facilities?: ApiPropertyFacility[];
  media_gallery?: ApiPropertyMediaAsset[];
  branding?: ApiPropertyBranding | null;
}

export interface ApiPropertyFinancials {
  monthly_rent_total?: number | null;
  purchase_price?: number | null;
  current_value?: number | null;
  occupancy_rate: number;
  occupied_units: number;
  vacant_units: number;
}

export interface ApiUnit {
  id: number | string;
  property: number | string;
  unit_number: string;
  unit_type: string;
  status: ApiUnitStatus;
  rent?: number | string;
  currency?: string | null;
  rental_periodicity?: ApiRentalPeriodicity | null;
  description?: string | null;
  is_furnished: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_footage?: number | null;
  security_deposit?: number | null;
  booking_deposit?: number | null;
  floor_number?: number | null;
  allowed_payment_methods?: string[];
  advance_payment_policy_text?: string | null;
  current_tenant?: string | number | null;
  current_lease?: string | number | null;
  monthly_rent?: number | null;
  rent_period?: "daily" | "weekly" | "monthly" | "other";
  [key: string]: unknown;
}

export interface ApiUnitCreateRequest {
  property_id: string;
  unit_number: string;
  unit_type?: string;
  rent: number;
  currency?: string;
  rental_periodicity?: ApiRentalPeriodicity;
  description?: string | null;
  is_furnished?: boolean;
}

export interface ApiUnitUpdateRequest {
  unit_number?: string;
  unit_type?: string;
  status?: ApiUnitStatus;
  rent?: number;
  currency?: string;
  rental_periodicity?: ApiRentalPeriodicity;
  description?: string | null;
  is_furnished?: boolean;
  is_active?: boolean;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_footage?: number | null;
  security_deposit?: number | null;
  booking_deposit?: number | null;
  floor_number?: number | null;
  allowed_payment_methods?: string[];
  advance_payment_policy_text?: string | null;
}

export interface ApiTenantProfile {
  id: number | string;
  user?: {
    id: number | string;
    phone_number?: string;
    email?: string | null;
    first_name?: string;
    last_name?: string;
    full_name?: string;
    role?: string;
    is_active?: boolean;
    date_joined?: string;
  } | null;
  user_full_name?: string | null;
  user_phone_number?: string | null;
  user_email?: string | null;
  date_of_birth?: string | null;
  ssn?: string | null;
  ssn_last_four?: string | null;
  id_card?: string | null;
  alternate_phone?: string | null;
  alternate_email?: string | null;
  marital_status?: ApiMaritalStatus | null;
  employment_status?: ApiEmploymentStatus | null;
  annual_income?: number | null;
  notes?: string | null;
  is_active: boolean;
  [key: string]: unknown;
}

export interface ApiTenantProfileCreateRequest {
  id_card?: File | null;
  alternate_phone: string;
  alternate_email?: string | null;
  marital_status?: ApiMaritalStatus | null;
  employment_status?: ApiEmploymentStatus | null;
  notes?: string | null;
}

export interface ApiLease {
  id: number | string;
  lease_number?: string;
  unit: number | string;
  tenant: number | string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit?: number | null;
  security_deposit_months_taken?: number | null;
  payment_frequency?:
    | "monthly"
    | "quarterly"
    | "semi_annual"
    | "annual"
    | null;
  status: ApiLeaseStatus;
  move_in_date?: string | null;
  move_out_date?: string | null;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ApiLeaseCreateRequest {
  tenant: string;
  unit: string;
  start_date: string;
  end_date: string;
  monthly_rent: number;
  security_deposit?: number | null;
  security_deposit_months_taken?: number | null;
  payment_frequency?: "monthly" | "quarterly" | "semi_annual" | "annual";
  move_in_date?: string | null;
  notes?: string | null;
  status?: ApiLeaseStatus;
}

export interface ApiLeaseRenewRequest {
  new_end_date: string;
}

export interface ApiLeaseTerminateRequest {
  move_out_date?: string;
}

export interface ApiLeaseOverdue {
  lease_id?: string | number;
  id?: string | number;
  lease_number?: string;
  overdue_status: ApiLeaseOverdueStatus;
  days_overdue: number;
  overdue_amount: number | string;
  missed_payment_count: number;
  last_overdue_alert_sent_at?: string | null;
}

export interface ApiLeaseOverdueSummary {
  count_overdue: number;
  total_overdue_amount: number | string;
  leases: ApiLeaseOverdue[];
}

export interface ApiPayment {
  id: number | string;
  lease?: number | string;
  tenant?: number | string;
  tenant_id?: number | string;
  payment_label?: string;
  amount: number;
  currency?: string | null;
  due_date: string;
  status: ApiPaymentStatus;
  payment_method?: ApiPaymentMethod;
  transaction_reference?: string;
  notes?: string;
  easypay_reference_id?: string | null;
  easypay_transaction_id?: string | null;
  easypay_provider?: string | null;
  easypay_attempts?: number | null;
  easypay_last_check?: string | null;
  is_active?: boolean;
  paid_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ApiPaymentSummary {
  total_paid: number;
  total_pending: number;
  total_overdue: number;
  count_paid: number;
  count_pending: number;
  count_overdue: number;
}

export interface ApiPaymentLinkRequest {
  gateway: "cash" | "bank_transfer" | "easypay";
  expires_in_hours: number;
}

export interface ApiPaymentLink {
  id: string | number;
  payment: string | number;
  token: string;
  amount: string | number;
  gateway: string;
  status: string;
  expires_at: string;
  gateway_url?: string;
  gateway_reference?: string;
  link_url: string;
  created_at: string;
  metadata?: {
    last_easypay_phone_number?: string;
    last_reference_id?: string;
    easypay_operations?: Array<{
      type?: string;
      success?: boolean;
      [key: string]: unknown;
    }>;
    [key: string]: unknown;
  };
}

export interface ApiPaymentCreateRequest {
  lease: number | string;
  tenant_id?: number | string;
  tenant?: number | string;
  amount?: number;
  due_date: string;
  status?: ApiPaymentStatus;
  payment_method?: ApiPaymentMethod;
  transaction_reference?: string;
  notes?: string;
  is_active?: boolean;
}

export interface ApiEasyPayInitiateRequest {
  phone_number: string;
}

export interface ApiEasyPayMutationResponse {
  message?: string;
  payment: ApiPayment;
  payment_link?: ApiPaymentLink;
}

export interface ApiEasyPayStatusResponse {
  status?: string;
  payment: ApiPayment;
  easypay_status?: {
    status?: string;
    transactionId?: string;
    amount?: number | string;
    currency?: string;
    [key: string]: unknown;
  };
}

export interface ApiTenantDashboard {
  residence_image?: string;
  hero_banner?: string;
  automatic_payments_enabled?: boolean;
  next_due_payment?: ApiPayment | null;
  quick_stats?: Record<string, number | string | null>;
  [key: string]: unknown;
}

export interface ApiTenantNotification {
  id: string | number;
  title?: string;
  message?: string;
  body?: string;
  is_read?: boolean;
  created_at?: string;
  type?: string;
  [key: string]: unknown;
}

export interface AuthenticatedUser {
  id: string;
  role: ApiUserRole;
  fullName: string;
  phoneNumber: string;
  email?: string | null;
  unreadNotifications?: number;
}
