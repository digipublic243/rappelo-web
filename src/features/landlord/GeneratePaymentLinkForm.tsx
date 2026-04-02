"use client";

import { useActionState } from "react";
import { AppForm, FormInlineError, FormInlineSuccess, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { generatePaymentLinkAction } from "@/features/landlord/actions";
import { initialPaymentWorkflowActionState } from "@/features/landlord/payment-workflow-state";
import type { Lease, Payment, Tenant } from "@/types/domain";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";
import { formatDate, formatMoney } from "@/lib/format";

interface GeneratePaymentLinkFormProps {
  leases: Lease[];
  tenants: Tenant[];
  payments: Payment[];
}

export function GeneratePaymentLinkForm({ leases, tenants, payments }: GeneratePaymentLinkFormProps) {
  const [state, formAction, pending] = useActionState(generatePaymentLinkAction, initialPaymentWorkflowActionState);
  useSyncGlobalApiError(state.error, { title: "Erreur de lien de paiement", scope: "payments" });
  const pendingPayments = payments.filter((payment) => payment.status === "pending");

  return (
    <AppForm action={formAction} className="mt-6 space-y-4">
      <FormField
        defaultValue={leases[0]?.id}
        label="Bail concerné"
        name="leaseId"
        options={leases.map((lease) => {
          const tenant = tenants.find((item) => item.id === lease.tenantId);
          return {
            label: `${tenant?.fullName ?? lease.tenantId} — ${lease.lease_number}`,
            value: lease.id,
          };
        })}
        type="select"
      />

      <FormField
        defaultValue=""
        label="Paiement existant"
        name="paymentId"
        options={[
          { label: "Créer un nouveau paiement", value: "" },
          ...pendingPayments.map((payment) => ({
            label: `${payment.tenantName ?? tenants.find((tenant) => tenant.id === payment.tenantId)?.fullName ?? payment.tenantId} — ${payment.unitId} — ${formatMoney(payment.amount)}`,
            value: payment.id,
          })),
        ]}
        type="select"
      />

      <FormField
        helperText="Le locataire et le montant seront déterminés automatiquement à partir du bail sélectionné."
        label="Date d’échéance"
        name="due_date"
        required
        type="date"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          defaultValue="cash"
          label="Passerelle"
          name="gateway"
          options={[
            { label: "Espèces", value: "cash" },
            { label: "Virement bancaire", value: "bank_transfer" },
            { label: "EasyPay", value: "easypay" },
          ]}
          type="select"
        />
        <FormField defaultValue="48" label="Expiration (heures)" name="expires_in_hours" required type="number" />
      </div>

      <FormField
        defaultValue="Demande de paiement sécurisée pour l’échéance en cours. Merci d’utiliser le lien généré pour finaliser le règlement."
        label="Note interne"
        name="notes"
        rows={5}
        type="textarea"
      />

      <FormInlineError message={state.error} />
      {state.errorDetails?.length ? (
        <div className="rounded-xl border border-[var(--danger-border)] bg-white px-4 py-4">
          <p className="text-sm font-bold text-[var(--danger)]">Détails de l’erreur :</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--danger-muted)]">
            {state.errorDetails.map((detail) => (
              <li key={detail}>{detail}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <FormInlineSuccess message={state.message} />
      {state.linkUrl ? (
        <div className="rounded-xl bg-[var(--surface-low)] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--subtle-foreground)]">Lien généré</p>
          <p className="mt-2 break-all text-sm font-semibold text-[var(--foreground)]">{state.linkUrl}</p>
          {state.expiresAt ? (
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Expire le {formatDate(state.expiresAt)}
            </p>
          ) : null}
          {state.gatewayReference ? (
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              Référence passerelle : {state.gatewayReference}
            </p>
          ) : null}
          {state.gatewayUrl ? (
            <p className="mt-2 break-all text-xs text-[var(--muted-foreground)]">
              URL passerelle : {state.gatewayUrl}
            </p>
          ) : (
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">
              L’URL de passerelle restera vide tant que l’intégration EasyPay n’est pas câblée côté backend.
            </p>
          )}
        </div>
      ) : null}

      <FormSubmitButton className="w-full rounded-lg px-6 text-sm" disabled={pending}>
        {pending ? "Génération..." : "Générer le lien"}
      </FormSubmitButton>
    </AppForm>
  );
}
