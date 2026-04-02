import { API_PREFIX } from "@/config/api";
import { apiRequest } from "@/lib/http/client";
import type {
  ApiEnrichedProperty,
  ApiPaginatedResponse,
  ApiProperty,
  ApiPropertyFinancials,
  ApiPropertyUpsertRequest,
  ApiUnit,
  ApiUnitCreateRequest,
  ApiUnitStatus,
  ApiUnitUpdateRequest,
} from "@/types/api";

function unwrapListResponse<T>(response: ApiPaginatedResponse<T> | T[]) {
  return Array.isArray(response) ? response : response.results;
}

export function listProperties(token: string) {
  return apiRequest<ApiPaginatedResponse<ApiProperty> | ApiProperty[]>(
    `${API_PREFIX}/properties/properties/`,
    { token },
  ).then(unwrapListResponse);
}

export function getPropertyById(id: string | number, token: string) {
  return apiRequest<ApiProperty>(`${API_PREFIX}/properties/properties/${id}/`, {
    token,
  });
}

export function getEnrichedPropertyById(id: string | number, token: string) {
  return apiRequest<ApiEnrichedProperty>(
    `${API_PREFIX}/properties/properties/${id}/enriched/`,
    { token },
  );
}

export function createProperty(
  payload: ApiPropertyUpsertRequest,
  token: string,
) {
  return apiRequest<ApiProperty>(`${API_PREFIX}/properties/properties/`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function updateProperty(
  id: string | number,
  payload: Partial<ApiPropertyUpsertRequest>,
  token: string,
) {
  return apiRequest<ApiProperty>(`${API_PREFIX}/properties/properties/${id}/`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function getPropertyFinancials(id: string | number, token: string) {
  return apiRequest<ApiPropertyFinancials>(
    `${API_PREFIX}/properties/properties/${id}/financials/`,
    { token },
  );
}

export function getPropertyStatistics(id: string | number, token: string) {
  return apiRequest<Record<string, unknown>>(
    `${API_PREFIX}/properties/properties/${id}/statistics/`,
    { token },
  );
}

export function listUnits(token: string) {
  return apiRequest<ApiPaginatedResponse<ApiUnit> | ApiUnit[]>(
    `${API_PREFIX}/properties/units/`,
    { token },
  ).then(unwrapListResponse);
}

export function getUnitById(id: string | number, token: string) {
  return apiRequest<ApiUnit>(`${API_PREFIX}/properties/units/${id}/`, {
    token,
  });
}

export function createUnit(payload: ApiUnitCreateRequest, token: string) {
  return apiRequest<ApiUnit>(`${API_PREFIX}/properties/units/`, {
    method: "POST",
    token,
    body: payload,
  });
}

export function updateUnit(
  id: string | number,
  payload: ApiUnitUpdateRequest,
  token: string,
) {
  return apiRequest<ApiUnit>(`${API_PREFIX}/properties/units/${id}/`, {
    method: "PATCH",
    token,
    body: payload,
  });
}

export function listAvailableUnits(
  token: string,
  propertyId?: string | number,
) {
  const query = propertyId ? `?property_id=${propertyId}` : "";
  return apiRequest<ApiPaginatedResponse<ApiUnit> | ApiUnit[]>(
    `${API_PREFIX}/properties/units/available/${query}`,
    { token },
  ).then(unwrapListResponse);
}

export function updateUnitStatus(
  id: string | number,
  status: ApiUnitStatus,
  token: string,
) {
  return apiRequest<void>(
    `${API_PREFIX}/properties/units/${id}/update_status/`,
    {
      method: "POST",
      token,
      body: { status },
    },
  );
}

export function activateUnit(id: string | number, token: string) {
  return apiRequest<void>(`${API_PREFIX}/properties/units/${id}/activate/`, {
    method: "POST",
    token,
  });
}

export function deactivateUnit(id: string | number, token: string) {
  return apiRequest<void>(`${API_PREFIX}/properties/units/${id}/deactivate/`, {
    method: "POST",
    token,
  });
}
