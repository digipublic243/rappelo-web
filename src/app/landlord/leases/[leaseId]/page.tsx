import { notFound } from "next/navigation";
import { AppForm, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { leaseActions } from "@/features/landlord/actionRules";
import { LandlordLeaseOverduePanel } from "@/features/landlord/LandlordLeaseOverduePanel";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  formatCadence,
  formatDate,
  formatMoney,
  leaseOverdueStatusLabel,
  leaseStatusLabel,
} from "@/lib/format";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getLandlordLeaseDetailVm } from "@/features/landlord/api";
import {
  activateLeaseAction,
  renewLeaseAction,
  terminateLeaseAction,
} from "@/features/landlord/actions";

interface PageProps {
  params: Promise<{ leaseId: string }>;
}

export default async function LeaseDetailPage({ params }: PageProps) {
  const { leaseId } = await params;
  const detail = await getLandlordLeaseDetailVm(leaseId);

  if (!detail) {
    notFound();
  }
  const { lease, meta, paymentSchedule, overdue } = detail;

  const actions = leaseActions(lease.status);
  const fallbackSchedule = (() => {
    const start = new Date(lease.startDate);
    const end = new Date(lease.endDate);
    const schedule: { label: string; dueDate: string; currency?: string }[] =
      [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

    while (cursor <= end && schedule.length < 6) {
      schedule.push({
        label: `${cursor.toLocaleString("en-US", { month: "long" })} Rent Payment`,
        dueDate: cursor.toISOString(),
        currency: lease.currency,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    return schedule;
  })();
  const renderedSchedule =
    paymentSchedule && paymentSchedule.length > 0
      ? paymentSchedule
      : fallbackSchedule.map((payment, index) => ({
          id: `${lease.id}-${index}`,
          ...payment,
          amount: lease.rentAmount,
          currency: payment.currency ?? lease.currency,
        }));

  return (
    <LandlordPageFrame currentPath="/landlord/leases">
      <DataStateNotice meta={meta} />
      <PageIntro
        backHref="/landlord/leases"
        backLabel="Retour aux baux"
        title={`Bail ${lease.lease_number}`}
        description={`Locataire ${lease.tenantId} • ${leaseStatusLabel(lease.status)} • unité ${lease.unitId}`}
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
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
            <p className="mt-5 text-4xl font-black tracking-tight text-foreground">
              {formatMoney(lease.rentAmount, lease.currency)}
            </p>
            <p className="mt-2 text-sm text-secondary-2">
              Période du bail : {formatDate(lease.startDate)} -{" "}
              {formatDate(lease.endDate)}
            </p>
            {lease.securityDeposit ? (
              <p className="mt-2 text-sm text-secondary-2">
                Garantie :{" "}
                {formatMoney(lease.securityDeposit, lease.currency)}
                {lease.securityDepositMonthsTaken != null
                  ? ` • ${lease.securityDepositMonthsTaken} mois prélevé(s)`
                  : ""}
              </p>
            ) : null}
          </SurfaceCard>

          <SurfaceCard className="overflow-hidden">
            <div className="border-b border-[var(--secondary)] px-6 py-5">
              <h2 className="text-xl font-bold text-foreground">
                Calendrier de paiement
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <tbody>
                  {renderedSchedule.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-t border-[var(--secondary)] first:border-t-0"
                    >
                      <td className="px-8 py-5 text-sm text-secondary-2">
                        {payment.label}
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-foreground">
                        {formatMoney(
                          payment.amount,
                          payment.currency ?? lease.currency,
                        )}
                      </td>
                      <td className="px-8 py-5 text-sm text-secondary-2">
                        {formatDate(payment.dueDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">
              Documents du bail
            </h2>
            <div className="mt-4 rounded-xl bg-[var(--secondary-4)] px-4 py-4 text-sm text-secondary-2">
              L’API actuelle n’expose pas encore les fichiers de documents de
              bail dans cette vue, donc aucun faux document n’est affiché.
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">
              Suivi du retard
            </h2>
            <div className="mt-4 space-y-3 text-sm text-secondary-2">
              <p>
                <span className="font-semibold text-foreground">Statut :</span>{" "}
                {leaseOverdueStatusLabel(overdue?.status)}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Jours de retard :
                </span>{" "}
                {overdue?.daysOverdue ?? 0}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Montant en retard :
                </span>{" "}
                {formatMoney(
                  overdue?.overdueAmount ?? 0,
                  overdue?.currency ?? lease.currency,
                )}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Paiements manqués :
                </span>{" "}
                {overdue?.missedPaymentCount ?? 0}
              </p>
              <p>
                <span className="font-semibold text-foreground">
                  Dernière alerte :
                </span>{" "}
                {overdue?.lastAlertSentAt
                  ? formatDate(overdue.lastAlertSentAt)
                  : "Aucune"}
              </p>
            </div>
            <div className="mt-5">
              <LandlordLeaseOverduePanel
                canAlert={(overdue?.daysOverdue ?? 0) > 0}
                leaseId={lease.id}
              />
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">Actions</h2>
            <div className="mt-4 grid gap-3">
              <AppForm action={renewLeaseAction}>
                <FormField name="leaseId" type="hidden" value={lease.id} />
                <FormField
                  name="newEndDate"
                  type="hidden"
                  value={lease.endDate}
                />
                <FormSubmitButton
                  className="flex w-full justify-start rounded-lg bg-primary px-5 text-sm disabled:opacity-50"
                  disabled={!actions.canRenew}
                >
                  Préparer le renouvellement
                </FormSubmitButton>
              </AppForm>
              <AppForm action={activateLeaseAction}>
                <FormField name="leaseId" type="hidden" value={lease.id} />
                <FormSubmitButton
                  className="flex w-full justify-start rounded-lg border border-primary bg-background px-5 text-sm text-background disabled:opacity-50"
                  disabled={!actions.canActivate}
                >
                  Activer le bail
                </FormSubmitButton>
              </AppForm>
              <AppForm action={terminateLeaseAction}>
                <FormField name="leaseId" type="hidden" value={lease.id} />
                <FormSubmitButton
                  className="flex w-full justify-start rounded-lg bg-primary-3 px-5 text-sm text-foreground/75 disabled:opacity-50"
                  disabled={!actions.canTerminate}
                >
                  Terminer le bail
                </FormSubmitButton>
              </AppForm>
            </div>
            <p className="mt-4 text-xs text-[var(--secondary-3)]">
              Autorisé actuellement : activer{" "}
              {actions.canActivate ? "oui" : "non"}, terminer{" "}
              {actions.canTerminate ? "oui" : "non"}, renouveler{" "}
              {actions.canRenew ? "oui" : "non"}.
            </p>
          </SurfaceCard>
        </div>
      </section>
    </LandlordPageFrame>
  );
}
