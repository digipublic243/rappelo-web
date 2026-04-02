import { notFound } from "next/navigation";
import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getTenantLeaseDetailVm } from "@/features/tenant/api";
import {
  formatCadence,
  formatDate,
  formatMoney,
  leaseOverdueStatusLabel,
  leaseStatusLabel,
} from "@/lib/format";

interface PageProps {
  params: Promise<{ leaseId: string }>;
}

export default async function TenantLeaseDetailPage({ params }: PageProps) {
  const { leaseId } = await params;
  const detail = await getTenantLeaseDetailVm(leaseId);

  if (!detail) {
    notFound();
  }

  const { lease, unit, property, meta, paymentSchedule, overdue } = detail;

  return (
    <TenantPageFrame currentPath="/tenant/leases">
      <DataStateNotice meta={meta} />
      <PageIntro
        eyebrow="Bail"
        title={lease.lease_number}
        description={`${leaseStatusLabel(lease.status)} • unité ${unit?.label ?? lease.unitId}`}
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <SurfaceCard className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge
                status={lease.status}
                label={leaseStatusLabel(lease.status)}
              />
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-2">
                {formatCadence(lease.cadence)}
              </span>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                  Période du bail
                </p>
                <p className="mt-2 text-lg font-bold text-foreground">
                  {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                  Montant contractuel
                </p>
                <p className="mt-2 text-lg font-bold text-foreground">
                  {formatMoney(lease.rentAmount)}
                </p>
                <p className="mt-1 text-xs text-[var(--secondary-3)]">
                  {formatCadence(lease.cadence)}
                </p>
              </div>
            </div>
            {lease.securityDeposit ? (
              <p className="mt-4 text-sm text-secondary-2">
                Garantie : {formatMoney(lease.securityDeposit)}
                {lease.securityDepositMonthsTaken != null
                  ? ` • ${lease.securityDepositMonthsTaken} mois prélevé(s)`
                  : ""}
              </p>
            ) : null}
          </SurfaceCard>

          <SurfaceCard className="overflow-hidden">
            <div className="border-b border-[var(--secondary)] px-6 py-5">
              <h2 className="text-xl font-bold text-foreground">
                Résumé du contrat
              </h2>
            </div>
            <div className="grid gap-5 p-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                  Numéro de bail
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {lease.lease_number}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                  Statut
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {leaseStatusLabel(lease.status)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                  Unité
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {unit?.label ?? lease.unitId}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                  Bien
                </p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {property?.name ?? "Bien non résolu"}
                </p>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="overflow-hidden">
            <div className="border-b border-[var(--secondary)] px-6 py-5">
              <h2 className="text-xl font-bold text-foreground">
                Calendrier de paiement
              </h2>
            </div>
            <div className="divide-y divide-[var(--secondary)]">
              {(paymentSchedule ?? []).length > 0 ? (
                paymentSchedule?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{item.label}</p>
                      <p className="text-xs text-secondary-2">{formatDate(item.dueDate)}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatMoney(item.amount)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="px-6 py-4 text-sm text-secondary-2">
                  Le calendrier détaillé n’est pas encore disponible pour ce bail.
                </div>
              )}
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-8 lg:col-span-4">
          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">
              Votre résidence
            </h2>
            <div className="mt-4 space-y-3 text-sm text-secondary-2">
              <p>
                <span className="font-semibold text-foreground">Bien :</span>{" "}
                {property?.name ?? "Indisponible"}
              </p>
              <p>
                <span className="font-semibold text-foreground">Ville :</span>{" "}
                {property?.city ?? "Indisponible"}
              </p>
              <p>
                <span className="font-semibold text-foreground">Adresse :</span>{" "}
                {property?.address ?? "Indisponible"}
              </p>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">
              Statut de retard
            </h2>
            <div className="mt-4 space-y-3 text-sm text-secondary-2">
              <p>
                <span className="font-semibold text-foreground">Statut :</span>{" "}
                {leaseOverdueStatusLabel(overdue?.status)}
              </p>
              <p>
                <span className="font-semibold text-foreground">Jours de retard :</span>{" "}
                {overdue?.daysOverdue ?? 0}
              </p>
              <p>
                <span className="font-semibold text-foreground">Montant en retard :</span>{" "}
                {formatMoney(overdue?.overdueAmount ?? 0, "CDF")}
              </p>
              <p>
                <span className="font-semibold text-foreground">Paiements manqués :</span>{" "}
                {overdue?.missedPaymentCount ?? 0}
              </p>
              <p className="text-xs text-[var(--secondary-3)]">
                Le backend applique une période de grâce de 3 jours avant de marquer
                un bail en retard.
              </p>
            </div>
          </SurfaceCard>
        </div>
      </section>
    </TenantPageFrame>
  );
}
