import Link from "next/link";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, ActionButton } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { leaseStatusLabel, paymentStatusLabel } from "@/lib/format";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getLandlordTenantsData } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function TenantListPage() {
  const { tenants, meta } = await getLandlordTenantsData();

  return (
    <LandlordPageFrame currentPath="/landlord/tenants">
      <DataStateNotice meta={meta} />
      <PageIntro
        title="Active Tenants"
        description="Tenant management with lease health and payment health exposed at table level."
        action={
          <ActionButton>
            <MaterialIcon name="add" className="text-[18px]" />
            Add Tenant
          </ActionButton>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Total Tenants", String(tenants.length)],
          ["Late Payments", String(tenants.filter((tenant) => tenant.paymentStatus === "pending").length)],
          ["Draft Leases", String(tenants.filter((tenant) => tenant.leaseStatus === "draft").length)],
        ].map(([label, value]) => (
          <SurfaceCard key={label} className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#566166]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#2a3439]">{value}</p>
          </SurfaceCard>
        ))}
      </section>

      <SurfaceCard className="overflow-hidden">
        <table className="w-full min-w-[820px]">
          <thead className="bg-[#f0f4f7] text-left">
            <tr>
              {["Tenant Name", "Active Lease", "Payment Health", "Unit", "Action"].map((label) => (
                <th key={label} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#566166]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="border-t border-[#e8eff3]">
                <td className="px-6 py-5">
                  <p className="font-semibold text-[#2a3439]">{tenant.fullName}</p>
                  <p className="text-xs text-[#566166]">{tenant.email}</p>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={tenant.leaseStatus} label={leaseStatusLabel(tenant.leaseStatus)} />
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={tenant.paymentStatus} label={paymentStatusLabel(tenant.paymentStatus)} />
                </td>
                <td className="px-6 py-5 text-sm text-[#2a3439]">{tenant.unitId}</td>
                <td className="px-6 py-5">
                  <Link className="text-sm font-semibold text-[#545f73]" href={`/landlord/tenants/${tenant.id}`}>
                    View detail
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SurfaceCard>
    </LandlordPageFrame>
  );
}
