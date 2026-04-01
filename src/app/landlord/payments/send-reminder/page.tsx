import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getLandlordPaymentWorkflowData } from "@/features/landlord/api";
import { formatMoney } from "@/lib/format";
import { SendPaymentReminderForm } from "@/features/landlord/SendPaymentReminderForm";

export default async function SendReminderPage() {
  const { payments, tenants, meta } = await getLandlordPaymentWorkflowData();
  const overduePayment = payments.find((payment) => payment.status === "pending") ?? payments[0];
  const relatedTenant = overduePayment ? tenants.find((tenant) => tenant.id === overduePayment.tenantId) : undefined;

  return (
    <LandlordPageFrame currentPath="/landlord/payments">
      <DataStateNotice meta={meta} />
      <PageIntro title="Management Overview" description="Reminder dispatch kept visually separate from the ledger but consistent with the same shell." />

      <section className="grid gap-8 lg:grid-cols-2">
        <SurfaceCard className="p-6">
          <h2 className="text-xl font-bold text-[#2a3439]">Send Payment Reminder</h2>
          <div className="mt-5 rounded-xl bg-[#f0f4f7] p-4">
            <p className="font-semibold text-[#2a3439]">{relatedTenant?.fullName ?? "Tenant unavailable"}</p>
            <p className="text-xs text-[#566166]">{overduePayment?.unitId || "Unit unavailable"} • Payment context</p>
          </div>
          <SendPaymentReminderForm payments={payments} tenants={tenants} />
        </SurfaceCard>

        <SurfaceCard className="rounded-[28px] bg-[linear-gradient(145deg,#2a3439,#556170)] p-8 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-white/60">Tone Preview</p>
          <h2 className="mt-3 text-2xl font-bold">Reminder Context</h2>
          <p className="mt-4 text-sm leading-6 text-white/80">
            {relatedTenant
              ? `${relatedTenant.fullName} currently has a pending balance of ${overduePayment ? formatMoney(overduePayment.amount) : "$0.00"} on ${overduePayment?.unitId || "the selected unit"}.`
              : "No overdue tenant context is currently available from the live ledger."}
          </p>
        </SurfaceCard>
      </section>
    </LandlordPageFrame>
  );
}
