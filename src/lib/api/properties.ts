import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type { ApiProperty, ApiPropertyFinancials, ApiPropertyUpsertRequest, ApiUnit, ApiUnitStatus } from "@/types/api";

export function listProperties(token: string) {
  return apiRequest<ApiProperty[]>(`${API_PREFIX}/properties/properties/`, { token });
}

export function getPropertyById(id: string | number, token: string) {
  return apiRequest<ApiProperty>(`${API_PREFIX}/properties/properties/${id}/`, { token });
}

export function createProperty(payload: ApiPropertyUpsertRequest, token: string) {
  return apiRequest<ApiProperty>(`${API_PREFIX}/properties/properties/`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function updateProperty(id: string | number, payload: Partial<ApiPropertyUpsertRequest>, token: string) {
  return apiRequest<ApiProperty>(`${API_PREFIX}/properties/properties/${id}/`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function getPropertyFinancials(id: string | number, token: string) {
  return apiRequest<ApiPropertyFinancials>(`${API_PREFIX}/properties/properties/${id}/financials/`, { token });
}

export function getPropertyStatistics(id: string | number, token: string) {
  return apiRequest<Record<string, unknown>>(`${API_PREFIX}/properties/properties/${id}/statistics/`, { token });
}

export function listUnits(token: string) {
  return apiRequest<ApiUnit[]>(`${API_PREFIX}/properties/units/`, { token });
}

export function getUnitById(id: string | number, token: string) {
  return apiRequest<ApiUnit>(`${API_PREFIX}/properties/units/${id}/`, { token });
}

export function listAvailableUnits(token: string, propertyId?: string | number) {
  const query = propertyId ? `?property_id=${propertyId}` : "";
  return apiRequest<ApiUnit[]>(`${API_PREFIX}/properties/units/available/${query}`, { token });
}

export function updateUnitStatus(id: string | number, status: ApiUnitStatus, token: string) {
  return apiRequest<void>(`${API_PREFIX}/properties/units/${id}/update_status/`, {
    method: "POST",
    token,
    body: { status },
  });
}
