import Link from "next/link";
import { notFound } from "next/navigation";
import { AppForm, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import {
  SurfaceCard,
  actionButtonClassName,
} from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  formatDate,
  formatMoney,
  formatPaymentMethod,
  paymentStatusLabel,
} from "@/lib/format";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getLandlordPaymentDetailVm } from "@/features/landlord/api";
import { paymentActions } from "@/features/landlord/actionRules";
import { confirmPaymentAction } from "@/features/landlord/actions";

interface PageProps {
  params: Promise<{ paymentId: string }>;
}

export default async function LandlordPaymentDetailPage({ params }: PageProps) {
  const { paymentId } = await params;
  const detail = await getLandlordPaymentDetailVm(paymentId);

  if (!detail) {
    notFound();
  }

  const { payment, tenant, lease, property, unit, meta } = detail;
  const actions = paymentActions(payment.status);

  return (
    <LandlordPageFrame currentPath="/landlord/payments">
      <DataStateNotice meta={meta} />
      <PageIntro
        eyebrow="Paiement"
        title={payment.paymentLabel ?? `Paiement ${payment.id}`}
        description={`${paymentStatusLabel(payment.status)} • échéance ${formatDate(
          payment.dueDate,
        )}`}
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              className={actionButtonClassName({ variant: "ghost" })}
              href="/landlord/payments"
            >
              Retour aux paiements
            </Link>
            <Link
              className={actionButtonClassName({ variant: "secondary" })}
              href="/landlord/payments/send-reminder"
            >
              Envoyer un rappel
            </Link>
            {actions.canConfirm ? (
              <AppForm action={confirmPaymentAction}>
                <FormField name="paymentId" type="hidden" value={payment.id} />
                <FormSubmitButton className="rounded-lg px-5 py-3 text-sm">
                  Marquer comme payé
                </FormSubmitButton>
              </AppForm>
            ) : null}
          </div>
        }
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <SurfaceCard className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge
                status={payment.status}
                label={paymentStatusLabel(payment.status)}
              />
              <span className="rounded-full bg-[#e8eff3] px-3 py-1 text-xs font-semibold text-[#566166]">
                {formatPaymentMethod(payment.method)}
              </span>
            </div>
            <p className="mt-5 text-4xl font-black tracking-tight text-[#2a3439]">
              {formatMoney(payment.amount)}
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#717c82]">
                  Échéance
                </p>
                <p className="mt-2 text-sm font-semibold text-[#2a3439]">
                  {formatDate(payment.dueDate)}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#717c82]">
                  Réglé le
                </p>
                <p className="mt-2 text-sm font-semibold text-[#2a3439]">
                  {payment.paidAt ? formatDate(payment.paidAt) : "Non réglé"}
                </p>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-[#2a3439]">
              Références du paiement
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#717c82]">
                  Bail
                </p>
                <p className="mt-2 text-sm font-semibold text-[#2a3439]">
                  {lease?.lease_number ?? payment.leaseId ?? "Aucun bail"}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#717c82]">
                  Référence transaction
                </p>
                <p className="mt-2 text-sm font-semibold text-[#2a3439]">
                  {payment.transactionReference ?? "Aucune référence"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#717c82]">
                  Notes
                </p>
                <p className="mt-2 text-sm text-[#566166]">
                  {payment.notes ?? "Aucune note enregistrée."}
                </p>
              </div>
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-8 lg:col-span-4">
          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-[#2a3439]">Contexte locatif</h2>
            <div className="mt-4 space-y-3 text-sm text-[#566166]">
              <p>
                <span className="font-semibold text-[#2a3439]">Locataire :</span>{" "}
                {payment.tenantName ?? tenant?.fullName ?? payment.tenantId}
              </p>
              <p>
                <span className="font-semibold text-[#2a3439]">Unité :</span>{" "}
                {unit?.label ?? payment.unitId ?? "Indisponible"}
              </p>
              <p>
                <span className="font-semibold text-[#2a3439]">Bien :</span>{" "}
                {property?.name ?? "Indisponible"}
              </p>
            </div>
          </SurfaceCard>
        </div>
      </section>
    </LandlordPageFrame>
  );
}
