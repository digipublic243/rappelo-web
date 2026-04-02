"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { formInlineErrorClassName } from "@/components/forms/form-styles";
import { Button, type ButtonVariant, type ButtonSize } from "@/components/ui/Button";

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
  return <p className={cn("text-xs text-[var(--secondary-3)]", className)}>{children}</p>;
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

  return (
    <p
      className={cn(
        "rounded-[var(--radius-md)] bg-[var(--primary-3)]/70 px-[var(--space-4)] py-[var(--space-3)] text-sm text-[var(--primary-2)]",
        className,
      )}
    >
      {message}
    </p>
  );
}

export function FormSubmitButton({
  children,
  className,
  disabled,
  onClick,
  type = "submit",
  variant = "primary",
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <Button
      className={cn("rounded-[var(--radius-lg)]", className)}
      disabled={disabled}
      onClick={onClick}
      size={size}
      type={type}
      variant={variant}
    >
      {children}
    </Button>
  );
}
