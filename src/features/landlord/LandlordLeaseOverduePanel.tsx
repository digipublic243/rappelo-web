"use client";

import { useActionState } from "react";
import {
  AppForm,
  FormInlineError,
  FormInlineSuccess,
  FormSubmitButton,
} from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";
import { alertLeaseOverdueAction } from "@/features/landlord/actions";
import { initialLeaseOverdueActionState } from "@/features/landlord/lease-overdue-state";

interface LandlordLeaseOverduePanelProps {
  leaseId: string;
  canAlert: boolean;
}

export function LandlordLeaseOverduePanel({
  leaseId,
  canAlert,
}: LandlordLeaseOverduePanelProps) {
  const [state, formAction, pending] = useActionState(
    alertLeaseOverdueAction,
    initialLeaseOverdueActionState,
  );

  useSyncGlobalApiError(state.error, {
    title: "Erreur de retard de bail",
    scope: "leases",
  });

  return (
    <AppForm action={formAction} className="space-y-3">
      <FormField name="leaseId" type="hidden" value={leaseId} />
      <FormInlineError message={state.error} />
      {state.errorDetails?.length ? (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--danger) 30%,var(--background))] bg-white px-4 py-4">
          <p className="text-sm font-bold text-[var(--danger)]">Détails de l’erreur :</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color-mix(in_srgb,var(--danger) 72%,var(--background))]">
            {state.errorDetails.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <FormInlineSuccess message={state.message} />
      <FormSubmitButton
        className="w-full rounded-lg px-6 text-sm"
        disabled={!canAlert || pending}
      >
        {pending ? "Envoi..." : "Envoyer une alerte de retard"}
      </FormSubmitButton>
    </AppForm>
  );
}
