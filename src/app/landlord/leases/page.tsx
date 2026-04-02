import Link from "next/link";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import {
  SurfaceCard,
  actionButtonClassName,
} from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCadence, formatDate, formatMoney, leaseStatusLabel } from "@/lib/format";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getLandlordLeasesData } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function LeaseListPage() {
  const { leases, meta } = await getLandlordLeasesData();

  return (
    <LandlordPageFrame currentPath="/landlord/leases">
      <DataStateNotice meta={meta} />
      <PageIntro
        title="Lease Agreements"
        description="Lifecycle-managed contracts that remain separate from booking intake and payment collection."
        action={
          <Link
            className={actionButtonClassName({})}
            href="/landlord/leases/new"
          >
            <MaterialIcon name="add" className="text-[18px]" />
            Nouveau bail
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Total Active Leases", String(leases.filter((lease) => lease.status === "active").length)],
          ["Pending Signatures", String(leases.filter((lease) => lease.status === "draft").length)],
          ["Monthly Contract Value", formatMoney(leases.reduce((total, lease) => total + lease.rentAmount, 0))],
        ].map(([label, value]) => (
          <SurfaceCard key={label} className="p-5">
            <p className="text-sm font-medium text-[#566166]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[#2a3439]">{value}</p>
          </SurfaceCard>
        ))}
      </section>

      <SurfaceCard className="overflow-hidden">
        <table className="w-full min-w-[860px]">
          <thead className="bg-[#f0f4f7] text-left">
            <tr>
              {["Lease ID", "Tenant", "Unit", "Rent", "Status", "Action"].map((label) => (
                <th key={label} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#566166]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leases.map((lease) => (
              <tr key={lease.id} className="border-t border-[#e8eff3]">
                <td className="px-6 py-5 text-sm font-semibold text-[#2a3439]">{lease.id}</td>
                <td className="px-6 py-5 text-sm text-[#566166]">{lease.tenantId}</td>
                <td className="px-6 py-5 text-sm text-[#566166]">{lease.unitId}</td>
                <td className="px-6 py-5 text-sm text-[#566166]">
                  {formatMoney(lease.rentAmount)} / {formatCadence(lease.cadence).replace("Per ", "")}
                  <div className="text-xs text-[#9a9d9f]">
                    {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={lease.status} label={leaseStatusLabel(lease.status)} />
                </td>
                <td className="px-6 py-5">
                  <Link className="text-sm font-semibold text-[#545f73]" href={`/landlord/leases/${lease.id}`}>
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
