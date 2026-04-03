"use client";

import { useActionState, useState } from "react";
import {
  AppForm,
  FormHelperText,
  FormInlineError,
  FormInlineSuccess,
  FormSubmitButton,
} from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";
import { Button } from "@/components/ui/Button";
import { generatePaymentLinkForPaymentAction } from "@/features/landlord/actions";
import {
  initialPaymentWorkflowActionState,
  type PaymentWorkflowActionState,
} from "@/features/landlord/payment-workflow-state";
import type { Payment } from "@/types/domain";
import { formatDate, formatPaymentMethod } from "@/lib/format";

interface PaymentLinkPanelProps {
  payment: Payment;
}

export function PaymentLinkPanel({ payment }: PaymentLinkPanelProps) {
  const [copied, setCopied] = useState(false);
  const [state, formAction, pending] = useActionState<
    PaymentWorkflowActionState,
    FormData
  >(generatePaymentLinkForPaymentAction, initialPaymentWorkflowActionState);

  useSyncGlobalApiError(state.error, {
    title: "Erreur de lien de paiement",
    scope: "payments",
  });

  const resolvedLink = state.linkUrl ?? "";
  const resolvedGatewayUrl = state.gatewayUrl ?? "";

  async function copyLink() {
    if (!resolvedLink) {
      return;
    }

    await navigator.clipboard.writeText(resolvedLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Lien de paiement</h2>
        <p className="mt-2 text-sm text-secondary-2">
          Générez un lien partageable pour ce paiement, puis copiez-le pour
          l&apos;envoyer au locataire.
        </p>
      </div>

      <AppForm action={formAction} className="space-y-4">
        <FormField name="paymentId" type="hidden" value={payment.id} />
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            defaultValue={payment.method === "bank_transfer" ? "bank_transfer" : payment.method === "easypay" ? "easypay" : "cash"}
            label="Passerelle"
            name="gateway"
            options={[
              { label: "Espèces", value: "cash" },
              { label: "Virement bancaire", value: "bank_transfer" },
              { label: "EasyPay", value: "easypay" },
            ]}
            type="select"
          />
          <FormField
            defaultValue="48"
            label="Expiration (heures)"
            min={1}
            name="expires_in_hours"
            step={1}
            type="number"
          />
        </div>
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
        <FormHelperText>
          Le lien est généré pour le paiement du {formatDate(payment.dueDate)}.
          Le mode par défaut suit le paiement actuel : {formatPaymentMethod(payment.method)}.
        </FormHelperText>
        <FormSubmitButton className="w-full rounded-lg px-6 text-sm" disabled={pending}>
          {pending ? "Génération..." : "Générer le lien"}
        </FormSubmitButton>
      </AppForm>

      <div className="rounded-[28px] border border-secondary-1 bg-secondary-4 p-5">
        <div className="grid gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
              Lien partageable
            </p>
            <div className="mt-2 flex flex-col gap-3 md:flex-row">
              <input
                className="w-full rounded-xl border border-secondary-1 bg-background px-4 py-3 text-sm text-foreground outline-none"
                readOnly
                value={resolvedLink || "Générez un lien pour l’afficher ici."}
              />
              <Button
                disabled={!resolvedLink}
                onClick={copyLink}
                type="button"
                variant="secondary"
              >
                {copied ? "Copié" : "Copier"}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
                Référence passerelle
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {state.gatewayReference ?? "Aucune"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
                Expire le
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {state.expiresAt ? formatDate(state.expiresAt) : "Non généré"}
              </p>
            </div>
          </div>

          {resolvedGatewayUrl ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
                URL passerelle
              </p>
              <a
                className="mt-2 block break-all text-sm font-semibold text-primary underline"
                href={resolvedGatewayUrl}
                rel="noreferrer"
                target="_blank"
              >
                {resolvedGatewayUrl}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
