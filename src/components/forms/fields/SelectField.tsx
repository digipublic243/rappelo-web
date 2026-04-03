"use client";

import { cn } from "@/lib/cn";
import { useAppFormContext } from "@/components/forms/AppForm";
import { formFieldInputClassName } from "@/components/forms/form-styles";
import { FieldShell } from "@/components/forms/fields/FieldShell";
import type { SelectFieldProps } from "@/components/forms/fields/types";

export function SelectField(props: SelectFieldProps) {
  const form = useAppFormContext();
  const storedValue = form?.getValue(props.name);
  const resolvedValue =
    storedValue !== undefined
      ? String(storedValue)
      : props.defaultValue !== undefined
        ? String(props.defaultValue)
        : String(props.options[0]?.value ?? "");

  return (
    <FieldShell className={props.className} helperText={props.helperText} label={props.label}>
      <select
        className={cn(formFieldInputClassName, props.inputClassName)}
        disabled={props.disabled}
        name={props.name}
        onChange={(event) => {
          form?.setValue(props.name, event.target.value);
          props.onChange?.(event.target.value);
        }}
        required={props.required}
        value={resolvedValue}
      >
        {props.options.map((option) => (
          <option key={`${props.name}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
