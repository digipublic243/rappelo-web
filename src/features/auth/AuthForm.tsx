"use client";

import { useActionState } from "react";
import type { AuthActionState } from "@/features/auth/state";

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

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {fields.map((field) => (
        <input
          key={field.name}
          className="w-full rounded-2xl border border-[#d9e4ea] bg-white px-4 py-3"
          defaultValue={field.defaultValue}
          name={field.name}
          placeholder={field.placeholder}
          type={field.type ?? "text"}
        />
      ))}
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
