"use client";

import { useActionState } from "react";
import { AppForm, FormInlineError, FormInlineSuccess, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { sendPaymentReminderAction } from "@/features/landlord/actions";
import { initialPaymentWorkflowActionState } from "@/features/landlord/payment-workflow-state";
import type { Payment, Tenant } from "@/types/domain";
import { formatMoney } from "@/lib/format";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";

interface SendPaymentReminderFormProps {
  payments: Payment[];
  tenants: Tenant[];
}

export function SendPaymentReminderForm({ payments, tenants }: SendPaymentReminderFormProps) {
  const [state, formAction, pending] = useActionState(sendPaymentReminderAction, initialPaymentWorkflowActionState);
  useSyncGlobalApiError(state.error, { title: "Reminder Dispatch Error", scope: "payments" });
  const remindablePayments = payments.filter((payment) => payment.status === "pending");

  return (
    <AppForm action={formAction} className="mt-5 space-y-4">
      <FormField
        defaultValue={remindablePayments[0]?.id}
        label="Payment"
        name="paymentId"
        options={remindablePayments.map((payment) => {
          const tenant = tenants.find((item) => item.id === payment.tenantId);
          return {
            label: `${tenant?.fullName ?? payment.tenantId} — ${payment.unitId} — ${formatMoney(payment.amount)}`,
            value: payment.id,
          };
        })}
        type="select"
      />
      <FormField
        label="Reminder Style"
        name="reminder_style"
        options={[
          { label: "Soft Reminder", value: "soft" },
          { label: "Firm Reminder", value: "firm" },
          { label: "Final Notice", value: "final" },
        ]}
        type="select"
      />
      <FormField
        defaultValue="We're reaching out because we have not yet received your scheduled payment. Please review your balance and settle it as soon as possible."
        label="Message"
        name="message"
        rows={6}
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

      <FormSubmitButton className="rounded-lg px-6 text-sm" disabled={pending}>
        {pending ? "Sending..." : "Send Reminder"}
      </FormSubmitButton>
    </AppForm>
  );
}
