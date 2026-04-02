import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type {
  ApiEasyPayInitiateRequest,
  ApiEasyPayMutationResponse,
  ApiEasyPayStatusResponse,
  ApiPaginatedResponse,
  ApiPayment,
  ApiPaymentCreateRequest,
  ApiPaymentLink,
  ApiPaymentLinkRequest,
  ApiPaymentSummary,
} from "@/types/api";

function unwrapListResponse<T>(response: ApiPaginatedResponse<T> | T[]) {
  return Array.isArray(response) ? response : response.results;
}

export function listPayments(token: string) {
  return apiRequest<ApiPaginatedResponse<ApiPayment> | ApiPayment[]>(
    `${API_PREFIX}/payments/payments/`,
    { token },
  ).then(unwrapListResponse);
}

export function getPaymentById(id: string | number, token: string) {
  return apiRequest<ApiPayment>(`${API_PREFIX}/payments/payments/${id}/`, { token });
}

export function listOverduePayments(token: string) {
  return apiRequest<ApiPaginatedResponse<ApiPayment> | ApiPayment[]>(
    `${API_PREFIX}/payments/payments/overdue/`,
    { token },
  ).then(unwrapListResponse);
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

export function initiateEasyPay(
  id: string | number,
  payload: ApiEasyPayInitiateRequest,
  token: string,
) {
  return apiRequest<ApiEasyPayMutationResponse>(
    `${API_PREFIX}/payments/payments/${id}/initiate_easypay/`,
    {
      method: "POST",
      token,
      body: payload,
    },
  );
}

export function checkEasyPayStatus(id: string | number, token: string) {
  return apiRequest<ApiEasyPayStatusResponse>(
    `${API_PREFIX}/payments/payments/${id}/check_easypay_status/`,
    {
      token,
    },
  );
}
