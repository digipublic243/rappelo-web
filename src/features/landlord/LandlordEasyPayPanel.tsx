"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  AppForm,
  FormInlineError,
  FormInlineSuccess,
  FormSubmitButton,
} from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";
import { checkLandlordEasyPayStatusAction } from "@/features/landlord/actions";
import {
  initialLandlordEasyPayActionState,
  type LandlordEasyPayActionState,
} from "@/features/landlord/payment-easypay-state";
import type { Payment } from "@/types/domain";
import { formatDate, formatPhone, paymentStatusLabel } from "@/lib/format";

interface LandlordEasyPayPanelProps {
  payment: Payment;
}

export function LandlordEasyPayPanel({
  payment,
}: LandlordEasyPayPanelProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    LandlordEasyPayActionState,
    FormData
  >(checkLandlordEasyPayStatusAction, initialLandlordEasyPayActionState);

  useSyncGlobalApiError(state.error, {
    title: "Erreur EasyPay",
    scope: "payments",
  });

  useEffect(() => {
    if (state.message) {
      router.refresh();
    }
  }, [router, state.message]);

  return (
    <Surface payment={payment} state={state}>
      <AppForm action={formAction} className="space-y-4">
        <FormField name="paymentId" type="hidden" value={payment.id} />
        <FormInlineError message={state.error} />
        {state.errorDetails?.length ? (
          <div className="rounded-xl border border-[color-mix(in_srgb,var(--danger) 30%,var(--background))] bg-secondary-4 px-4 py-4">
            <p className="text-sm font-bold text-danger">Détails de l’erreur :</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-danger/80">
              {state.errorDetails.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <FormInlineSuccess message={state.message} />
        <FormSubmitButton
          className="w-full rounded-lg px-6 text-sm"
          disabled={pending}
        >
          {pending ? "Vérification..." : "Vérifier le statut EasyPay"}
        </FormSubmitButton>
      </AppForm>
    </Surface>
  );
}

function Surface({
  payment,
  state,
  children,
}: {
  payment: Payment;
  state: LandlordEasyPayActionState;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Suivi EasyPay</h2>
        <p className="mt-2 text-sm text-secondary-2">
          Vérifiez le statut d&apos;une collecte EasyPay, puis consultez les
          dernières références et synchronisations connues pour ce paiement.
        </p>
      </div>

      <div className="grid gap-4 rounded-[28px] border border-secondary-1 bg-background p-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
            Statut du paiement
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {state.easypayStatus ?? paymentStatusLabel(payment.status)}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
            Référence EasyPay
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {payment.easypayGatewayReference ??
              payment.easypayReferenceId ??
              "Pas encore générée"}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
            Transaction
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {payment.easypayTransactionId ?? "En attente"}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
            Opérateur
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {payment.easypayProvider ?? "Déterminé par EasyPay"}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
            Dernière vérification
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {payment.easypayLastCheck
              ? formatDate(payment.easypayLastCheck)
              : "Jamais vérifié"}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
            Tentatives
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {payment.easypayAttempts ?? 0}
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
            Numéro utilisé
          </p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {payment.easypayLastPhoneNumber
              ? formatPhone(payment.easypayLastPhoneNumber)
              : "Aucun numéro remonté"}
          </p>
        </div>
      </div>

      {children}
    </div>
  );
}
