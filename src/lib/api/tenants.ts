import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type { ApiTenantProfile } from "@/types/api";

export function listTenantProfiles(token: string) {
  return apiRequest<ApiTenantProfile[]>(`${API_PREFIX}/tenants/profiles/`, { token });
}

export function getTenantProfileById(id: string | number, token: string) {
  return apiRequest<ApiTenantProfile>(`${API_PREFIX}/tenants/profiles/${id}/`, { token });
}

export function getTenantProfileStatistics(id: string | number, token: string) {
  return apiRequest<Record<string, unknown>>(`${API_PREFIX}/tenants/profiles/${id}/statistics/`, { token });
}
