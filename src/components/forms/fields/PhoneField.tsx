"use client";

import { FieldShell } from "@/components/forms/fields/FieldShell";
import type { PhoneFieldProps } from "@/components/forms/fields/types";
import {
  CONGO_PHONE_PREFIX,
  extractLocalPhoneDigits,
  toPrefixedPhoneNumber,
} from "@/features/auth/phone";

export function PhoneField(props: PhoneFieldProps) {
  const prefix = props.prefix ?? CONGO_PHONE_PREFIX;
  const submittedValue = toPrefixedPhoneNumber(props.value, prefix);
  const displayedValue = extractLocalPhoneDigits(props.value);

  return (
    <FieldShell
      className={props.className}
      helperText={props.helperText}
      label={props.label}
    >
      <input name={props.name} type="hidden" value={submittedValue} />
      <div className="flex overflow-hidden rounded-2xl border border-[var(--outline-soft)] bg-[var(--surface-card)]">
        <span className="inline-flex items-center border-r border-[var(--outline-soft)] bg-[var(--surface-soft)] px-4 text-sm font-semibold text-[var(--muted-foreground)]">
          {prefix}
        </span>
        <input
          className="w-full bg-[var(--surface-card)] px-4 py-3 text-[var(--foreground)] outline-none"
          inputMode="numeric"
          maxLength={props.maxLength ?? 9}
          onChange={(event) =>
            props.onChange(toPrefixedPhoneNumber(event.target.value, prefix))
          }
          placeholder={props.placeholder ?? "XXXXXXXXX"}
          required={props.required}
          type="text"
          value={displayedValue}
        />
      </div>
    </FieldShell>
  );
}
