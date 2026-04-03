import Link from "next/link";
import { TenantPageFrame } from "@/features/tenant/TenantPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard, actionButtonClassName } from "@/components/shared/StitchPrimitives";
import { formatDate, formatMoney, paymentStatusLabel } from "@/lib/format";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { getTenantDashboardVm } from "@/features/tenant/api";
import { DataStateNotice } from "@/components/ui/DataStateNotice";

export default async function TenantDashboardPage() {
  const dashboard = await getTenantDashboardVm();
  const nextPayment = dashboard.nextDuePayment ?? dashboard.payments.find((payment) => payment.status === "pending");
  const currentLeaseLabel =
    dashboard.currentLease ? `${formatDate(dashboard.currentLease.startDate)} - ${formatDate(dashboard.currentLease.endDate)}` : "Aucun bail actif";
  const dashboardFacts = [
    {
      icon: "description",
      title: "Statut du bail",
      text: dashboard.currentLease ? `${dashboard.currentLease.status} jusqu’au ${formatDate(dashboard.currentLease.endDate)}.` : "Aucun bail actif n’est lié à ce compte.",
    },
    {
      icon: "payments",
      title: "Situation des paiements",
      text: nextPayment ? `Paiement ${paymentStatusLabel(nextPayment.status).toLowerCase()} dû le ${formatDate(nextPayment.dueDate)}.` : "Aucun paiement en attente pour le moment.",
    },
    {
      icon: "home",
      title: "Résidence",
      text: dashboard.currentProperty ? `${dashboard.currentProperty.name}, ${dashboard.currentProperty.city}.` : "Aucun bien n’est actuellement rattaché au séjour actif.",
    },
  ];
  const accountSummary = [
    ["Baux", String(dashboard.quickStats?.leases ?? dashboard.leases.length)],
    ["Paiements", String(dashboard.quickStats?.payments ?? dashboard.payments.length)],
    ["En attente", String(dashboard.quickStats?.pending_payments ?? dashboard.payments.filter((payment) => payment.status === "pending").length)],
  ];

  return (
    <TenantPageFrame currentPath="/tenant/dashboard">
      <DataStateNotice meta={dashboard.meta} />
      <PageIntro
        eyebrow="Aperçu"
        title={`Bon retour, ${dashboard.profileName.split(" ")[0]}`}
        description={`Voici l’essentiel de votre situation pour ${dashboard.currentProperty?.name ?? "votre résidence actuelle"}.`}
        action={
          <Link className={actionButtonClassName({})} href="/tenant/book-stay">
            <MaterialIcon name="add" className="text-[18px]" />
            Réserver un autre séjour
          </Link>
        }
      />

      <section className="grid gap-6 md:grid-cols-12">
        <SurfaceCard className="overflow-hidden md:col-span-8">
          <div className="relative h-72">
            <div className="absolute inset-0 bg-[linear-gradient(145deg,var(--primary),var(--primary-2))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_42%)]" />
            <div className="absolute bottom-6 left-8 text-white">
              <span className="mb-3 inline-block rounded-full bg-success/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">Séjour en cours</span>
              <h2 className="text-2xl font-bold">
                {dashboard.currentUnit?.label ?? "Unité indisponible"}, {dashboard.currentProperty?.name ?? "Bien indisponible"}
              </h2>
              <p className="text-sm text-white/80">
                {dashboard.currentProperty ? `${dashboard.currentProperty.address}, ${dashboard.currentProperty.city}` : "Adresse indisponible"}
              </p>
            </div>
          </div>
          <div className="grid gap-6 p-8 md:grid-cols-4">
            {[
              ["Période du bail", currentLeaseLabel],
              ["Date d’expiration", dashboard.currentLease ? formatDate(dashboard.currentLease.endDate) : "Indisponible"],
              ["Loyer", dashboard.currentLease ? formatMoney(dashboard.currentLease.rentAmount, dashboard.currentLease.currency) : formatMoney(0)],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--secondary-3)]">{label}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
              </div>
            ))}
            <div className="flex items-center justify-end">
              <Link className="text-sm font-bold text-primary" href="/tenant/leases">
                Détails
              </Link>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="bg-primary-3 p-8 md:col-span-4">
          <div className="flex items-start justify-between">
            <div className="rounded-xl bg-background/50 p-3">
              <MaterialIcon name="account_balance_wallet" className="text-[22px] text-primary" />
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[var(--primary-2)]">
              Prochaine échéance
            </span>
          </div>
          <h3 className="mt-10 text-lg font-bold text-foreground">Paiement du loyer</h3>
          <p className="mt-1 text-4xl font-black tracking-tight text-foreground">{nextPayment ? formatMoney(nextPayment.amount, nextPayment.currency) : formatMoney(0)}</p>
          <p className="mt-4 text-sm font-medium text-secondary-2">
            {nextPayment ? `À régler avant le ${formatDate(nextPayment.dueDate)}` : "Aucun paiement à venir"}
          </p>
          <Link
            className={actionButtonClassName({ className: "mt-8 w-full" })}
            href="/tenant/payments"
          >
            Payer maintenant
          </Link>
          <p className="mt-3 text-center text-[11px] text-secondary-2">
            {dashboard.automaticPaymentsEnabled ? "Les paiements automatiques sont activés pour cette unité." : "Les paiements automatiques ne sont pas encore activés."}
          </p>
        </SurfaceCard>

        <SurfaceCard className="bg-[var(--secondary-4)] p-8 md:col-span-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Résumé du séjour</h3>
            <span className="rounded-full bg-background px-3 py-1 text-[10px] font-bold text-secondary-2">
              {dashboard.leases.length} contexte(s) actif(s)
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {dashboardFacts.map(({ icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-lg bg-background/70 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-3 text-[var(--primary-2)]">
                  <MaterialIcon name={icon} className="text-[18px]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{title}</p>
                  <p className="mt-1 text-xs text-secondary-2">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-8 md:col-span-6">
          <h3 className="text-lg font-bold text-foreground">Vue d’ensemble du compte</h3>
          <p className="mt-2 text-sm text-secondary-2">Résumé en direct dérivé du profil locataire, de vos baux et de vos paiements.</p>
          <div className="mt-6 rounded-2xl bg-[linear-gradient(145deg,var(--primary-1),var(--primary-2))] p-6 text-white">
            <p className="text-sm font-semibold">{dashboard.profileName}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {accountSummary.map(([label, value]) => (
                <div key={label} className="rounded-xl bg-background/8 px-4 py-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">{label}</p>
                  <p className="mt-2 text-xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-8 md:col-span-12">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Notifications non lues</h3>
            <span className="rounded-full bg-[var(--secondary-4)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary-2">
              {dashboard.notifications.length} en attente
            </span>
          </div>
          {dashboard.notifications.length === 0 ? (
            <p className="mt-4 text-sm text-secondary-2">Aucune notification non lue côté backend pour le moment.</p>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {dashboard.notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="rounded-2xl bg-[var(--secondary-4)] p-4">
                  <p className="text-sm font-bold text-foreground">{notification.title}</p>
                  <p className="mt-2 text-sm text-secondary-2">{notification.message}</p>
                  {notification.createdAt ? (
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--secondary-3)]">
                      {formatDate(notification.createdAt)}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </SurfaceCard>
      </section>
    </TenantPageFrame>
  );
}
