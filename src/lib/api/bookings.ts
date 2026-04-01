import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";

export interface ApiBooking {
  id: string | number;
  unit: string | number;
  tenant?: string | number;
  property?: string | number;
  check_in: string;
  check_out: string;
  booking_deposit?: number | string | null;
  status?: string;
  notes?: string;
  rejection_reason?: string;
  created_at?: string;
  updated_at?: string;
  [key: string]: unknown;
}

export interface ApiCreateBookingRequest {
  unit: string | number;
  check_in: string;
  check_out: string;
  booking_deposit?: number | string;
  notes?: string;
}

export function listBookings(token: string) {
  return apiRequest<ApiBooking[]>(`${API_PREFIX}/leases/bookings/`, { token });
}

export function getBookingById(id: string | number, token: string) {
  return apiRequest<ApiBooking>(`${API_PREFIX}/leases/bookings/${id}/`, { token });
}

export function createBooking(payload: ApiCreateBookingRequest, token: string) {
  return apiRequest<ApiBooking>(`${API_PREFIX}/leases/bookings/`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function confirmBooking(id: string | number, token: string) {
  return apiRequest<ApiBooking>(`${API_PREFIX}/leases/bookings/${id}/confirm/`, {
    method: "POST",
    token,
  });
}

export function rejectBooking(id: string | number, reason: string | undefined, token: string) {
  return apiRequest<ApiBooking>(`${API_PREFIX}/leases/bookings/${id}/reject/`, {
    method: "POST",
    token,
    body: reason ? { reason } : {},
  });
}

export function cancelBooking(id: string | number, token: string) {
  return apiRequest<ApiBooking>(`${API_PREFIX}/leases/bookings/${id}/cancel/`, {
    method: "POST",
    token,
  });
}
