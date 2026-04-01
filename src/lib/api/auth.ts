import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type { ApiLoginRequest, ApiTokenPair, ApiUserCreateRequest, ApiUserDetail } from "@/types/api";

export function login(payload: ApiLoginRequest) {
  return apiRequest<ApiTokenPair>(`${API_PREFIX}/auth/login/`, {
    method: "POST",
    body: payload,
  });
}

export function refreshAccessToken(refreshToken: string) {
  return apiRequest<{ access: string }>(`${API_PREFIX}/auth/refresh/`, {
    method: "POST",
    body: { refresh: refreshToken },
  });
}

export function verifyToken(token: string) {
  return apiRequest<void>(`${API_PREFIX}/auth/verify/`, {
    method: "POST",
    body: { token },
  });
}

export function createUser(payload: ApiUserCreateRequest) {
  return apiRequest<ApiUserDetail>(`${API_PREFIX}/accounts/users/`, {
    method: "POST",
    body: payload,
  });
}
