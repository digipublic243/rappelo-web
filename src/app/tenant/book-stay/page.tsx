import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, ActionButton } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCadence, formatMoney, unitStatusLabel } from "@/lib/format";
import { getTenantBookStayData } from "@/features/tenant/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function BookStayPage() {
  const { units, meta } = await getTenantBookStayData();
  const selectedUnit = units[0];

  return (
    <TenantPageFrame currentPath="/tenant/book-stay">
      <DataStateNotice meta={meta} />
      <PageIntro
        eyebrow="Property"
        title="Select your luxury unit"
        description="Booking flow fed by live available units, with lease terms and summary kept separate from the post-booking lease stage."
      />

      {units.length === 0 ? (
        <EmptyState
          title="No units available right now"
          description="Available units will appear here as soon as the property API exposes open inventory for booking."
        />
      ) : (
        <section className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {units.map((unit, index) => (
              <SurfaceCard key={unit.id} className={`p-6 ${index === 0 ? "ring-2 ring-[#545f73]" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#2a3439]">{unit.label}</h2>
                    <p className="mt-1 text-sm text-[#566166]">{unit.type}</p>
                  </div>
                  <StatusBadge status={unit.status} label={unitStatusLabel(unit.status)} />
                </div>
                <p className="mt-5 text-3xl font-black text-[#2a3439]">{formatMoney(unit.price)}</p>
              </SurfaceCard>
            ))}

            <SurfaceCard className="p-6">
              <h2 className="text-xl font-bold text-[#2a3439]">Booking Terms</h2>
              <form className="mt-5 grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-[#566166]">
                  Lease Term
                  <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3">
                    <option>6 months</option>
                    <option>12 months</option>
                    <option>18 months</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-[#566166]">
                  Pricing Cadence
                  <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3">
                    <option>Month</option>
                    <option>Week</option>
                    <option>Day</option>
                    <option>Custom</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-[#566166]">
                  Payment Method
                  <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3">
                    <option>EasyPay</option>
                    <option>Cash</option>
                  </select>
                </label>
                <label className="text-sm font-medium text-[#566166]">
                  Deposit
                  <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] px-4 py-3" defaultValue="400" />
                </label>
              </form>
            </SurfaceCard>
          </div>

          <SurfaceCard className="p-6 lg:col-span-4">
            <h2 className="text-2xl font-bold tracking-tight text-[#2a3439]">Booking Summary</h2>
            <p className="mt-1 text-xs text-[#566166]">
              {selectedUnit?.type ?? "Available unit"} • {selectedUnit?.label ?? "Selection pending"}
            </p>
            <div className="mt-6 space-y-4">
              {[
                ["Base Rate", selectedUnit ? formatMoney(selectedUnit.price) : "$0.00"],
                ["Deposit", selectedUnit?.depositEnabled ? "Required" : "Not required"],
                ["Cadence", selectedUnit ? formatCadence(selectedUnit.pricingCadence) : "Not available"],
                ["Method", "EasyPay"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-xl bg-[#f0f4f7] px-4 py-3 text-sm">
                  <span className="text-[#566166]">{label}</span>
                  <span className="font-semibold text-[#2a3439]">{value}</span>
                </div>
              ))}
            </div>
            <ActionButton className="mt-6 w-full">Submit booking request</ActionButton>
          </SurfaceCard>
        </section>
      )}
    </TenantPageFrame>
  );
}
