import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type { ApiShellProfile, ApiUserDetail, ApiUserStatistics } from "@/types/api";

export function getCurrentUser(token: string) {
  return apiRequest<ApiUserDetail>(`${API_PREFIX}/accounts/users/me/`, { token });
}

export function getShellProfile(token: string) {
  return apiRequest<ApiShellProfile>(`${API_PREFIX}/accounts/users/shell_profile/`, { token });
}

export function getUserById(id: string | number, token: string) {
  return apiRequest<ApiUserDetail>(`${API_PREFIX}/accounts/users/${id}/`, { token });
}

export function getUserStatistics(token: string) {
  return apiRequest<ApiUserStatistics>(`${API_PREFIX}/accounts/users/statistics/`, { token });
}
