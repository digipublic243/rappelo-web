"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { GlobalApiErrorState } from "@/types/api";
import { buildGlobalApiError } from "@/lib/api/errors";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface ApiErrorContextValue {
  error: GlobalApiErrorState | null;
  showError: (error: unknown, options?: { title?: string; scope?: string }) => void;
  clearError: () => void;
}

const ApiErrorContext = createContext<ApiErrorContextValue | null>(null);

export function ApiErrorProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<GlobalApiErrorState | null>(null);

  const showError = useCallback((nextError: unknown, options?: { title?: string; scope?: string }) => {
    setError(buildGlobalApiError(nextError, options));
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      error,
      showError,
      clearError,
    }),
    [clearError, error, showError],
  );

  return (
    <ApiErrorContext.Provider value={value}>
      {children}
      <GlobalApiErrorBanner error={error} onDismiss={clearError} />
    </ApiErrorContext.Provider>
  );
}

function GlobalApiErrorBanner({
  error,
  onDismiss,
}: {
  error: GlobalApiErrorState | null;
  onDismiss: () => void;
}) {
  if (!error) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex justify-center">
      <div className="pointer-events-auto w-full max-w-xl rounded-3xl border border-[#f2b7b3] bg-white/95 p-4 shadow-[0_24px_60px_rgba(117,33,33,0.18)] backdrop-blur-md">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-2xl bg-[#fe8983]/20 p-2 text-[#752121]">
            <MaterialIcon name="notifications" size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-[#752121]">{error.title}</p>
              {error.status ? (
                <span className="rounded-full bg-[#f8e3e1] px-2 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[#8f3430]">
                  {error.status}
                </span>
              ) : null}
              {error.scope ? (
                <span className="rounded-full bg-[#f0f4f7] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#566166]">
                  {error.scope}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-6 text-[#5d3b39]">{error.message}</p>
          </div>
          <button
            className="rounded-full p-2 text-[#8f3430] transition hover:bg-[#f8e3e1]"
            onClick={onDismiss}
            type="button"
          >
            <MaterialIcon name="logout" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function useApiErrorState() {
  const context = useContext(ApiErrorContext);

  if (!context) {
    throw new Error("useApiErrorState doit être utilisé dans ApiErrorProvider.");
  }

  return context;
}

export function useSyncGlobalApiError(
  errorMessage: string | undefined,
  options?: { title?: string; scope?: string },
) {
  const { showError } = useApiErrorState();
  const title = options?.title;
  const scope = options?.scope;

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    showError(errorMessage, { title, scope });
  }, [errorMessage, scope, showError, title]);
}
