"use client";

import { useActionState } from "react";
import { generatePaymentLinkAction } from "@/features/landlord/actions";
import { initialPaymentWorkflowActionState } from "@/features/landlord/payment-workflow-state";
import type { Lease, Payment, Tenant } from "@/types/domain";

interface GeneratePaymentLinkFormProps {
  leases: Lease[];
  tenants: Tenant[];
  payments: Payment[];
}

export function GeneratePaymentLinkForm({ leases, tenants, payments }: GeneratePaymentLinkFormProps) {
  const [state, formAction, pending] = useActionState(generatePaymentLinkAction, initialPaymentWorkflowActionState);
  const pendingPayments = payments.filter((payment) => payment.status === "pending");

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-[#566166]">
        Select Lease
        <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue={leases[0]?.id} name="leaseId">
          {leases.map((lease) => {
            const tenant = tenants.find((item) => item.id === lease.tenantId);
            return (
              <option key={lease.id} value={lease.id}>
                {tenant?.fullName ?? lease.tenantId} — {lease.unitId}
              </option>
            );
          })}
        </select>
      </label>

      <label className="block text-sm font-medium text-[#566166]">
        Tenant
        <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue={tenants[0]?.id} name="tenantId">
          {tenants.map((tenant) => (
            <option key={tenant.id} value={tenant.id}>
              {tenant.fullName}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-medium text-[#566166]">
        Existing Pending Payment
        <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue="" name="paymentId">
          <option value="">Create a fresh payment first</option>
          {pendingPayments.map((payment) => (
            <option key={payment.id} value={payment.id}>
              {payment.tenantId} — {payment.unitId} — {payment.amount}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-[#566166]">
          Amount
          <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue="2450" name="amount" required type="number" />
        </label>
        <label className="block text-sm font-medium text-[#566166]">
          Due Date
          <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" name="due_date" required type="date" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-[#566166]">
          Gateway
          <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue="cash" name="gateway">
            <option value="cash">Cash</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="easypay">EasyPay</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-[#566166]">
          Expires In
          <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue="48" name="expires_in_hours" required type="number" />
        </label>
      </div>

      <label className="block text-sm font-medium text-[#566166]">
        Message
        <textarea
          className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3"
          defaultValue="Secure payment request for the current cycle. Please complete settlement through the generated link."
          name="notes"
          rows={5}
        />
      </label>

      {state.error ? <p className="rounded-xl bg-[#fe8983]/20 px-4 py-3 text-sm text-[#752121]">{state.error}</p> : null}
      {state.message ? <p className="rounded-xl bg-[#d8e3fb]/40 px-4 py-3 text-sm text-[#485367]">{state.message}</p> : null}
      {state.linkUrl ? (
        <div className="rounded-xl bg-[#f0f4f7] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#717c82]">Generated Link</p>
          <p className="mt-2 break-all text-sm font-semibold text-[#2a3439]">{state.linkUrl}</p>
        </div>
      ) : null}

      <button className="w-full rounded-lg bg-[#545f73] px-6 py-3 text-sm font-semibold text-[#f6f7ff]" disabled={pending} type="submit">
        {pending ? "Generating..." : "Generate and Copy Link"}
      </button>
    </form>
  );
}
