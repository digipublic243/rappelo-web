"use client";

import { cn } from "@/lib/cn";
import { useAppFormContext } from "@/components/forms/AppForm";
import type { CheckboxFieldProps } from "@/components/forms/fields/types";

export function CheckboxField(props: CheckboxFieldProps) {
  const form = useAppFormContext();
  const storedValue = form?.getValue(props.name);
  const resolvedChecked =
    props.checked ??
    (typeof storedValue === "boolean" ? storedValue : props.defaultChecked ?? false);

  return (
    <label
      className={cn(
        "flex items-center gap-3 rounded-xl border border-[#d9e4ea] px-4 py-3 text-sm font-medium text-[#566166]",
        props.className,
      )}
    >
      <input
        checked={resolvedChecked}
        disabled={props.disabled}
        name={props.name}
        onChange={(event) => {
          form?.setValue(props.name, event.target.checked);
          props.onChange?.(event);
        }}
        type="checkbox"
        value={props.value ?? "true"}
      />
      {props.label}
    </label>
  );
}
