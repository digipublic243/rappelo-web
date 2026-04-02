"use client";

import { cn } from "@/lib/cn";
import { useAppFormContext } from "@/components/forms/AppForm";
import { formFieldInputClassName } from "@/components/forms/form-styles";
import { FieldShell } from "@/components/forms/fields/FieldShell";
import type { BasicInputFieldProps } from "@/components/forms/fields/types";

export function InputField(props: BasicInputFieldProps) {
  const form = useAppFormContext();
  if (props.type === "file") {
    return (
      <FieldShell className={props.className} helperText={props.helperText} label={props.label}>
        <input
          className={cn(formFieldInputClassName, props.inputClassName)}
          disabled={props.disabled}
          name={props.name}
          onChange={props.onChange}
          required={props.required}
          type="file"
        />
      </FieldShell>
    );
  }

  const storedValue = form?.getValue(props.name);
  const resolvedValue =
    props.value ??
    (storedValue !== undefined
      ? String(storedValue)
      : props.defaultValue !== undefined
        ? String(props.defaultValue)
        : "");

  return (
    <FieldShell className={props.className} helperText={props.helperText} label={props.label}>
      <input
        className={cn(formFieldInputClassName, props.inputClassName)}
        disabled={props.disabled}
        inputMode={props.inputMode}
        max={props.max}
        maxLength={props.maxLength}
        min={props.min}
        name={props.name}
        onChange={(event) => {
          form?.setValue(props.name, event.target.value);
          props.onChange?.(event);
        }}
        placeholder={props.placeholder}
        required={props.required}
        step={props.step}
        type={props.type ?? "text"}
        value={resolvedValue}
      />
    </FieldShell>
  );
}
