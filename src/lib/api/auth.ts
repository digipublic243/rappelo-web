import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type { ApiLoginRequest, ApiOtpRequest, ApiOtpVerifyRequest, ApiTokenPair, ApiUserCreateRequest, ApiUserDetail } from "@/types/api";

export function login(payload: ApiLoginRequest) {
  return apiRequest<ApiTokenPair>(`${API_PREFIX}/auth/login/`, {
    method: "POST",
    body: payload,
  });
}

export function requestOtp(payload: ApiOtpRequest) {
  return apiRequest<{ detail?: string; message?: string }>(`${API_PREFIX}/auth/otp/request/`, {
    method: "POST",
    body: payload,
  });
}

export function verifyOtp(payload: ApiOtpVerifyRequest) {
  return apiRequest<ApiTokenPair>(`${API_PREFIX}/auth/otp/verify/`, {
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

export function createUser(payload: ApiUserCreateRequest, token?: string) {
  return apiRequest<ApiUserDetail>(`${API_PREFIX}/accounts/users/`, {
    method: "POST",
    token,
    body: payload,
  });
}
