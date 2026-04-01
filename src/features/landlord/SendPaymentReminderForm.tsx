"use client";

import { useActionState } from "react";
import { sendPaymentReminderAction } from "@/features/landlord/actions";
import { initialPaymentWorkflowActionState } from "@/features/landlord/payment-workflow-state";
import type { Payment, Tenant } from "@/types/domain";
import { formatMoney } from "@/lib/format";

interface SendPaymentReminderFormProps {
  payments: Payment[];
  tenants: Tenant[];
}

export function SendPaymentReminderForm({ payments, tenants }: SendPaymentReminderFormProps) {
  const [state, formAction, pending] = useActionState(sendPaymentReminderAction, initialPaymentWorkflowActionState);
  const remindablePayments = payments.filter((payment) => payment.status === "pending");

  return (
    <form action={formAction} className="mt-5 space-y-4">
      <label className="block text-sm font-medium text-[#566166]">
        Payment
        <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue={remindablePayments[0]?.id} name="paymentId">
          {remindablePayments.map((payment) => {
            const tenant = tenants.find((item) => item.id === payment.tenantId);
            return (
              <option key={payment.id} value={payment.id}>
                {tenant?.fullName ?? payment.tenantId} — {payment.unitId} — {formatMoney(payment.amount)}
              </option>
            );
          })}
        </select>
      </label>
      <label className="block text-sm font-medium text-[#566166]">
        Reminder Style
        <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" name="reminder_style">
          <option value="soft">Soft Reminder</option>
          <option value="firm">Firm Reminder</option>
          <option value="final">Final Notice</option>
        </select>
      </label>
      <label className="block text-sm font-medium text-[#566166]">
        Message
        <textarea
          className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3"
          defaultValue="We're reaching out because we have not yet received your scheduled payment. Please review your balance and settle it as soon as possible."
          name="message"
          rows={6}
        />
      </label>

      {state.error ? <p className="rounded-xl bg-[#fe8983]/20 px-4 py-3 text-sm text-[#752121]">{state.error}</p> : null}
      {state.message ? <p className="rounded-xl bg-[#d8e3fb]/40 px-4 py-3 text-sm text-[#485367]">{state.message}</p> : null}

      <button className="rounded-lg bg-[#545f73] px-6 py-3 text-sm font-semibold text-[#f6f7ff]" disabled={pending} type="submit">
        {pending ? "Sending..." : "Send Reminder"}
      </button>
    </form>
  );
}
