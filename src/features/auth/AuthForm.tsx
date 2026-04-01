"use client";

import { useActionState, useState } from "react";
import type { AuthActionState } from "@/features/auth/state";
import { extractLocalPhoneDigits } from "@/features/auth/phone";

interface AuthField {
  name: string;
  type?: string;
  placeholder: string;
  defaultValue?: string;
}

interface AuthFormProps {
  action: (state: AuthActionState, formData: FormData) => Promise<AuthActionState>;
  initialState: AuthActionState;
  fields: AuthField[];
  submitLabel: string;
  helperText?: string;
}

export function AuthForm({ action, initialState, fields, submitLabel, helperText }: AuthFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [phoneNumber, setPhoneNumber] = useState(() => {
    const phoneField = fields.find((field) => field.name === "phone_number");
    return extractLocalPhoneDigits(phoneField?.defaultValue ?? "");
  });

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {fields.map((field) =>
        field.name === "phone_number" ? (
          <div key={field.name} className="space-y-2">
            <div className="flex overflow-hidden rounded-2xl border border-[#d9e4ea] bg-white">
              <span className="inline-flex items-center border-r border-[#d9e4ea] bg-[#f8fbfd] px-4 text-sm font-semibold text-[#566166]">
                243
              </span>
              <input
                className="w-full bg-white px-4 py-3 outline-none"
                inputMode="numeric"
                maxLength={9}
                name={field.name}
                onChange={(event) => setPhoneNumber(extractLocalPhoneDigits(event.target.value))}
                placeholder="XXXXXXXXX"
                type="text"
                value={phoneNumber}
              />
            </div>
            <p className="text-[11px] text-[#717c82]">Enter only the last 9 digits. The app submits them as `243XXXXXXXXX`.</p>
          </div>
        ) : (
          <input
            key={field.name}
            className="w-full rounded-2xl border border-[#d9e4ea] bg-white px-4 py-3"
            defaultValue={field.defaultValue}
            name={field.name}
            placeholder={field.placeholder}
            type={field.type ?? "text"}
          />
        ),
      )}
      {helperText ? <p className="text-xs text-[#717c82]">{helperText}</p> : null}
      {state.error ? <p className="rounded-xl bg-[#fe8983]/20 px-4 py-3 text-sm text-[#752121]">{state.error}</p> : null}
      <button
        className="w-full rounded-2xl bg-[#545f73] px-4 py-3 font-semibold text-[#f6f7ff] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? "Working..." : submitLabel}
      </button>
    </form>
  );
}
