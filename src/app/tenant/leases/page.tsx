import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatMoney, leaseStatusLabel } from "@/lib/format";
import { getTenantLeasesData } from "@/features/tenant/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function TenantLeasesPage() {
  const { leases, meta } = await getTenantLeasesData();
  const activeLeases = leases.filter((lease) => lease.status === "active");
  const historicLeases = leases.filter((lease) => lease.status !== "active");

  return (
    <TenantPageFrame currentPath="/tenant/leases">
      <DataStateNotice meta={meta} />
      <PageIntro title="Tenant Leases" description="Active and archived agreements using the same card-plus-table split as the Stitch export." />

      <section>
        <h2 className="text-sm font-bold uppercase tracking-[0.24em] text-[#566166]">Active Leases</h2>
        <div className="mt-4 grid gap-6">
          {activeLeases.map((lease) => (
            <SurfaceCard key={lease.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="h-56 bg-[#d9e4ea] md:w-72" />
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-[#566166]">Property</p>
                      <h3 className="mt-1 text-xl font-bold text-[#2a3439]">{lease.unitId}</h3>
                    </div>
                    <StatusBadge status={lease.status} label={leaseStatusLabel(lease.status)} />
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-[#566166]">Lease Period</p>
                      <p className="mt-1 text-sm font-semibold text-[#2a3439]">{formatDate(lease.startDate)} - {formatDate(lease.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#566166]">Rent</p>
                      <p className="mt-1 text-sm font-semibold text-[#2a3439]">{formatMoney(lease.rentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#566166]">Document</p>
                      <p className="mt-1 text-sm font-semibold text-[#545f73]">Lease Agreement.pdf</p>
                    </div>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-[0.24em] text-[#566166]">Historic Leases</h2>
        <SurfaceCard className="mt-4 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#f0f4f7]">
              <tr>
                {["Property", "Lease Period", "Status", "Document"].map((label) => (
                  <th key={label} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-[#566166]">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historicLeases.map((lease) => (
                <tr key={lease.id} className="border-t border-[#e8eff3]">
                  <td className="px-6 py-4 text-sm font-semibold text-[#2a3439]">{lease.unitId}</td>
                  <td className="px-6 py-4 text-sm text-[#566166]">{formatDate(lease.startDate)} - {formatDate(lease.endDate)}</td>
                  <td className="px-6 py-4"><StatusBadge status={lease.status} label={leaseStatusLabel(lease.status)} /></td>
                  <td className="px-6 py-4 text-sm text-[#545f73]">Archived_Lease.pdf</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SurfaceCard>
      </section>
    </TenantPageFrame>
  );
}
