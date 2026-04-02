import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type {
  ApiLease,
  ApiLeaseCreateRequest,
  ApiLeaseRenewRequest,
  ApiLeaseTerminateRequest,
  ApiPaginatedResponse,
} from "@/types/api";

export interface ApiLeasePaymentScheduleItem {
  id?: string | number;
  due_date?: string;
  amount?: number | string;
  status?: string;
  label?: string;
  name?: string;
}

function unwrapListResponse<T>(response: ApiPaginatedResponse<T> | T[]) {
  return Array.isArray(response) ? response : response.results;
}

export function listLeases(token: string) {
  return apiRequest<ApiPaginatedResponse<ApiLease> | ApiLease[]>(
    `${API_PREFIX}/leases/leases/`,
    { token },
  ).then(unwrapListResponse);
}

export function getLeaseById(id: string | number, token: string) {
  return apiRequest<ApiLease>(`${API_PREFIX}/leases/leases/${id}/`, { token });
}

export function createLease(payload: ApiLeaseCreateRequest, token: string) {
  return apiRequest<ApiLease>(`${API_PREFIX}/leases/leases/`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function activateLease(id: string | number, token: string) {
  return apiRequest<ApiLease>(`${API_PREFIX}/leases/leases/${id}/activate/`, {
    method: "POST",
    token,
  });
}

export function terminateLease(id: string | number, payload: ApiLeaseTerminateRequest, token: string) {
  return apiRequest<ApiLease>(`${API_PREFIX}/leases/leases/${id}/terminate/`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function renewLease(id: string | number, payload: ApiLeaseRenewRequest, token: string) {
  return apiRequest<ApiLease>(`${API_PREFIX}/leases/leases/${id}/renew/`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function getLeasePaymentSchedule(id: string | number, token: string) {
  return apiRequest<ApiLeasePaymentScheduleItem[]>(
    `${API_PREFIX}/leases/leases/${id}/payment_schedule/`,
    { token },
  );
}
