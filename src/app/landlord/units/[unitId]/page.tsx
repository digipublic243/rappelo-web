import { notFound } from "next/navigation";
import { unitActions } from "@/features/landlord/actionRules";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCadence, formatMoney, unitStatusLabel } from "@/lib/format";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getLandlordUnitDetailVm } from "@/features/landlord/api";
import { updateUnitStatusAction } from "@/features/landlord/actions";

interface PageProps {
  params: Promise<{ unitId: string }>;
}

export default async function UnitConfigurationPage({ params }: PageProps) {
  const { unitId } = await params;
  const detail = await getLandlordUnitDetailVm(unitId);

  if (!detail) {
    notFound();
  }
  const { unit, meta } = detail;

  const actions = unitActions(unit.status);

  return (
    <LandlordPageFrame currentPath="/landlord/units">
      <DataStateNotice meta={meta} />
      <PageIntro
        title={`${unit.label} Configuration`}
        description="Pricing cadence, advance payment policy, lifecycle status, and accepted payment methods."
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <SurfaceCard className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={unit.status} label={unitStatusLabel(unit.status)} />
              <span className="rounded-full bg-[#e8eff3] px-3 py-1 text-xs font-semibold text-[#566166]">{formatCadence(unit.pricingCadence)}</span>
              <span className="rounded-full bg-[#b8f9de] px-3 py-1 text-xs font-semibold text-[#22614d]">
                Deposit {unit.depositEnabled ? "Enabled" : "Disabled"}
              </span>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <label className="text-sm font-medium text-[#566166]">
                Base Rent
                <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-white px-4 py-3 text-[#2a3439]" defaultValue={unit.price} />
              </label>
              <label className="text-sm font-medium text-[#566166]">
                Pricing Cadence
                <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-white px-4 py-3 text-[#2a3439]" defaultValue={unit.pricingCadence}>
                  <option value="day">Day</option>
                  <option value="week">Week</option>
                  <option value="month">Month</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              <label className="text-sm font-medium text-[#566166] md:col-span-2">
                Advance Payment Policy
                <textarea
                  className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-white px-4 py-3 text-[#2a3439]"
                  defaultValue="Collect one cadence cycle in advance plus configurable deposit when the unit is reserved or leased."
                  rows={4}
                />
              </label>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-lg font-bold text-[#2a3439]">Allowed Payment Methods</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {(unit.allowedPaymentMethods?.length ? unit.allowedPaymentMethods : ["cash"]).map((method) => (
                <div key={method} className="flex items-center gap-4 rounded-xl bg-[#f0f4f7] p-4">
                  <div className="rounded-xl bg-white p-3 text-[#545f73]">
                    <MaterialIcon name={method === "easypay" ? "wallet" : "payments"} className="text-[20px]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2a3439]">{method === "easypay" ? "EasyPay Gateway" : "Cash Collection"}</p>
                    <p className="text-sm text-[#566166]">Configured from the unit payload returned by the API.</p>
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <SurfaceCard className="p-6">
            <h2 className="text-lg font-bold text-[#2a3439]">Unit Lifecycle Status</h2>
            <div className="mt-5 space-y-3">
              {["vacant", "reserved", "occupied", "maintenance"].map((status) => (
                <form action={updateUnitStatusAction} key={status}>
                  <input name="unitId" type="hidden" value={unit.id} />
                  <input name="status" type="hidden" value={status} />
                  <button className="flex w-full items-center justify-between rounded-xl bg-[#f0f4f7] px-4 py-3 text-left" type="submit">
                    <p className="text-sm font-semibold capitalize text-[#2a3439]">{status}</p>
                    <div className={`h-3 w-3 rounded-full ${unit.status === status ? "bg-[#2c6a55]" : "bg-[#d9e4ea]"}`} />
                  </button>
                </form>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-[#f0f4f7] px-4 py-3 text-sm text-[#566166]">
              Assign-tenant and maintenance scheduling remain visual actions until dedicated endpoints are exposed in the backend spec.
            </div>
            <p className="mt-4 text-xs text-[#717c82]">
              Actions available now: assign tenant {actions.canAssignTenant ? "yes" : "no"}, maintenance {actions.canScheduleMaintenance ? "yes" : "no"}.
            </p>
          </SurfaceCard>

          <SurfaceCard className="overflow-hidden">
            <div className="h-56 bg-[#d9e4ea]">
              <img
                alt={unit.label}
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
              />
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[#717c82]">Unit Performance</p>
              <p className="mt-2 text-3xl font-black text-[#2a3439]">{formatMoney(unit.price)}</p>
              <p className="mt-2 text-sm text-[#566166]">{unit.tenantName ?? "No active tenant assigned"}.</p>
            </div>
          </SurfaceCard>
        </div>
      </section>
    </LandlordPageFrame>
  );
}
