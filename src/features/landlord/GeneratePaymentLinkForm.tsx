"use client";

import { useActionState } from "react";
import { AppForm, FormInlineError, FormInlineSuccess, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { generatePaymentLinkAction } from "@/features/landlord/actions";
import { initialPaymentWorkflowActionState } from "@/features/landlord/payment-workflow-state";
import type { Lease, Payment, Tenant } from "@/types/domain";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";

interface GeneratePaymentLinkFormProps {
  leases: Lease[];
  tenants: Tenant[];
  payments: Payment[];
}

export function GeneratePaymentLinkForm({ leases, tenants, payments }: GeneratePaymentLinkFormProps) {
  const [state, formAction, pending] = useActionState(generatePaymentLinkAction, initialPaymentWorkflowActionState);
  useSyncGlobalApiError(state.error, { title: "Payment Link Error", scope: "payments" });
  const pendingPayments = payments.filter((payment) => payment.status === "pending");

  return (
    <AppForm action={formAction} className="mt-6 space-y-4">
      <FormField
        defaultValue={leases[0]?.id}
        label="Select Lease"
        name="leaseId"
        options={leases.map((lease) => {
          const tenant = tenants.find((item) => item.id === lease.tenantId);
          return {
            label: `${tenant?.fullName ?? lease.tenantId} — ${lease.unitId}`,
            value: lease.id,
          };
        })}
        type="select"
      />

      <FormField
        defaultValue={tenants[0]?.id}
        label="Tenant"
        name="tenantId"
        options={tenants.map((tenant) => ({
          label: tenant.fullName,
          value: tenant.id,
        }))}
        type="select"
      />

      <FormField
        defaultValue=""
        label="Existing Pending Payment"
        name="paymentId"
        options={[
          { label: "Create a fresh payment first", value: "" },
          ...pendingPayments.map((payment) => ({
            label: `${payment.tenantId} — ${payment.unitId} — ${payment.amount}`,
            value: payment.id,
          })),
        ]}
        type="select"
      />

      <div className="grid gap-4 md:grid-cols-2">
        <FormField defaultValue="2450" label="Amount" name="amount" required type="number" />
        <FormField label="Due Date" name="due_date" required type="date" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          defaultValue="cash"
          label="Gateway"
          name="gateway"
          options={[
            { label: "Cash", value: "cash" },
            { label: "Bank Transfer", value: "bank_transfer" },
            { label: "EasyPay", value: "easypay" },
          ]}
          type="select"
        />
        <FormField defaultValue="48" label="Expires In" name="expires_in_hours" required type="number" />
      </div>

      <FormField
        defaultValue="Secure payment request for the current cycle. Please complete settlement through the generated link."
        label="Message"
        name="notes"
        rows={5}
        type="textarea"
      />

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
      {state.linkUrl ? (
        <div className="rounded-xl bg-[#f0f4f7] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#717c82]">Generated Link</p>
          <p className="mt-2 break-all text-sm font-semibold text-[#2a3439]">{state.linkUrl}</p>
        </div>
      ) : null}

      <FormSubmitButton className="w-full rounded-lg px-6 text-sm" disabled={pending}>
        {pending ? "Generating..." : "Generate and Copy Link"}
      </FormSubmitButton>
    </AppForm>
  );
}
