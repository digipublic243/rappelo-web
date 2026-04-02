"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formInlineErrorClassName } from "@/components/forms/form-styles";

interface AppFormProps {
  action?: string | ((formData: FormData) => void | Promise<void>);
  children: React.ReactNode;
  className?: string;
}

type FormValue = string | number | boolean;

interface AppFormContextValue {
  getValue: (name: string) => FormValue | undefined;
  setValue: (name: string, value: FormValue) => void;
}

const AppFormContext = createContext<AppFormContextValue | null>(null);

export function AppForm({ action, children, className }: AppFormProps) {
  const [values, setValues] = useState<Record<string, FormValue>>({});
  const contextValue = useMemo<AppFormContextValue>(
    () => ({
      getValue: (name) => values[name],
      setValue: (name, value) => {
        setValues((current) => ({ ...current, [name]: value }));
      },
    }),
    [values],
  );

  return (
    <AppFormContext.Provider value={contextValue}>
      <form action={action} className={cn(className)}>
        {children}
      </form>
    </AppFormContext.Provider>
  );
}

export function useAppFormContext() {
  return useContext(AppFormContext);
}

export function FormHelperText({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-xs text-[#717c82]", className)}>{children}</p>;
}

export function FormInlineError({ message, className }: { message?: string; className?: string }) {
  if (!message) {
    return null;
  }

  return <p className={cn(formInlineErrorClassName, className)}>{message}</p>;
}

export function FormInlineSuccess({ message, className }: { message?: string; className?: string }) {
  if (!message) {
    return null;
  }

  return <p className={cn("rounded-xl bg-[#d8e3fb]/40 px-4 py-3 text-sm text-[#485367]", className)}>{message}</p>;
}

export function FormSubmitButton({
  children,
  className,
  disabled,
  onClick,
  type = "submit",
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl bg-[#545f73] px-4 py-3 font-semibold text-[#f6f7ff] disabled:cursor-not-allowed disabled:opacity-70",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
}
