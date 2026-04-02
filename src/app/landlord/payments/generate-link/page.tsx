import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import {
  SurfaceCard,
  actionButtonClassName,
} from "@/components/shared/StitchPrimitives";
import { getLandlordPaymentWorkflowData } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { GeneratePaymentLinkForm } from "@/features/landlord/GeneratePaymentLinkForm";
import { formatMoney } from "@/lib/format";
import Link from "next/link";

export default async function GeneratePaymentLinkPage() {
  const { leases, tenants, payments, summary, meta } = await getLandlordPaymentWorkflowData();

  return (
    <LandlordPageFrame currentPath="/landlord/payments">
      <DataStateNotice meta={meta} />
      <PageIntro
        title="Générer un lien de paiement"
        description="Créez ou rattachez un paiement existant, puis générez un lien partageable. Le backend recalculera le montant à partir du bail et de sa périodicité."
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
              Aller aux rappels
            </Link>
          </div>
        }
      />

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {payments.slice(0, 3).map((payment) => {
            const tenant = tenants.find((item) => item.id === payment.tenantId);
            const lease = leases.find((item) => item.id === payment.leaseId);
            return (
              <SurfaceCard key={payment.id} className="p-5">
                <p className="font-semibold text-foreground">{tenant?.fullName ?? payment.tenantId}</p>
                <p className="mt-1 text-xs text-secondary-2">
                  {lease?.lease_number ?? "Bail non lié"} • {payment.unitId || "Unité indisponible"} • {formatMoney(payment.amount, payment.currency ?? "CDF")}
                </p>
              </SurfaceCard>
            );
          })}
          <SurfaceCard className="p-6">
            <p className="text-sm text-secondary-2">En attente sur ce cycle</p>
            <p className="mt-2 text-4xl font-black text-foreground">{formatMoney(summary?.totalPending ?? 0, "CDF")}</p>
            <p className="mt-2 text-xs text-secondary-2">
              {summary?.countPending ?? 0} paiement(s) encore à régulariser.
            </p>
          </SurfaceCard>
        </div>

        <SurfaceCard className="p-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Lien de paiement</h2>
          <GeneratePaymentLinkForm leases={leases} payments={payments} tenants={tenants} />
        </SurfaceCard>
      </section>
    </LandlordPageFrame>
  );
}
