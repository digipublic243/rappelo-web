import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import {
  SurfaceCard,
  actionButtonClassName,
} from "@/components/shared/StitchPrimitives";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getLandlordPaymentWorkflowData } from "@/features/landlord/api";
import { formatMoney } from "@/lib/format";
import { SendPaymentReminderForm } from "@/features/landlord/SendPaymentReminderForm";
import Link from "next/link";

export default async function SendReminderPage() {
  const { payments, overduePayments, tenants, meta } = await getLandlordPaymentWorkflowData();
  const overduePayment = overduePayments?.[0] ?? payments.find((payment) => payment.status === "pending") ?? payments[0];
  const relatedTenant = overduePayment ? tenants.find((tenant) => tenant.id === overduePayment.tenantId) : undefined;

  return (
    <LandlordPageFrame currentPath="/landlord/payments">
      <DataStateNotice meta={meta} />
      <PageIntro
        title="Envoyer un rappel"
        description="Déclenchez une relance sur les paiements en attente avec un message adapté au contexte du locataire."
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
              href="/landlord/payments/generate-link"
            >
              Générer un lien
            </Link>
          </div>
        }
      />

      <section className="grid gap-8 lg:grid-cols-2">
        <SurfaceCard className="p-6">
          <h2 className="text-xl font-bold text-[#2a3439]">Relance de paiement</h2>
          <div className="mt-5 rounded-xl bg-[#f0f4f7] p-4">
            <p className="font-semibold text-[#2a3439]">{relatedTenant?.fullName ?? "Locataire indisponible"}</p>
            <p className="text-xs text-[#566166]">{overduePayment?.unitId || "Unité indisponible"} • Contexte du paiement</p>
          </div>
          <SendPaymentReminderForm payments={payments} tenants={tenants} />
        </SurfaceCard>

        <SurfaceCard className="rounded-[28px] bg-[linear-gradient(145deg,#2a3439,#556170)] p-8 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-white/60">Aperçu</p>
          <h2 className="mt-3 text-2xl font-bold">Contexte de relance</h2>
          <p className="mt-4 text-sm leading-6 text-white/80">
            {relatedTenant
              ? `${relatedTenant.fullName} présente actuellement un solde en attente de ${overduePayment ? formatMoney(overduePayment.amount) : "$0.00"} pour ${overduePayment?.unitId || "l’unité sélectionnée"}.`
              : "Aucun contexte locataire en retard n’est actuellement disponible depuis le registre live."}
          </p>
        </SurfaceCard>
      </section>
    </LandlordPageFrame>
  );
}
