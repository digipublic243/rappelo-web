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
  formatMoneyBreakdown,
  formatMoneyBreakdownFromMap,
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
            overdueSummary?.totalOverdueByCurrency
              ? formatMoneyBreakdownFromMap(overdueSummary.totalOverdueByCurrency)
              : overdueSummary?.totalOverdueAmount != null
                ? formatMoney(overdueSummary.totalOverdueAmount)
                : formatMoneyBreakdown(
                    leases
                      .filter((lease) => (lease.overdueAmount ?? 0) > 0)
                      .map((lease) => ({
                        amount: lease.overdueAmount ?? 0,
                        currency: lease.overdueCurrency ?? lease.currency,
                      })),
                  ),
          ],
        ].map(([label, value]) => (
          <SurfaceCard key={label} className="p-5">
            <p className="text-sm font-medium text-secondary-2">{label}</p>
            <p className="mt-2 text-3xl font-black text-foreground">{value}</p>
          </SurfaceCard>
        ))}
      </section>

      <SurfaceCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-[var(--secondary-4)] text-left">
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
                  <th key={label} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-secondary-2">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leases.map((lease) => (
                <tr key={lease.id} className="border-t border-[var(--secondary)]">
                  <td className="px-6 py-5 text-sm font-semibold text-foreground">{lease.lease_number}</td>
                  <td className="px-6 py-5 text-sm text-secondary-2">
                    <span className="font-semibold text-foreground">
                      {lease.tenantName ?? lease.tenantId}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-secondary-2">
                    <span className="font-semibold text-foreground">
                      {lease.unitLabel ?? lease.unitId}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-secondary-2">
                    {formatDate(lease.startDate)}
                    <div className="text-xs text-[var(--secondary-3)]">au {formatDate(lease.endDate)}</div>
                  </td>
                  <td className="px-6 py-5 text-sm text-secondary-2">
                    {formatMoney(lease.rentAmount, lease.currency)}
                    <div className="text-xs text-[var(--secondary-3)]">
                      {formatCadence(lease.cadence)}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-secondary-2">
                    <span className="font-semibold text-foreground">
                      {leaseOverdueStatusLabel(lease.overdueStatus)}
                    </span>
                    {lease.daysOverdue && lease.daysOverdue > 0 ? (
                      <div className="text-xs text-[var(--secondary-3)]">
                        {lease.daysOverdue} j • {formatMoney(lease.overdueAmount ?? 0, lease.overdueCurrency ?? lease.currency)}
                      </div>
                    ) : (
                      <div className="text-xs text-[var(--secondary-3)]">Aucun retard enregistré</div>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={lease.status} label={leaseStatusLabel(lease.status)} />
                  </td>
                  <td className="px-6 py-5">
                    <Link className="text-sm font-semibold text-primary underline-2 underline" href={`/landlord/leases/${lease.id}`}>
                      Voir le détail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SurfaceCard>
    </LandlordPageFrame>
  );
}
