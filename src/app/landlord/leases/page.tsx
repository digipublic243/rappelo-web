import Link from "next/link";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import {
  SurfaceCard,
  actionButtonClassName,
} from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  formatCadence,
  formatDate,
  formatMoney,
  leaseOverdueStatusLabel,
  leaseStatusLabel,
} from "@/lib/format";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getLandlordLeasesData } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function LeaseListPage() {
  const { leases, overdueSummary, meta } = await getLandlordLeasesData();

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
          [
            "Baux en retard",
            overdueSummary ? String(overdueSummary.countOverdue) : "0",
          ],
          [
            "Montant en retard",
            formatMoney(overdueSummary?.totalOverdueAmount ?? 0, "CDF"),
          ],
        ].map(([label, value]) => (
          <SurfaceCard key={label} className="p-5">
            <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[var(--foreground)]">{value}</p>
          </SurfaceCard>
        ))}
      </section>

      <SurfaceCard className="overflow-hidden">
        <table className="w-full min-w-[860px]">
          <thead className="bg-[var(--surface-low)] text-left">
            <tr>
              {[
                "Numéro de bail",
                "Locataire",
                "Unité",
                "Période",
                "Montant contractuel",
                "Retard",
                "Statut",
                "Action",
              ].map((label) => (
                <th key={label} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leases.map((lease) => (
              <tr key={lease.id} className="border-t border-[var(--secondary)]">
                <td className="px-6 py-5 text-sm font-semibold text-[var(--foreground)]">{lease.lease_number}</td>
                <td className="px-6 py-5 text-sm text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--foreground)]">{lease.tenantId}</span>
                </td>
                <td className="px-6 py-5 text-sm text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--foreground)]">{lease.unitId}</span>
                </td>
                <td className="px-6 py-5 text-sm text-[var(--muted-foreground)]">
                  {formatDate(lease.startDate)}
                  <div className="text-xs text-[var(--subtle-foreground-soft)]">au {formatDate(lease.endDate)}</div>
                </td>
                <td className="px-6 py-5 text-sm text-[var(--muted-foreground)]">
                  {formatMoney(lease.rentAmount)}
                  <div className="text-xs text-[var(--subtle-foreground-soft)]">
                    {formatCadence(lease.cadence)}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--foreground)]">
                    {leaseOverdueStatusLabel(lease.overdueStatus)}
                  </span>
                  {lease.daysOverdue && lease.daysOverdue > 0 ? (
                    <div className="text-xs text-[var(--subtle-foreground-soft)]">
                      {lease.daysOverdue} j • {formatMoney(lease.overdueAmount ?? 0, "CDF")}
                    </div>
                  ) : (
                    <div className="text-xs text-[var(--subtle-foreground-soft)]">Aucun retard enregistré</div>
                  )}
                </td>
                <td className="px-6 py-5">
                  <StatusBadge status={lease.status} label={leaseStatusLabel(lease.status)} />
                </td>
                <td className="px-6 py-5">
                  <Link className="text-sm font-semibold text-[var(--primary)]" href={`/landlord/leases/${lease.id}`}>
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
