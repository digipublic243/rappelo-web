import { notFound } from "next/navigation";
import { AppForm, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { leaseActions } from "@/features/landlord/actionRules";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCadence, formatDate, formatMoney, leaseStatusLabel } from "@/lib/format";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getLandlordLeaseDetailVm } from "@/features/landlord/api";
import { activateLeaseAction, renewLeaseAction, terminateLeaseAction } from "@/features/landlord/actions";

interface PageProps {
  params: Promise<{ leaseId: string }>;
}

export default async function LeaseDetailPage({ params }: PageProps) {
  const { leaseId } = await params;
  const detail = await getLandlordLeaseDetailVm(leaseId);

  if (!detail) {
    notFound();
  }
  const { lease, meta, paymentSchedule } = detail;

  const actions = leaseActions(lease.status);
  const fallbackSchedule = (() => {
    const start = new Date(lease.startDate);
    const end = new Date(lease.endDate);
    const schedule: { label: string; dueDate: string }[] = [];
    const cursor = new Date(start.getFullYear(), start.getMonth(), 1);

    while (cursor <= end && schedule.length < 6) {
      schedule.push({
        label: `${cursor.toLocaleString("en-US", { month: "long" })} Rent Payment`,
        dueDate: cursor.toISOString(),
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
        }));

  return (
    <LandlordPageFrame currentPath="/landlord/leases">
      <DataStateNotice meta={meta} />
      <PageIntro
        title={`Bail ${lease.lease_number}`}
        description={`Locataire ${lease.tenantId} • ${leaseStatusLabel(lease.status)} • unité ${lease.unitId}`}
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <SurfaceCard className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={lease.status} label={leaseStatusLabel(lease.status)} />
              <span className="rounded-full bg-[#e8eff3] px-3 py-1 text-xs font-semibold text-[#566166]">{formatCadence(lease.cadence)}</span>
            </div>
            <p className="mt-5 text-4xl font-black tracking-tight text-[#2a3439]">{formatMoney(lease.rentAmount)}</p>
            <p className="mt-2 text-sm text-[#566166]">Période du bail : {formatDate(lease.startDate)} - {formatDate(lease.endDate)}</p>
            {lease.securityDeposit ? (
              <p className="mt-2 text-sm text-[#566166]">
                Garantie : {formatMoney(lease.securityDeposit)}
                {lease.securityDepositMonthsTaken != null
                  ? ` • ${lease.securityDepositMonthsTaken} mois prélevé(s)`
                  : ""}
              </p>
            ) : null}
          </SurfaceCard>

          <SurfaceCard className="overflow-hidden">
            <div className="border-b border-[#e8eff3] px-6 py-5">
              <h2 className="text-xl font-bold text-[#2a3439]">Calendrier de paiement</h2>
            </div>
            <table className="w-full">
              <tbody>
                {renderedSchedule.map((payment) => (
                  <tr key={payment.id} className="border-t border-[#e8eff3] first:border-t-0">
                    <td className="px-8 py-5 text-sm text-[#566166]">{payment.label}</td>
                    <td className="px-8 py-5 text-sm font-semibold text-[#2a3439]">{formatMoney(payment.amount)}</td>
                    <td className="px-8 py-5 text-sm text-[#566166]">{formatDate(payment.dueDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SurfaceCard>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-[#2a3439]">Documents du bail</h2>
            <div className="mt-4 rounded-xl bg-[#f0f4f7] px-4 py-4 text-sm text-[#566166]">
              L’API actuelle n’expose pas encore les fichiers de documents de bail dans cette vue, donc aucun faux document n’est affiché.
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-[#2a3439]">Actions</h2>
            <div className="mt-4 grid gap-3">
              <AppForm action={renewLeaseAction}>
                <FormField name="leaseId" type="hidden" value={lease.id} />
                <FormField name="newEndDate" type="hidden" value={lease.endDate} />
                <FormSubmitButton className="flex w-full justify-start rounded-lg bg-[#545f73] px-5 text-sm disabled:opacity-50" disabled={!actions.canRenew}>
                  Préparer le renouvellement
                </FormSubmitButton>
              </AppForm>
              <AppForm action={activateLeaseAction}>
                <FormField name="leaseId" type="hidden" value={lease.id} />
                <FormSubmitButton className="flex w-full justify-start rounded-lg border border-[#a9b4b9]/40 bg-white px-5 text-sm text-[#545f73] disabled:opacity-50" disabled={!actions.canActivate}>
                  Activer le bail
                </FormSubmitButton>
              </AppForm>
              <AppForm action={terminateLeaseAction}>
                <FormField name="leaseId" type="hidden" value={lease.id} />
                <FormSubmitButton className="flex w-full justify-start rounded-lg bg-[#d8e3fb] px-5 text-sm text-[#475266] disabled:opacity-50" disabled={!actions.canTerminate}>
                  Terminer le bail
                </FormSubmitButton>
              </AppForm>
            </div>
            <p className="mt-4 text-xs text-[#717c82]">
              Autorisé actuellement : activer {actions.canActivate ? "oui" : "non"}, terminer {actions.canTerminate ? "oui" : "non"}, renouveler {actions.canRenew ? "oui" : "non"}.
            </p>
          </SurfaceCard>
        </div>
      </section>
    </LandlordPageFrame>
  );
}
