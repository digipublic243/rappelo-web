import Link from "next/link";
import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCadence, formatDate, formatMoney, leaseStatusLabel } from "@/lib/format";
import { getTenantLeasesData } from "@/features/tenant/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function TenantLeasesPage() {
  const { leases, meta } = await getTenantLeasesData();
  const activeLeases = leases.filter((lease) => lease.status === "active");
  const historicLeases = leases.filter((lease) => lease.status !== "active");

  return (
    <TenantPageFrame currentPath="/tenant/leases">
      <DataStateNotice meta={meta} />
      <PageIntro title="Mes baux" description="Consultez vos baux actifs et archivés, avec leur statut réel issu du backend." />

      <section>
        <h2 className="text-sm font-bold uppercase tracking-[0.24em] text-secondary-2">Baux actifs</h2>
        <div className="mt-4 grid gap-6">
          {activeLeases.map((lease) => (
            <SurfaceCard key={lease.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="h-56 bg-[var(--secondary-1)] md:w-72" />
                <div className="flex-1 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-secondary-2">Numéro de bail</p>
                      <h3 className="mt-1 text-xl font-bold text-foreground">{lease.lease_number}</h3>
                      <p className="mt-1 text-sm text-secondary-2">Unité {lease.unitId}</p>
                    </div>
                    <StatusBadge status={lease.status} label={leaseStatusLabel(lease.status)} />
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs text-secondary-2">Période du bail</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{formatDate(lease.startDate)} - {formatDate(lease.endDate)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-2">Montant contractuel</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">{formatMoney(lease.rentAmount)}</p>
                      <p className="mt-1 text-xs text-[var(--secondary-3)]">{formatCadence(lease.cadence)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-2">Statut</p>
                      <p className="mt-1 text-sm font-semibold text-[var(--primary)]">{leaseStatusLabel(lease.status)}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link className="text-sm font-semibold text-[var(--primary)]" href={`/tenant/leases/${lease.id}`}>
                      Voir le bail
                    </Link>
                  </div>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-[0.24em] text-secondary-2">Baux archivés</h2>
        <SurfaceCard className="mt-4 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[var(--secondary-4)]">
              <tr>
                {["Bail", "Période", "Statut", "Action"].map((label) => (
                  <th key={label} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-secondary-2">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historicLeases.map((lease) => (
                <tr key={lease.id} className="border-t border-[var(--secondary)]">
                  <td className="px-6 py-4 text-sm font-semibold text-foreground">{lease.lease_number}</td>
                  <td className="px-6 py-4 text-sm text-secondary-2">{formatDate(lease.startDate)} - {formatDate(lease.endDate)}</td>
                  <td className="px-6 py-4"><StatusBadge status={lease.status} label={leaseStatusLabel(lease.status)} /></td>
                  <td className="px-6 py-4 text-sm text-[var(--primary)]">
                    <Link className="font-semibold" href={`/tenant/leases/${lease.id}`}>
                      Voir le détail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </SurfaceCard>
      </section>
    </TenantPageFrame>
  );
}
