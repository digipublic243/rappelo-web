import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type { ApiPayment, ApiPaymentCreateRequest } from "@/types/api";

export function listPayments(token: string) {
  return apiRequest<ApiPayment[]>(`${API_PREFIX}/payments/payments/`, { token });
}

export function getPaymentById(id: string | number, token: string) {
  return apiRequest<ApiPayment>(`${API_PREFIX}/payments/payments/${id}/`, { token });
}

export function listOverduePayments(token: string) {
  return apiRequest<ApiPayment[]>(`${API_PREFIX}/payments/payments/overdue/`, { token });
}

export function confirmPayment(id: string | number, token: string) {
  return apiRequest<ApiPayment>(`${API_PREFIX}/payments/payments/${id}/confirm/`, {
    method: "POST",
    token,
  });
}

export function createPayment(payload: ApiPaymentCreateRequest, token: string) {
  return apiRequest<ApiPayment>(`${API_PREFIX}/payments/payments/`, {
    method: "POST",
    token,
    body: payload,
  });
}
