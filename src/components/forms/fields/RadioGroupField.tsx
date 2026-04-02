"use client";

import { cn } from "@/lib/cn";
import { useAppFormContext } from "@/components/forms/AppForm";
import { formFieldLabelClassName, formHintClassName } from "@/components/forms/form-styles";
import type { RadioGroupFieldProps } from "@/components/forms/fields/types";

export function RadioGroupField(props: RadioGroupFieldProps) {
  const form = useAppFormContext();
  const storedValue = form?.getValue(props.name);
  const resolvedValue = props.value ?? (storedValue !== undefined ? String(storedValue) : "");

  return (
    <div className={props.className}>
      {props.label ? <p className={cn(formFieldLabelClassName, "mb-3")}>{props.label}</p> : null}
      <div className="space-y-3">
        {props.options.map((option) => {
          const active = resolvedValue === option.value;
          return (
            <label
              key={`${props.name}-${option.value}`}
              className={cn(
                "flex items-center justify-between rounded-2xl border px-4 py-4",
                active ? props.activeOptionClassName : props.inactiveOptionClassName,
              )}
            >
              <div>
                <p className="text-lg font-semibold capitalize">{option.label}</p>
                {option.description ? <p className="text-sm text-white/70">{option.description}</p> : null}
              </div>
              <input
                checked={active}
                className="h-5 w-5 accent-success"
                name={props.name}
                onChange={() => {
                  form?.setValue(props.name, option.value);
                  props.onChange?.(option.value);
                }}
                type="radio"
                value={option.value}
              />
            </label>
          );
        })}
      </div>
      {props.helperText ? <p className={cn(formHintClassName, "mt-2")}>{props.helperText}</p> : null}
    </div>
  );
}
