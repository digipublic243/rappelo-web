import Link from "next/link";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { AppForm, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, actionButtonClassName } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatMoney, formatPaymentMethod, paymentStatusLabel } from "@/lib/format";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getLandlordPaymentsVm } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { paymentActions } from "@/features/landlord/actionRules";
import { confirmPaymentAction } from "@/features/landlord/actions";

export default async function PaymentsPage() {
  const { payments, summary, tenants, leases, meta } = await getLandlordPaymentsVm();
  const collected = summary?.totalPaid ?? payments.filter((payment) => payment.status === "paid").reduce((sum, payment) => sum + payment.amount, 0);
  const outstanding = summary?.totalPending ?? payments.filter((payment) => payment.status === "pending").reduce((sum, payment) => sum + payment.amount, 0);
  const overdue = summary?.totalOverdue ?? 0;
  const pendingCount = summary?.countPending ?? payments.filter((payment) => payment.status === "pending").length;

  return (
    <LandlordPageFrame currentPath="/landlord/payments">
      <DataStateNotice meta={meta} />
      <PageIntro
        title="Paiements"
        description="Suivez les règlements, les échéances en attente et les relances depuis le registre financier du portefeuille."
        action={
          <div className="flex flex-wrap gap-3">
            <Link className={actionButtonClassName({})} href="/landlord/payments/generate-link">
              <MaterialIcon name="add" className="text-[18px]" />
              Générer un lien
            </Link>
            <Link className={actionButtonClassName({ variant: "secondary" })} href="/landlord/payments/send-reminder">
              Envoyer un rappel
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Total encaissé", formatMoney(collected, "CDF")],
          ["À encaisser", formatMoney(outstanding, "CDF")],
          ["En retard", formatMoney(overdue, "CDF")],
          ["Paiements en attente", String(pendingCount)],
        ].map(([label, value]) => (
          <SurfaceCard key={label} className="p-5">
            <p className="text-sm font-medium text-secondary-2">{label}</p>
            <p className="mt-2 text-3xl font-black text-foreground">{value}</p>
          </SurfaceCard>
        ))}
      </section>

      <SurfaceCard className="overflow-hidden">
        <table className="w-full min-w-[920px]">
          <thead className="bg-[var(--secondary-4)] text-left">
            <tr>
              {["Locataire / unité", "Bail", "Montant", "Échéance", "Mode", "Statut", "Action"].map((label) => (
                <th key={label} className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-secondary-2">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t border-[var(--secondary)]">
                <td className="px-6 py-5">
                  <p className="font-semibold text-foreground">
                    {payment.tenantName ??
                      tenants.find((tenant) => tenant.id === payment.tenantId)
                        ?.fullName ??
                      payment.tenantId}
                  </p>
                  <p className="text-xs text-secondary-2">{payment.unitId || "Unité non liée"}</p>
                </td>
                <td className="px-6 py-5 text-sm text-secondary-2">
                  {leases.find((lease) => lease.id === payment.leaseId)?.lease_number ?? payment.leaseId ?? "Aucun bail"}
                </td>
                <td className="px-6 py-5 text-sm font-semibold text-foreground">
                  {formatMoney(payment.amount, payment.currency ?? "CDF")}
                </td>
                <td className="px-6 py-5 text-sm text-secondary-2">
                  <p>{formatDate(payment.dueDate)}</p>
                  <p className="mt-1 text-xs text-[var(--secondary-3)]">
                    {payment.paymentLabel ?? `Paiement à partir du ${payment.dueDate}`}
                  </p>
                </td>
                <td className="px-6 py-5 text-sm text-secondary-2">{formatPaymentMethod(payment.method)}</td>
                <td className="px-6 py-5">
                  <StatusBadge status={payment.status} label={paymentStatusLabel(payment.status)} />
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link className="text-sm font-semibold text-[var(--primary)]" href={`/landlord/payments/${payment.id}`}>
                      Voir le détail
                    </Link>
                    {paymentActions(payment.status).canConfirm ? (
                      <AppForm action={confirmPaymentAction}>
                        <FormField name="paymentId" type="hidden" value={payment.id} />
                        <FormSubmitButton className="rounded-lg px-3 py-2 text-xs">
                          Marquer payé
                        </FormSubmitButton>
                      </AppForm>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SurfaceCard>
    </LandlordPageFrame>
  );
}
