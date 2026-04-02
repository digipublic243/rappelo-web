import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type {
  ApiPaginatedResponse,
  ApiTenantDashboard,
  ApiTenantNotification,
  ApiTenantProfile,
  ApiTenantProfileCreateRequest,
} from "@/types/api";

function unwrapListResponse<T>(response: ApiPaginatedResponse<T> | T[]) {
  return Array.isArray(response) ? response : response.results;
}

export function listTenantProfiles(token: string) {
  return apiRequest<ApiPaginatedResponse<ApiTenantProfile> | ApiTenantProfile[]>(
    `${API_PREFIX}/tenants/profiles/`,
    { token },
  ).then(unwrapListResponse);
}

export function getTenantProfileById(id: string | number, token: string) {
  return apiRequest<ApiTenantProfile>(`${API_PREFIX}/tenants/profiles/${id}/`, { token });
}

export function createTenantProfile(
  payload: ApiTenantProfileCreateRequest | FormData,
  token: string,
) {
  return apiRequest<ApiTenantProfile>(`${API_PREFIX}/tenants/profiles/`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function getTenantProfileStatistics(id: string | number, token: string) {
  return apiRequest<Record<string, unknown>>(`${API_PREFIX}/tenants/profiles/${id}/statistics/`, { token });
}

export function getTenantDashboard(token: string) {
  return apiRequest<ApiTenantDashboard>(`${API_PREFIX}/tenants/dashboard/`, { token });
}

export function listTenantNotifications(token: string, options?: { unreadOnly?: boolean }) {
  const query = options?.unreadOnly ? "?unread=true" : "";
  return apiRequest<ApiPaginatedResponse<ApiTenantNotification> | ApiTenantNotification[]>(
    `${API_PREFIX}/tenants/notifications/${query}`,
    { token },
  ).then(unwrapListResponse);
}
