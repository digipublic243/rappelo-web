import { ApiError } from "@/lib/http/client";
import type { GlobalApiErrorState } from "@/types/api";

interface BuildGlobalApiErrorOptions {
  title?: string;
  scope?: string;
}

function normalizeMessage(error: unknown, fallback: string) {
  const details = extractApiErrorDetails(error);
  if (details.length > 0) {
    return details[0];
  }

  if (error instanceof ApiError) {
    return (
      error.payload?.detail ??
      error.payload?.message ??
      error.payload?.error ??
      error.message ??
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
}

function humanizeFieldName(field: string) {
  return field
    .replace(/[_.-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function collectDetails(
  value: unknown,
  path: string[] = [],
): string[] {
  if (value == null) {
    return [];
  }

  if (typeof value === "string") {
    const label = path.length > 0 ? `${humanizeFieldName(path.join(" "))}: ` : "";
    return [`${label}${value}`];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectDetails(item, path));
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([key]) => !["detail", "message", "error", "code"].includes(key),
    );

    return entries.flatMap(([key, nestedValue]) =>
      collectDetails(nestedValue, [...path, key]),
    );
  }

  return [];
}

export function extractApiErrorDetails(error: unknown): string[] {
  if (error instanceof ApiError) {
    return collectDetails(error.payload);
  }

  return [];
}

export function formatFormApiError(
  error: unknown,
  fallback = "Une erreur est survenue lors de la communication avec le serveur.",
) {
  const details = extractApiErrorDetails(error);
  const message = normalizeMessage(error, fallback);

  return {
    message,
    details,
  };
}

export function buildGlobalApiError(
  error: unknown,
  options: BuildGlobalApiErrorOptions = {},
): GlobalApiErrorState {
  const apiError = error instanceof ApiError ? error : null;
  const fallback = "Something went wrong while talking to the server.";

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: options.title ?? "API Request Failed",
    message: normalizeMessage(error, fallback),
    status: apiError?.status,
    code: typeof apiError?.payload?.code === "string" ? apiError.payload.code : undefined,
    scope: options.scope,
    timestamp: Date.now(),
  };
}
