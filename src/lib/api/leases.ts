import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type { ApiLease, ApiLeaseRenewRequest, ApiLeaseTerminateRequest } from "@/types/api";

export function listLeases(token: string) {
  return apiRequest<ApiLease[]>(`${API_PREFIX}/leases/leases/`, { token });
}

export function getLeaseById(id: string | number, token: string) {
  return apiRequest<ApiLease>(`${API_PREFIX}/leases/leases/${id}/`, { token });
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
