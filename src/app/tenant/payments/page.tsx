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
          ["À venir", formatMoney(upcoming, "CDF")],
          ["Payé", formatMoney(paidYtd, "CDF")],
          ["Remboursé", formatMoney(refunds, "CDF")],
          [
            "Méthodes",
            methods.length > 0
              ? methods.map((method) => formatPaymentMethod(method)).join(" + ")
              : "N/A",
          ],
        ].map(([label, value]) => (
          <SurfaceCard key={label} className="p-5">
            <p className="text-sm font-medium text-secondary-2">{label}</p>
            <p className="mt-2 text-3xl font-black text-foreground">{value}</p>
          </SurfaceCard>
        ))}
      </section>

      <SurfaceCard className="overflow-hidden">
        <div className="border-b border-[var(--secondary)] px-6 py-5">
          <h2 className="text-xl font-bold text-foreground">Historique des paiements</h2>
        </div>
        <table className="w-full min-w-[860px]">
          <thead className="bg-[var(--secondary-4)] text-left">
            <tr>
              {["Période / date", "Montant", "Mode", "Statut", "Bail", "Action"].map(
                (label) => (
                  <th
                    key={label}
                    className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-secondary-2"
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
                <td className="px-8 py-5 text-sm text-secondary-2">
                  <p>{formatDate(payment.paidAt ?? payment.dueDate)}</p>
                  <p className="mt-1 text-xs text-[var(--secondary-3)]">
                    {payment.paymentLabel ?? `Paiement à partir du ${payment.dueDate}`}
                  </p>
                </td>
                <td className="px-8 py-5 text-sm font-semibold text-foreground">
                  {formatMoney(payment.amount, payment.currency ?? "CDF")}
                </td>
                <td className="px-8 py-5 text-sm text-secondary-2">
                  {formatPaymentMethod(payment.method)}
                </td>
                <td className="px-8 py-5">
                  <StatusBadge
                    status={payment.status}
                    label={paymentStatusLabel(payment.status)}
                  />
                </td>
                <td className="px-8 py-5 text-sm text-secondary-2">
                  {payment.leaseId ?? "Aucun bail"}
                </td>
                <td className="px-8 py-5 text-sm text-primary">
                  <div className="flex flex-col gap-2">
                    {payment.status === "pending" ? (
                      <Link
                        className="font-semibold text-primary"
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
