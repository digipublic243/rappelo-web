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
import { LandlordEasyPayPanel } from "@/features/landlord/LandlordEasyPayPanel";
import { PaymentLinkPanel } from "@/features/landlord/PaymentLinkPanel";

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
  const easypayHistory: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
  }> = [
    payment.createdAt
      ? {
          id: "created",
          title: "Paiement créé",
          description: payment.paymentLabel ?? "Création de l’échéance de paiement",
          date: payment.createdAt,
        }
      : null,
    payment.easypayReferenceId || payment.easypayGatewayReference
      ? {
          id: "initiated",
          title: "Collecte EasyPay initiée",
          description: payment.easypayGatewayReference
            ? `Référence passerelle ${payment.easypayGatewayReference}`
            : `Référence ${payment.easypayReferenceId}`,
          date: payment.createdAt ?? payment.dueDate,
        }
      : null,
    payment.easypayLastCheck
      ? {
          id: "checked",
          title: "Dernière vérification du statut",
          description: `Tentatives de synchronisation : ${payment.easypayAttempts ?? 0}`,
          date: payment.easypayLastCheck,
        }
      : null,
    payment.paidAt
      ? {
          id: "paid",
          title: "Paiement confirmé",
          description: `Statut final : ${paymentStatusLabel(payment.status)}`,
          date: payment.paidAt,
        }
      : null,
  ].filter(
    (
      item,
    ): item is {
      id: string;
      title: string;
      description: string;
      date: string;
    } => Boolean(item),
  );

  return (
    <LandlordPageFrame currentPath="/landlord/payments">
      <DataStateNotice meta={meta} />
      <PageIntro
        backHref="/landlord/payments"
        backLabel="Retour aux paiements"
        eyebrow="Paiement"
        title={payment.paymentLabel ?? `Paiement ${payment.id}`}
        description={`${paymentStatusLabel(payment.status)} • échéance ${formatDate(
          payment.dueDate,
        )}`}
        action={
          <div className="flex flex-wrap gap-3">
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
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-2">
                {formatPaymentMethod(payment.method)}
              </span>
            </div>
            <p className="mt-5 text-4xl font-black tracking-tight text-foreground">
              {formatMoney(payment.amount, payment.currency)}
            </p>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
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
                  {payment.paidAt ? formatDate(payment.paidAt) : "Non réglé"}
                </p>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">
              Références du paiement
            </h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
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
              <div className="md:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                  Notes
                </p>
                <p className="mt-2 text-sm text-secondary-2">
                  {payment.notes ?? "Aucune note enregistrée."}
                </p>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <PaymentLinkPanel payment={payment} />
          </SurfaceCard>

          {payment.method === "easypay" ||
          payment.easypayReferenceId ||
          payment.easypayTransactionId ||
          payment.easypayAttempts ? (
            <SurfaceCard className="p-6">
              <LandlordEasyPayPanel payment={payment} />
            </SurfaceCard>
          ) : null}
        </div>

        <div className="space-y-8 lg:col-span-4">
          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">Contexte locatif</h2>
            <div className="mt-4 space-y-3 text-sm text-secondary-2">
              <p>
                <span className="font-semibold text-foreground">Locataire :</span>{" "}
                {payment.tenantName ?? tenant?.fullName ?? payment.tenantId}
              </p>
              <p>
                <span className="font-semibold text-foreground">Unité :</span>{" "}
                {unit?.label ?? payment.unitId ?? "Indisponible"}
              </p>
              <p>
                <span className="font-semibold text-foreground">Bien :</span>{" "}
                {property?.name ?? "Indisponible"}
              </p>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">
              Historique des transactions
            </h2>
            {easypayHistory.length ? (
              <div className="mt-5 space-y-4">
                {easypayHistory.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-secondary-1 bg-secondary-4 px-4 py-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-2">
                      {formatDate(item.date)}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-secondary-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-secondary-1 bg-secondary-4 px-4 py-4 text-sm text-secondary-2">
                Aucun événement EasyPay n’a encore été enregistré pour ce paiement.
              </div>
            )}
          </SurfaceCard>
        </div>
      </section>
    </LandlordPageFrame>
  );
}
