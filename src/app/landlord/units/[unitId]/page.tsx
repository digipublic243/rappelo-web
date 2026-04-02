import { notFound } from "next/navigation";
import { unitActions } from "@/features/landlord/actionRules";
import { LandlordPageFrame } from "@/features/landlord/LandlordPageFrame";
import { PageIntro } from "@/components/ui/PageIntro";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { AppForm, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField } from "@/components/forms/FormField";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatCadence, formatMoney, unitStatusLabel } from "@/lib/format";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { DataStateNotice } from "@/components/ui/DataStateNotice";
import { getLandlordUnitDetailVm } from "@/features/landlord/api";
import { updateUnitStatusAction } from "@/features/landlord/actions";

interface PageProps {
  params: Promise<{ unitId: string }>;
}

export default async function UnitConfigurationPage({ params }: PageProps) {
  const { unitId } = await params;
  const detail = await getLandlordUnitDetailVm(unitId);

  if (!detail) {
    notFound();
  }
  const { unit, details, meta } = detail;

  const actions = unitActions(unit.status);

  return (
    <LandlordPageFrame currentPath="/landlord/units">
      <DataStateNotice meta={meta} />
      <PageIntro
        title={`${unit.label} Configuration`}
        description="Cadence tarifaire, politique d’avance, statut de cycle de vie et moyens de paiement acceptés."
      />

      <section className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-7">
          <SurfaceCard className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={unit.status} label={unitStatusLabel(unit.status)} />
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-2">{formatCadence(unit.pricingCadence)}</span>
              <span className="rounded-full bg-success/20 px-3 py-1 text-xs font-semibold text-success">
                Dépôt {unit.depositEnabled ? "activé" : "désactivé"}
              </span>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <label className="text-sm font-medium text-secondary-2">
                Loyer
                <input className="mt-2 w-full rounded-xl border border-[var(--secondary-1)] bg-white px-4 py-3 text-foreground" defaultValue={details.rent ?? unit.price} />
              </label>
              <label className="text-sm font-medium text-secondary-2">
                Périodicité locative
                <select className="mt-2 w-full rounded-xl border border-[var(--secondary-1)] bg-white px-4 py-3 text-foreground" defaultValue={details.rentalPeriodicity ?? "mensuel"}>
                  <option value="journ">Journalier</option>
                  <option value="hebdo">Hebdomadaire</option>
                  <option value="mensuel">Mensuel</option>
                  <option value="autre">Autre</option>
                </select>
              </label>
              <label className="text-sm font-medium text-secondary-2 md:col-span-2">
                Politique de paiement d’avance
                <textarea
                  className="mt-2 w-full rounded-xl border border-[var(--secondary-1)] bg-white px-4 py-3 text-foreground"
                  defaultValue={details.advancePaymentPolicyText ?? "Aucune politique d’avance renseignée par l’API pour cette unité."}
                  rows={4}
                />
              </label>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-[var(--secondary-4)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary-3)]">Devise</p>
                <p className="mt-2 font-semibold text-foreground">{details.currency ?? "USD"}</p>
              </div>
              <div className="rounded-xl bg-[var(--secondary-4)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary-3)]">Dépôt de garantie</p>
                <p className="mt-2 font-semibold text-foreground">{details.securityDeposit != null ? formatMoney(details.securityDeposit) : "Non défini"}</p>
              </div>
              <div className="rounded-xl bg-[var(--secondary-4)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary-3)]">Acompte de réservation</p>
                <p className="mt-2 font-semibold text-foreground">{details.bookingDeposit != null ? formatMoney(details.bookingDeposit) : "Non défini"}</p>
              </div>
              <div className="rounded-xl bg-[var(--secondary-4)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--secondary-3)]">État</p>
                <p className="mt-2 font-semibold text-foreground">{details.isActive ? "Actif" : "Inactif"}</p>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-lg font-bold text-foreground">Moyens de paiement autorisés</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {((details.allowedPaymentMethods?.length ? details.allowedPaymentMethods : unit.allowedPaymentMethods)?.length
                ? (details.allowedPaymentMethods?.length ? details.allowedPaymentMethods : unit.allowedPaymentMethods)
                : ["cash"]
              )?.map((method) => (
                <div key={method} className="flex items-center gap-4 rounded-xl bg-[var(--secondary-4)] p-4">
                  <div className="rounded-xl bg-white p-3 text-[var(--primary)]">
                    <MaterialIcon name={method === "easypay" || method === "mobile_money" ? "wallet" : "payments"} className="text-[20px]" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {method === "easypay" || method === "mobile_money" ? "EasyPay" : method === "cash" ? "Espèces" : method}
                    </p>
                    <p className="text-sm text-secondary-2">Configuré à partir du payload détail renvoyé par l’API.</p>
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <SurfaceCard className="p-6">
            <h2 className="text-lg font-bold text-foreground">Statut du cycle de vie</h2>
            <div className="mt-5 space-y-3">
              {["vacant", "reserved", "occupied", "maintenance"].map((status) => (
                <AppForm action={updateUnitStatusAction} className="contents" key={status}>
                  <FormField name="unitId" type="hidden" value={unit.id} />
                  <FormField name="status" type="hidden" value={status} />
                  <FormSubmitButton className="flex w-full items-center justify-between rounded-xl bg-[var(--secondary-4)] px-4 py-3 text-left text-foreground shadow-none">
                    <p className="text-sm font-semibold text-foreground">{unitStatusLabel(status as typeof unit.status)}</p>
                    <div className={`h-3 w-3 rounded-full ${unit.status === status ? "bg-success/20" : "bg-[var(--secondary-1)]"}`} />
                  </FormSubmitButton>
                </AppForm>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-[var(--secondary-4)] px-4 py-3 text-sm text-secondary-2">
              L’affectation d’un locataire et la planification de maintenance restent des actions visuelles tant que les endpoints dédiés ne sont pas exposés.
            </div>
            <p className="mt-4 text-xs text-[var(--secondary-3)]">
              Actions disponibles maintenant : affecter un locataire {actions.canAssignTenant ? "oui" : "non"}, maintenance {actions.canScheduleMaintenance ? "oui" : "non"}.
            </p>
          </SurfaceCard>

          <SurfaceCard className="overflow-hidden">
            <div className="h-56 bg-[var(--secondary-1)]">
              <img
                alt={unit.label}
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
              />
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--secondary-3)]">Performance de l’unité</p>
              <p className="mt-2 text-3xl font-black text-foreground">{formatMoney(unit.price)}</p>
              <p className="mt-2 text-sm text-secondary-2">{unit.tenantName ?? "Aucun locataire actif assigné"}.</p>
            </div>
          </SurfaceCard>
        </div>
      </section>
    </LandlordPageFrame>
  );
}
