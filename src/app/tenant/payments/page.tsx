import Link from "next/link";
import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatMoney, formatPaymentMethod, paymentStatusLabel } from "@/lib/format";
import { getTenantPaymentsData } from "@/features/tenant/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function TenantPaymentsPage() {
  const { payments, meta } = await getTenantPaymentsData();
  const upcoming = payments
    .filter((payment) => payment.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const paidYtd = payments
    .filter((payment) => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const refunds = payments
    .filter((payment) => payment.status === "refunded")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const methods = Array.from(new Set(payments.map((payment) => payment.method)));

  return (
    <TenantPageFrame currentPath="/tenant/payments">
      <DataStateNotice meta={meta} />
      <PageIntro
        title="Paiements"
        description="Consultez vos échéances, les libellés de période générés par le backend et l’historique de règlement."
      />

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["À venir", formatMoney(upcoming)],
          ["Payé", formatMoney(paidYtd)],
          ["Remboursé", formatMoney(refunds)],
          ["Méthodes", methods.length > 0 ? methods.join(" + ").toUpperCase() : "N/A"],
        ].map(([label, value]) => (
          <SurfaceCard key={label} className="p-5">
            <p className="text-sm font-medium text-[var(--muted-foreground)]">{label}</p>
            <p className="mt-2 text-3xl font-black text-[var(--foreground)]">{value}</p>
          </SurfaceCard>
        ))}
      </section>

      <SurfaceCard className="overflow-hidden">
        <div className="border-b border-[var(--secondary)] px-6 py-5">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Historique des paiements</h2>
        </div>
        <table className="w-full min-w-[860px]">
          <thead className="bg-[var(--surface-low)] text-left">
            <tr>
              {["Période / date", "Montant", "Mode", "Statut", "Bail", "Action"].map(
                (label) => (
                  <th
                    key={label}
                    className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]"
                  >
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-t border-[var(--secondary)]">
                <td className="px-8 py-5 text-sm text-[var(--muted-foreground)]">
                  <p>{formatDate(payment.paidAt ?? payment.dueDate)}</p>
                  <p className="mt-1 text-xs text-[var(--subtle-foreground-soft)]">
                    {payment.paymentLabel ?? `Paiement à partir du ${payment.dueDate}`}
                  </p>
                </td>
                <td className="px-8 py-5 text-sm font-semibold text-[var(--foreground)]">
                  {formatMoney(payment.amount)}
                </td>
                <td className="px-8 py-5 text-sm text-[var(--muted-foreground)]">
                  {formatPaymentMethod(payment.method)}
                </td>
                <td className="px-8 py-5">
                  <StatusBadge
                    status={payment.status}
                    label={paymentStatusLabel(payment.status)}
                  />
                </td>
                <td className="px-8 py-5 text-sm text-[var(--muted-foreground)]">
                  {payment.leaseId ?? "Aucun bail"}
                </td>
                <td className="px-8 py-5 text-sm text-[var(--primary)]">
                  <div className="flex flex-col gap-2">
                    {payment.status === "pending" ? (
                      <Link
                        className="font-semibold text-[var(--link)]"
                        href={`/tenant/payments/${payment.id}`}
                      >
                        Payer via EasyPay
                      </Link>
                    ) : null}
                    <Link
                      className="font-semibold"
                      href={`/tenant/payments/${payment.id}`}
                    >
                      Voir le détail
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SurfaceCard>
    </TenantPageFrame>
  );
}
