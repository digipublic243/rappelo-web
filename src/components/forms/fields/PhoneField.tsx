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
      <div className="flex overflow-hidden rounded-2xl border border-[var(--secondary-1)] bg-[var(--secondary-4)]">
        <span className="inline-flex items-center border-r border-[var(--secondary-1)] bg-[var(--background)] px-4 text-sm font-semibold text-secondary-2">
          {prefix}
        </span>
        <input
          className="w-full bg-[var(--secondary-4)] px-4 py-3 text-foreground outline-none"
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
