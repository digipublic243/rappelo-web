import { API_BASE_URL } from "@/config/api";
import type { ApiErrorResponse } from "@/types/api";

export class ApiError extends Error {
  status: number;
  payload?: ApiErrorResponse | null;

  constructor(message: string, status: number, payload?: ApiErrorResponse | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  token?: string;
  body?: unknown;
  headers?: HeadersInit;
  cache?: RequestCache;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? "no-store",
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? ((await response.json()) as T | ApiErrorResponse) : null;

  if (!response.ok) {
    const errorPayload = (payload as ApiErrorResponse | null) ?? null;
    throw new ApiError(
      errorPayload?.detail ?? errorPayload?.message ?? `API request failed with status ${response.status}`,
      response.status,
      errorPayload,
    );
  }

  return payload as T;
}

export async function safeApiRequest<T>(path: string, options: RequestOptions = {}): Promise<T | null> {
  try {
    return await apiRequest<T>(path, options);
  } catch {
    return null;
  }
}
