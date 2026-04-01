import Link from "next/link";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, ActionButton } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatMoney, paymentStatusLabel } from "@/lib/format";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getLandlordPaymentsVm } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function PaymentsPage() {
  const { payments, meta } = await getLandlordPaymentsVm();
  const collected = payments.filter((payment) => payment.status === "paid").reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = payments.filter((payment) => payment.status === "pending").reduce((sum, payment) => sum + payment.amount, 0);
  const refunds = payments.filter((payment) => payment.status === "refunded").reduce((sum, payment) => sum + payment.amount, 0);
  const successRate = payments.length > 0 ? ((payments.filter((payment) => payment.status === "paid").length / payments.length) * 100).toFixed(1) : "0.0";

  return (
    <LandlordPageFrame currentPath="/landlord/payments">
      <DataStateNotice meta={meta} />
      <PageIntro
        title="Financial Ledger"
        description="Ledger-style payment history with summary cards, reminders, and link generation flows."
        action={
          <div className="flex flex-wrap gap-3">
            <Link href="/landlord/payments/generate-link">
              <ActionButton>
                <MaterialIcon name="add" className="text-[18px]" />
                New Payment
              </ActionButton>
            </Link>
            <Link href="/landlord/payments/send-reminder">
              <ActionButton variant="secondary">Send Reminder</ActionButton>
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Collected", formatMoney(collected)],
          ["Outstanding", formatMoney(outstanding)],
          ["Success Rate", `${successRate}%`],
          ["Refunds", formatMoney(refunds)],
        ].map(([label, value]) => (
          <SurfaceCard key={label} className="p-5">
            <p className="text-sm font-medium text-[#566166]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#2a3439]">{value}</p>
          </SurfaceCard>
        ))}
      </section>

      <SurfaceCard className="overflow-hidden">
        <table className="w-full min-w-[920px]">
          <thead className="bg-[#f0f4f7] text-left">
            <tr>
              {["Tenant / Unit", "Amount", "Due Date", "Method", "Status"].map((label) => (
                <th key={label} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#566166]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t border-[#e8eff3]">
                <td className="px-6 py-5">
                  <p className="font-semibold text-[#2a3439]">{payment.tenantId}</p>
                  <p className="text-xs text-[#566166]">{payment.unitId}</p>
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-[#2a3439]">{formatMoney(payment.amount)}</td>
                <td className="px-6 py-5 text-sm text-[#566166]">{formatDate(payment.dueDate)}</td>
                <td className="px-6 py-5 text-sm uppercase text-[#566166]">{payment.method}</td>
                <td className="px-6 py-5">
                  <StatusBadge status={payment.status} label={paymentStatusLabel(payment.status)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SurfaceCard>
    </LandlordPageFrame>
  );
}
