import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatMoney, paymentStatusLabel } from "@/lib/format";
import { getTenantPaymentsData } from "@/features/tenant/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function TenantPaymentsPage() {
  const { payments, meta } = await getTenantPaymentsData();

  return (
    <TenantPageFrame currentPath="/tenant/payments">
      <DataStateNotice meta={meta} />
      <PageIntro
        title="Financial Ledger"
        description="Tenant-facing billing summary and payment history with the same tonal hierarchy as Stitch."
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Upcoming", "0$"],
          ["Paid YTD", "0$"],
          ["Refunds", "0$"],
          ["Methods", "Cash + EasyPay"],
        ].map(([label, value]) => (
          <SurfaceCard key={label} className="p-5">
            <p className="text-sm font-medium text-[#566166]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#2a3439]">{value}</p>
          </SurfaceCard>
        ))}
      </section>

      <SurfaceCard className="overflow-hidden">
        <div className="border-b border-[#e8eff3] px-6 py-5">
          <h2 className="text-xl font-bold text-[#2a3439]">Payment History</h2>
        </div>
        <table className="w-full min-w-[860px]">
          <thead className="bg-[#f0f4f7] text-left">
            <tr>
              {["Payment Date", "Amount", "Method", "Status", "Lease"].map(
                (label) => (
                  <th
                    key={label}
                    className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-[#566166]"
                  >
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t border-[#e8eff3]">
                <td className="px-8 py-5 text-sm text-[#566166]">
                  {formatDate(payment.paidAt ?? payment.dueDate)}
                </td>
                <td className="px-8 py-5 text-sm font-semibold text-[#2a3439]">
                  {formatMoney(payment.amount)}
                </td>
                <td className="px-8 py-5 text-sm uppercase text-[#566166]">
                  {payment.method}
                </td>
                <td className="px-8 py-5">
                  <StatusBadge
                    status={payment.status}
                    label={paymentStatusLabel(payment.status)}
                  />
                </td>
                <td className="px-8 py-5 text-sm text-[#566166]">
                  {payment.leaseId ?? "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SurfaceCard>
    </TenantPageFrame>
  );
}
