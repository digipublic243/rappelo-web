"use client";

import { cn } from "@/lib/cn";
import { formFieldLabelClassName, formHintClassName } from "@/components/forms/form-styles";

export function FieldShell({
  label,
  helperText,
  className,
  children,
}: {
  label?: string;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn(formFieldLabelClassName, className)}>
      {label ? <>{label}</> : null}
      <div className={label ? "mt-2" : undefined}>{children}</div>
      {helperText ? <p className={cn(formHintClassName, "mt-2")}>{helperText}</p> : null}
    </label>
  );
}
