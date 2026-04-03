import { notFound } from "next/navigation";
import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  formatDate,
  formatMoney,
  formatPaymentMethod,
  paymentStatusLabel,
} from "@/lib/format";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getTenantPaymentDetailVm } from "@/features/tenant/api";
import { TenantEasyPayPanel } from "@/features/tenant/TenantEasyPayPanel";

interface PageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function TenantPaymentDetailPage({ params }: PageProps) {
  const { paymentId } = await params;
  const detail = await getTenantPaymentDetailVm(paymentId);

  if (!detail) {
    notFound();
  }

  const { payment, lease, unit, property, accountPhone, meta } = detail;

  return (
    <TenantPageFrame currentPath="/tenant/payments">
      <DataStateNotice meta={meta} />
      <PageIntro
        backHref="/tenant/payments"
        backLabel="Retour aux paiements"
        eyebrow="Paiement"
        title={payment.paymentLabel ?? `Paiement ${payment.id}`}
        description={`${paymentStatusLabel(payment.status)} • échéance ${formatDate(
          payment.dueDate,
        )}`}
      />

      <section className="space-y-8">
        <SurfaceCard className="p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge
              status={payment.status}
              label={paymentStatusLabel(payment.status)}
            />
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-2">
              {formatPaymentMethod(payment.method)}
            </span>
          </div>
          <p className="mt-5 text-4xl font-black tracking-tight text-foreground">
            {formatMoney(payment.amount, payment.currency)}
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                Échéance
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {formatDate(payment.dueDate)}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                Réglé le
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {payment.paidAt ? formatDate(payment.paidAt) : "En attente"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                Bail
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {lease?.lease_number ?? payment.leaseId ?? "Aucun bail"}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                Référence transaction
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {payment.transactionReference ?? "Aucune référence"}
              </p>
            </div>
          </div>
        </SurfaceCard>

        <div className="grid gap-8 xl:grid-cols-3">
          <div className="space-y-8 xl:col-span-2">
            <SurfaceCard className="p-6">
              <TenantEasyPayPanel accountPhone={accountPhone} payment={payment} />
            </SurfaceCard>
          </div>

          <div className="space-y-8 xl:col-span-1">
            <SurfaceCard className="p-6">
              <h2 className="text-xl font-bold text-foreground">
                Informations du paiement
              </h2>
              <div className="mt-5 grid gap-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                    Notes
                  </p>
                  <p className="mt-2 text-sm text-secondary-2">
                    {payment.notes ?? "Aucune note enregistrée."}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                    Unité
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {unit?.label ?? payment.unitId ?? "Indisponible"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                    Bien
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {property?.name ?? "Indisponible"}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </section>
    </TenantPageFrame>
  );
}
