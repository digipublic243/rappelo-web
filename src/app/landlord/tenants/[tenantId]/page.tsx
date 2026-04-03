import { notFound } from "next/navigation";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, ActionButton } from "@/components/shared/StitchPrimitives";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPhone, leaseStatusLabel, paymentStatusLabel } from "@/lib/format";
import { getLandlordTenantDetailVm } from "@/features/landlord/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

interface PageProps {
  params: Promise<{ tenantId: string }>;
}

export default async function TenantDetailPage({ params }: PageProps) {
  const { tenantId } = await params;
  const detail = await getLandlordTenantDetailVm(tenantId);

  if (!detail) {
    notFound();
  }
  const { tenant, lease, payments, meta } = detail;

  return (
    <LandlordPageFrame currentPath="/landlord/tenants">
      <DataStateNotice meta={meta} />
      <PageIntro
        backHref="/landlord/tenants"
        backLabel="Retour aux locataires"
        title={tenant.fullName}
        description={`Locataire principal • ${tenant.unitId}`}
        action={
          <div className="flex flex-wrap gap-3">
            <ActionButton variant="secondary">Message locataire</ActionButton>
            <ActionButton variant="ghost">Envoyer un rappel</ActionButton>
            <ActionButton>Clôturer le bail</ActionButton>
          </div>
        }
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">Bail en cours</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">Email</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{tenant.email}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">Téléphone</p>
                <p className="mt-2 text-sm font-semibold text-foreground">{formatPhone(tenant.phone)}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">Statut du bail</p>
                <div className="mt-2">
                  <StatusBadge status={lease?.status ?? tenant.leaseStatus} label={leaseStatusLabel(lease?.status ?? tenant.leaseStatus)} />
                </div>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary-3)]">Santé des paiements</p>
                <div className="mt-2">
                  <StatusBadge status={tenant.paymentStatus} label={paymentStatusLabel(tenant.paymentStatus)} />
                </div>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="overflow-hidden">
            <div className="border-b border-[var(--secondary)] px-6 py-5">
              <h2 className="text-xl font-bold text-foreground">Historique des séjours et paiements</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead className="bg-[var(--secondary-4)]">
                  <tr>
                    {["Bien / unité", "Bail", "Paiement", "Contexte"].map((label) => (
                      <th key={label} className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-secondary-2">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[var(--secondary)]">
                    <td className="px-6 py-4 text-sm font-semibold text-foreground">Azure Heights • {tenant.unitId}</td>
                    <td className="px-6 py-4 text-sm text-secondary-2">{leaseStatusLabel(lease?.status ?? tenant.leaseStatus)}</td>
                    <td className="px-6 py-4 text-sm text-secondary-2">{payments[0] ? paymentStatusLabel(payments[0].status) : paymentStatusLabel(tenant.paymentStatus)}</td>
                    <td className="px-6 py-4 text-sm text-secondary-2">Dernier aperçu du registre et des échanges avec le locataire.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <SurfaceCard className="p-6">
            <h2 className="text-xl font-bold text-foreground">Fil d’activité</h2>
            <div className="mt-5 space-y-4">
              {[
                "Le locataire a signalé du bruit au niveau de la climatisation. Maintenance planifiée pour jeudi.",
                "Paiement du loyer confirmé et reçu archivé dans le registre.",
                "Demande de renouvellement du bail envoyée pour la prochaine période.",
              ].map((item) => (
                <div key={item} className="rounded-xl bg-[var(--secondary-4)] p-4 text-sm text-secondary-2">
                  {item}
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>
      </section>
    </LandlordPageFrame>
  );
}
