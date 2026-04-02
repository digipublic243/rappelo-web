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
import {
  checkTenantEasyPayStatusAction,
  initiateTenantEasyPayAction,
} from "@/features/tenant/actions";
import { initialTenantEasyPayActionState } from "@/features/tenant/payment-easypay-state";
import type { Payment } from "@/types/domain";
import { formatDate } from "@/lib/format";

interface TenantEasyPayPanelProps {
  payment: Payment;
}

function EasyPayActionForm({
  action,
  children,
  paymentId,
}: {
  action: (state: typeof initialTenantEasyPayActionState, formData: FormData) => Promise<typeof initialTenantEasyPayActionState>;
  children: React.ReactNode;
  paymentId: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    action,
    initialTenantEasyPayActionState,
  );

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
    <AppForm action={formAction} className="space-y-3">
      <FormField name="paymentId" type="hidden" value={paymentId} />
      <FormInlineError message={state.error} />
      {state.errorDetails?.length ? (
        <div className="rounded-xl border border-[#f2b7b3] bg-white px-4 py-4">
          <p className="text-sm font-bold text-[#752121]">Détails de l’erreur :</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[#5d3b39]">
            {state.errorDetails.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <FormInlineSuccess message={state.message} />
      <FormSubmitButton className="w-full rounded-lg px-6 text-sm" disabled={pending}>
        {pending ? "Traitement..." : children}
      </FormSubmitButton>
    </AppForm>
  );
}

export function TenantEasyPayPanel({ payment }: TenantEasyPayPanelProps) {
  const canInitiate = payment.status === "pending";
  const canCheck =
    payment.status === "pending" ||
    Boolean(payment.easypayReferenceId || payment.easypayTransactionId);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[#2a3439]">Paiement EasyPay</h2>
        <p className="mt-2 text-sm text-[#566166]">
          Lancez la collecte EasyPay depuis votre numéro enregistré, puis vérifiez le
          statut une fois la demande validée sur votre téléphone.
        </p>
      </div>

      <div className="grid gap-4 rounded-[28px] border border-[#e8eff3] bg-[#f8fbfd] p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#717c82]">
              Référence EasyPay
            </p>
            <p className="mt-2 text-sm font-semibold text-[#2a3439]">
              {payment.easypayReferenceId ?? "Pas encore générée"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#717c82]">
              Transaction
            </p>
            <p className="mt-2 text-sm font-semibold text-[#2a3439]">
              {payment.easypayTransactionId ?? "En attente"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#717c82]">
              Opérateur
            </p>
            <p className="mt-2 text-sm font-semibold text-[#2a3439]">
              {payment.easypayProvider ?? "Déterminé par EasyPay"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#717c82]">
              Dernière vérification
            </p>
            <p className="mt-2 text-sm font-semibold text-[#2a3439]">
              {payment.easypayLastCheck ? formatDate(payment.easypayLastCheck) : "Jamais vérifié"}
            </p>
          </div>
        </div>
        <p className="text-sm text-[#566166]">
          Tentatives de synchronisation :{" "}
          <span className="font-semibold text-[#2a3439]">
            {payment.easypayAttempts ?? 0}
          </span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {canInitiate ? (
          <EasyPayActionForm
            action={initiateTenantEasyPayAction}
            paymentId={payment.id}
          >
            Payer via EasyPay
          </EasyPayActionForm>
        ) : null}

        {canCheck ? (
          <EasyPayActionForm
            action={checkTenantEasyPayStatusAction}
            paymentId={payment.id}
          >
            Vérifier le statut
          </EasyPayActionForm>
        ) : null}
      </div>
    </div>
  );
}
