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
        title="Baux"
        description="Contrats locatifs gérés séparément des réservations, avec leur fréquence de facturation et leur cycle de vie."
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
          ["Baux actifs", String(leases.filter((lease) => lease.status === "active").length)],
          ["Baux en brouillon", String(leases.filter((lease) => lease.status === "draft").length)],
          ["Valeur contractuelle", formatMoney(leases.reduce((total, lease) => total + lease.rentAmount, 0))],
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
              {[
                "Numéro de bail",
                "Locataire",
                "Unité",
                "Période",
                "Montant contractuel",
                "Statut",
                "Action",
              ].map((label) => (
                <th key={label} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#566166]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leases.map((lease) => (
              <tr key={lease.id} className="border-t border-[#e8eff3]">
                <td className="px-6 py-5 text-sm font-semibold text-[#2a3439]">{lease.lease_number}</td>
                <td className="px-6 py-5 text-sm text-[#566166]">
                  <span className="font-semibold text-[#2a3439]">{lease.tenantId}</span>
                </td>
                <td className="px-6 py-5 text-sm text-[#566166]">
                  <span className="font-semibold text-[#2a3439]">{lease.unitId}</span>
                </td>
                <td className="px-6 py-5 text-sm text-[#566166]">
                  {formatDate(lease.startDate)}
                  <div className="text-xs text-[#9a9d9f]">au {formatDate(lease.endDate)}</div>
                </td>
                <td className="px-6 py-5 text-sm text-[#566166]">
                  {formatMoney(lease.rentAmount)}
                  <div className="text-xs text-[#9a9d9f]">
                    {formatCadence(lease.cadence)}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={lease.status} label={leaseStatusLabel(lease.status)} />
                </td>
                <td className="px-6 py-5">
                  <Link className="text-sm font-semibold text-[#545f73]" href={`/landlord/leases/${lease.id}`}>
                    Voir le détail
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
