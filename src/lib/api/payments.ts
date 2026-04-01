import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type { ApiPayment, ApiPaymentCreateRequest, ApiPaymentLink, ApiPaymentLinkRequest, ApiPaymentSummary } from "@/types/api";

export function listPayments(token: string) {
  return apiRequest<ApiPayment[]>(`${API_PREFIX}/payments/payments/`, { token });
}

export function getPaymentById(id: string | number, token: string) {
  return apiRequest<ApiPayment>(`${API_PREFIX}/payments/payments/${id}/`, { token });
}

export function listOverduePayments(token: string) {
  return apiRequest<ApiPayment[]>(`${API_PREFIX}/payments/payments/overdue/`, { token });
}

export function getPaymentSummary(token: string) {
  return apiRequest<ApiPaymentSummary>(`${API_PREFIX}/payments/payments/summary/`, { token });
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

export function generatePaymentLink(id: string | number, payload: ApiPaymentLinkRequest, token: string) {
  return apiRequest<ApiPaymentLink>(`${API_PREFIX}/payments/payments/${id}/generate_link/`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function sendPaymentReminders(payload: Record<string, unknown>, token: string) {
  return apiRequest<{ detail?: string; message?: string }>(`${API_PREFIX}/payments/payments/send_reminders/`, {
    method: "POST",
    token,
    body: payload,
  });
}
