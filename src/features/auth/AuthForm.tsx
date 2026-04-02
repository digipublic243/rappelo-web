"use client";

import { useActionState, useState } from "react";
import { AppForm, FormHelperText, FormInlineError, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import type { AuthActionState } from "@/features/auth/state";
import { toPrefixedPhoneNumber } from "@/features/auth/phone";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";

interface AuthField {
  name: string;
  type?: "text" | "password" | "number" | "date" | "email";
  fieldKind?: "phone";
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
  useSyncGlobalApiError(state.error, { title: "Erreur d’authentification", scope: "auth" });
  const [phoneNumber, setPhoneNumber] = useState(() => {
    const phoneField = fields.find((field) => field.name === "phone_number");
    return toPrefixedPhoneNumber(phoneField?.defaultValue ?? "");
  });

  return (
    <AppForm action={formAction} className="mt-6 space-y-4">
      {fields.map((field) =>
        field.fieldKind === "phone" ? (
          <FormField
            key={field.name}
            helperText="Saisissez uniquement les 9 derniers chiffres. L’application les envoie sous la forme `243XXXXXXXXX`."
            name={field.name}
            onChange={setPhoneNumber}
            type="phone"
            value={phoneNumber}
          />
        ) : (
          <FormField
            key={field.name}
            defaultValue={field.defaultValue}
            name={field.name}
            placeholder={field.placeholder}
            type={field.type ?? "text"}
          />
        ),
      )}
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
      <FormInlineError message={state.error} />
      {state.errorDetails?.length ? (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--danger) 30%,var(--background))] bg-white px-4 py-4">
          <p className="text-sm font-bold text-[var(--danger)]">Détails :</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color-mix(in_srgb,var(--danger) 72%,var(--background))]">
            {state.errorDetails.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <FormSubmitButton className="w-full" disabled={pending}>
        {pending ? "Traitement..." : submitLabel}
      </FormSubmitButton>
    </AppForm>
  );
}
