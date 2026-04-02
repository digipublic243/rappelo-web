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
              <span className="rounded-full bg-[#e8eff3] px-3 py-1 text-xs font-semibold text-[#566166]">{formatCadence(unit.pricingCadence)}</span>
              <span className="rounded-full bg-[#b8f9de] px-3 py-1 text-xs font-semibold text-[#22614d]">
                Dépôt {unit.depositEnabled ? "activé" : "désactivé"}
              </span>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <label className="text-sm font-medium text-[#566166]">
                Loyer
                <input className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-white px-4 py-3 text-[#2a3439]" defaultValue={details.rent ?? unit.price} />
              </label>
              <label className="text-sm font-medium text-[#566166]">
                Périodicité locative
                <select className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-white px-4 py-3 text-[#2a3439]" defaultValue={details.rentalPeriodicity ?? "mensuel"}>
                  <option value="journ">Journalier</option>
                  <option value="hebdo">Hebdomadaire</option>
                  <option value="mensuel">Mensuel</option>
                  <option value="autre">Autre</option>
                </select>
              </label>
              <label className="text-sm font-medium text-[#566166] md:col-span-2">
                Politique de paiement d’avance
                <textarea
                  className="mt-2 w-full rounded-xl border border-[#d9e4ea] bg-white px-4 py-3 text-[#2a3439]"
                  defaultValue={details.advancePaymentPolicyText ?? "Aucune politique d’avance renseignée par l’API pour cette unité."}
                  rows={4}
                />
              </label>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-[#f0f4f7] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Devise</p>
                <p className="mt-2 font-semibold text-[#2a3439]">{details.currency ?? "USD"}</p>
              </div>
              <div className="rounded-xl bg-[#f0f4f7] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Dépôt de garantie</p>
                <p className="mt-2 font-semibold text-[#2a3439]">{details.securityDeposit != null ? formatMoney(details.securityDeposit) : "Non défini"}</p>
              </div>
              <div className="rounded-xl bg-[#f0f4f7] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">Acompte de réservation</p>
                <p className="mt-2 font-semibold text-[#2a3439]">{details.bookingDeposit != null ? formatMoney(details.bookingDeposit) : "Non défini"}</p>
              </div>
              <div className="rounded-xl bg-[#f0f4f7] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#717c82]">État</p>
                <p className="mt-2 font-semibold text-[#2a3439]">{details.isActive ? "Actif" : "Inactif"}</p>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <h2 className="text-lg font-bold text-[#2a3439]">Moyens de paiement autorisés</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {((details.allowedPaymentMethods?.length ? details.allowedPaymentMethods : unit.allowedPaymentMethods)?.length
                ? (details.allowedPaymentMethods?.length ? details.allowedPaymentMethods : unit.allowedPaymentMethods)
                : ["cash"]
              )?.map((method) => (
                <div key={method} className="flex items-center gap-4 rounded-xl bg-[#f0f4f7] p-4">
                  <div className="rounded-xl bg-white p-3 text-[#545f73]">
                    <MaterialIcon name={method === "easypay" || method === "mobile_money" ? "wallet" : "payments"} className="text-[20px]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#2a3439]">
                      {method === "easypay" || method === "mobile_money" ? "EasyPay" : method === "cash" ? "Espèces" : method}
                    </p>
                    <p className="text-sm text-[#566166]">Configuré à partir du payload détail renvoyé par l’API.</p>
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-8 lg:col-span-5">
          <SurfaceCard className="p-6">
            <h2 className="text-lg font-bold text-[#2a3439]">Statut du cycle de vie</h2>
            <div className="mt-5 space-y-3">
              {["vacant", "reserved", "occupied", "maintenance"].map((status) => (
                <AppForm action={updateUnitStatusAction} className="contents" key={status}>
                  <FormField name="unitId" type="hidden" value={unit.id} />
                  <FormField name="status" type="hidden" value={status} />
                  <FormSubmitButton className="flex w-full items-center justify-between rounded-xl bg-[#f0f4f7] px-4 py-3 text-left text-[#2a3439] shadow-none">
                    <p className="text-sm font-semibold text-[#2a3439]">{unitStatusLabel(status as typeof unit.status)}</p>
                    <div className={`h-3 w-3 rounded-full ${unit.status === status ? "bg-[#2c6a55]" : "bg-[#d9e4ea]"}`} />
                  </FormSubmitButton>
                </AppForm>
              ))}
            </div>
            <div className="mt-6 rounded-xl bg-[#f0f4f7] px-4 py-3 text-sm text-[#566166]">
              L’affectation d’un locataire et la planification de maintenance restent des actions visuelles tant que les endpoints dédiés ne sont pas exposés.
            </div>
            <p className="mt-4 text-xs text-[#717c82]">
              Actions disponibles maintenant : affecter un locataire {actions.canAssignTenant ? "oui" : "non"}, maintenance {actions.canScheduleMaintenance ? "oui" : "non"}.
            </p>
          </SurfaceCard>

          <SurfaceCard className="overflow-hidden">
            <div className="h-56 bg-[#d9e4ea]">
              <img
                alt={unit.label}
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
              />
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.24em] text-[#717c82]">Performance de l’unité</p>
              <p className="mt-2 text-3xl font-black text-[#2a3439]">{formatMoney(unit.price)}</p>
              <p className="mt-2 text-sm text-[#566166]">{unit.tenantName ?? "Aucun locataire actif assigné"}.</p>
            </div>
          </SurfaceCard>
        </div>
      </section>
    </LandlordPageFrame>
  );
}
