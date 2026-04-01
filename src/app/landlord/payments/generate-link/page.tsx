import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, ActionButton } from "@/components/shared/StitchPrimitives";
import { getLandlordPaymentWorkflowData } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function GeneratePaymentLinkPage() {
  const { leases, tenants, meta } = await getLandlordPaymentWorkflowData();

  return (
    <LandlordPageFrame currentPath="/landlord/payments">
      <DataStateNotice meta={meta} />
      <PageIntro title="Finance Overview" description="Modal-like payment request creation laid on top of the same ledger surface language as Stitch." />

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {[
            ["Rent - Unit 4B", "Tenant: Alex Rivera"],
            ["Utilities - Unit 12A", "Tenant: Sarah Chen"],
          ].map(([title, caption]) => (
            <SurfaceCard key={title} className="p-5">
              <p className="font-semibold text-[#2a3439]">{title}</p>
              <p className="mt-1 text-xs text-[#566166]">{caption}</p>
            </SurfaceCard>
          ))}
          <SurfaceCard className="p-6">
            <p className="text-sm text-[#566166]">Outstanding this cycle</p>
            <p className="mt-2 text-4xl font-black text-[#2a3439]">$12,840.00</p>
          </SurfaceCard>
        </div>

        <SurfaceCard className="p-6">
          <h2 className="text-2xl font-bold tracking-tight text-[#2a3439]">Generate Payment Link</h2>
          <form className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-[#566166]">
              Select Tenant & Lease
              <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3">
                {leases.map((lease) => {
                  const tenant = tenants.find((item) => item.id === lease.tenantId);
                  return (
                    <option key={lease.id}>{tenant?.fullName ?? lease.tenantId} — {lease.unitId} ({lease.id})</option>
                  );
                })}
              </select>
            </label>
            <label className="block text-sm font-medium text-[#566166]">
              Amount
              <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue="2450" />
            </label>
            <label className="block text-sm font-medium text-[#566166]">
              Message
              <textarea
                className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3"
                defaultValue="Secure payment request for the current cycle. Please complete settlement through the generated link."
                rows={5}
              />
            </label>
            <ActionButton className="w-full">Generate and Copy Link</ActionButton>
          </form>
        </SurfaceCard>
      </section>
    </LandlordPageFrame>
  );
}
