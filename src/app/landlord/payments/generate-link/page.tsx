import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { getLandlordPaymentWorkflowData } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { GeneratePaymentLinkForm } from "@/features/landlord/GeneratePaymentLinkForm";
import { formatMoney } from "@/lib/format";

export default async function GeneratePaymentLinkPage() {
  const { leases, tenants, payments, summary, meta } = await getLandlordPaymentWorkflowData();

  return (
    <LandlordPageFrame currentPath="/landlord/payments">
      <DataStateNotice meta={meta} />
      <PageIntro title="Finance Overview" description="Modal-like payment request creation laid on top of the same ledger surface language as Stitch." />

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {payments.slice(0, 3).map((payment) => {
            const tenant = tenants.find((item) => item.id === payment.tenantId);
            return (
              <SurfaceCard key={payment.id} className="p-5">
                <p className="font-semibold text-[#2a3439]">{tenant?.fullName ?? payment.tenantId}</p>
                <p className="mt-1 text-xs text-[#566166]">
                  {payment.unitId || "Unit unavailable"} • {formatMoney(payment.amount)}
                </p>
              </SurfaceCard>
            );
          })}
          <SurfaceCard className="p-6">
            <p className="text-sm text-[#566166]">Outstanding this cycle</p>
            <p className="mt-2 text-4xl font-black text-[#2a3439]">{formatMoney(summary?.totalPending ?? 0)}</p>
          </SurfaceCard>
        </div>

        <SurfaceCard className="p-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#2a3439]">Generate Payment Link</h2>
          <GeneratePaymentLinkForm leases={leases} payments={payments} tenants={tenants} />
        </SurfaceCard>
      </section>
    </LandlordPageFrame>
  );
}
