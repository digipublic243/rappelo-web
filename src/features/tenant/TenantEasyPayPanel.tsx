"use client";

import { useActionState, useEffect, useState } from "react";
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
import { toBackendPhoneNumber } from "@/features/auth/phone";
import type { Payment } from "@/types/domain";
import { formatDate, formatPhone } from "@/lib/format";

interface TenantEasyPayPanelProps {
  payment: Payment;
  accountPhone?: string;
}

function EasyPayActionForm({
  action,
  children,
  paymentId,
  onBeforeSubmit,
  submitLabel,
}: {
  action: (state: typeof initialTenantEasyPayActionState, formData: FormData) => Promise<typeof initialTenantEasyPayActionState>;
  children: React.ReactNode;
  paymentId: string;
  onBeforeSubmit?: () => void;
  submitLabel: string;
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
        <div className="rounded-xl border border-[var(--danger-border)] bg-[var(--surface-card)] px-4 py-4">
          <p className="text-sm font-bold text-[var(--danger)]">Détails de l’erreur :</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--danger)]/80">
            {state.errorDetails.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <FormInlineSuccess message={state.message} />
      {children}
      <FormSubmitButton
        className="w-full rounded-lg px-6 text-sm"
        disabled={pending}
        onClick={onBeforeSubmit}
      >
        {pending ? "Traitement..." : submitLabel}
      </FormSubmitButton>
    </AppForm>
  );
}

export function TenantEasyPayPanel({
  payment,
  accountPhone,
}: TenantEasyPayPanelProps) {
  const storageKey = `tenant-easypay-phone:${payment.id}`;
  const [phoneSource, setPhoneSource] = useState<"account" | "other">(
    accountPhone ? "account" : "other",
  );
  const [otherPhone, setOtherPhone] = useState("");
  const [usedPhone, setUsedPhone] = useState<string | null>(() =>
    typeof window === "undefined"
      ? null
      : window.sessionStorage.getItem(`tenant-easypay-phone:${payment.id}`),
  );
  const canInitiate = payment.status === "pending";
  const canCheck =
    payment.status === "pending" ||
    Boolean(payment.easypayReferenceId || payment.easypayTransactionId);

  function rememberSelectedPhone() {
    const selectedPhone =
      phoneSource === "other"
        ? toBackendPhoneNumber(otherPhone)
        : toBackendPhoneNumber(accountPhone ?? "");

    if (!selectedPhone) {
      return;
    }

    window.sessionStorage.setItem(storageKey, selectedPhone);
    setUsedPhone(selectedPhone);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-[var(--foreground)]">Paiement EasyPay</h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Lancez la collecte EasyPay depuis votre numéro enregistré ou un autre
          numéro mobile, puis vérifiez le statut une fois la demande validée sur
          votre téléphone.
        </p>
      </div>

      <div className="grid gap-4 rounded-[28px] border border-[var(--outline-soft)] bg-[var(--surface-soft)] p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--subtle-foreground)]">
              Référence EasyPay
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
              {payment.easypayReferenceId ?? "Pas encore générée"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--subtle-foreground)]">
              Transaction
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
              {payment.easypayTransactionId ?? "En attente"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--subtle-foreground)]">
              Opérateur
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
              {payment.easypayProvider ?? "Déterminé par EasyPay"}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--subtle-foreground)]">
              Dernière vérification
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
              {payment.easypayLastCheck ? formatDate(payment.easypayLastCheck) : "Jamais vérifié"}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--subtle-foreground)]">
              Numéro utilisé
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">
              {usedPhone ? formatPhone(usedPhone) : "Aucun numéro enregistré pour ce paiement"}
            </p>
          </div>
        </div>
        <p className="text-sm text-[var(--muted-foreground)]">
          Tentatives de synchronisation :{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {payment.easypayAttempts ?? 0}
          </span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {canInitiate ? (
          <EasyPayActionForm
            action={initiateTenantEasyPayAction}
            onBeforeSubmit={rememberSelectedPhone}
            paymentId={payment.id}
            submitLabel="Payer via EasyPay"
          >
            <div className="space-y-4 text-left">
              <FormField
                activeOptionClassName="border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                inactiveOptionClassName="border-[var(--outline-soft)] bg-[var(--surface-card)] text-[var(--foreground)]"
                label="Numéro à utiliser"
                name="phone_source"
                onChange={(value) => setPhoneSource(value as "account" | "other")}
                options={[
                  {
                    label: "Mon numéro",
                    value: "account",
                    description: accountPhone
                      ? formatPhone(accountPhone)
                      : "Aucun numéro valide sur le compte",
                  },
                  {
                    label: "Un autre numéro",
                    value: "other",
                    description: "Saisir un numéro mobile congolais pour EasyPay",
                  },
                ]}
                type="radio-group"
                value={phoneSource}
              />

              {phoneSource === "other" ? (
                <FormField
                  helperText="Saisissez les 9 derniers chiffres, le préfixe +243 sera appliqué au moment de l’envoi."
                  inputMode="numeric"
                  label="Autre numéro"
                  maxLength={9}
                  name="other_phone_number"
                  onChange={(event) => setOtherPhone(event.target.value)}
                  placeholder="899090907"
                  type="text"
                  value={otherPhone}
                />
              ) : null}
            </div>
          </EasyPayActionForm>
        ) : null}

        {canCheck ? (
          <EasyPayActionForm
            action={checkTenantEasyPayStatusAction}
            paymentId={payment.id}
            submitLabel="Vérifier le statut"
          >
            <div className="rounded-xl border border-[var(--outline-soft)] bg-[var(--surface-soft)] px-4 py-4 text-sm text-[var(--muted-foreground)]">
              Vérifiez si le paiement a été accepté ou rejeté par votre opérateur
              mobile après la demande EasyPay.
            </div>
          </EasyPayActionForm>
        ) : null}
      </div>
    </div>
  );
}
