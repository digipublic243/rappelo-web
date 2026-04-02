"use client";

import { cn } from "@/lib/cn";
import { useAppFormContext } from "@/components/forms/AppForm";
import { formFieldInputClassName } from "@/components/forms/form-styles";
import { FieldShell } from "@/components/forms/fields/FieldShell";
import type { TextareaFieldProps } from "@/components/forms/fields/types";

export function TextareaField(props: TextareaFieldProps) {
  const form = useAppFormContext();
  const storedValue = form?.getValue(props.name);
  const resolvedValue =
    storedValue !== undefined ? String(storedValue) : props.defaultValue ?? "";

  return (
    <FieldShell className={props.className} helperText={props.helperText} label={props.label}>
      <textarea
        className={cn(formFieldInputClassName, props.inputClassName)}
        name={props.name}
        onChange={(event) => {
          form?.setValue(props.name, event.target.value);
        }}
        placeholder={props.placeholder}
        required={props.required}
        rows={props.rows ?? 4}
        value={resolvedValue}
      />
    </FieldShell>
  );
}
