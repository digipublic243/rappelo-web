"use client";
import { useActionState } from "react";
import { AppForm, FormInlineError, FormInlineSuccess, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField, FormFieldMuted } from "@/components/forms/FormField";
import { SurfaceCard } from "@/components/shared/StitchPrimitives";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import { PageIntro } from "@/components/ui/PageIntro";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";
import { cn } from "@/lib/cn";
import { formatCadence, formatMoney, formatPaymentMethod, paymentStatusLabel, unitStatusLabel } from "@/lib/format";
import type { UnitEditorActionState } from "@/features/landlord/unit-editor-state";
import type { UnitDetailVm } from "@/types/view-models";

interface UnitConfigurationFormProps {
  action: (state: UnitEditorActionState, formData: FormData) => Promise<UnitEditorActionState>;
  detail: UnitDetailVm;
  initialState: UnitEditorActionState;
}

const unitTypeOptions = [
  { value: "studio", label: "Studio" },
  { value: "1br", label: "1 chambre" },
  { value: "2br", label: "2 chambres" },
  { value: "3br", label: "3 chambres" },
  { value: "4br", label: "4 chambres" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Autre" },
];

const unitStatusOptions = [
  { value: "vacant", label: "Vacante" },
  { value: "reserved", label: "Réservée" },
  { value: "occupied", label: "Occupée" },
  { value: "maintenance", label: "Maintenance" },
];

const periodicityOptions = [
  { value: "journ", label: "Journalier" },
  { value: "hebdo", label: "Hebdomadaire" },
  { value: "mensuel", label: "Mensuel" },
  { value: "autre", label: "Autre" },
];

const currencyOptions = [
  { value: "CDF", label: "CDF" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
];

export function UnitConfigurationForm({
  action,
  detail,
  initialState,
}: UnitConfigurationFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const { unit, details, payments } = detail;
  const allowedMethods = new Set(
    (details.allowedPaymentMethods?.length
      ? details.allowedPaymentMethods
      : unit.allowedPaymentMethods ?? []
    ).map((method) => String(method)),
  );
  const pendingPayments = payments.filter((payment) => payment.status === "pending");
  const currentCurrency = details.currency ?? unit.currency ?? "CDF";

  useSyncGlobalApiError(state.error, {
    title: "Échec de mise à jour de l’unité",
    scope: "unit-configuration",
  });

  return (
    <AppForm action={formAction} className="space-y-[var(--space-8)]">
      <PageIntro
        eyebrow={details.propertyName ?? "Unité"}
        backHref="/landlord/units"
        backLabel="Retour aux unités"
        title={`${unit.label} · Configuration`}
        description="Mettez à jour le loyer, le statut d’occupation, la politique d’avance et les moyens de paiement sans quitter la fiche de l’unité."
        action={
          <div className="flex flex-wrap items-center justify-end gap-[var(--space-3)]">
            <FormSubmitButton
              className="rounded-[var(--radius-lg)] px-[var(--space-6)]"
              disabled={pending}
            >
              {pending ? "Enregistrement..." : "Enregistrer les changements"}
            </FormSubmitButton>
          </div>
        }
      />

      <div className="grid gap-[var(--space-8)] xl:grid-cols-12">
        <div className="space-y-[var(--space-8)] xl:col-span-8">
          <SurfaceCard className="p-[var(--space-8)]">
            <div className="flex flex-wrap items-start justify-between gap-[var(--space-4)]">
              <div className="flex items-start gap-[var(--space-4)]">
                <div className="rounded-[var(--radius-lg)] bg-primary-4 p-[var(--space-3)] text-primary">
                  <MaterialIcon name="apartment" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Identité et tarification
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-secondary-2">
                    Cette section pilote les informations contractuelles réellement
                    consommées par les baux et paiements du backend.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-[var(--space-2)]">
                <StatusBadge
                  label={unitStatusLabel(unit.status)}
                  status={unit.status}
                />
                <span className="rounded-full bg-secondary px-[var(--space-3)] py-[var(--space-2)] text-xs font-semibold text-secondary-2">
                  {formatCadence(unit.pricingCadence)}
                </span>
              </div>
            </div>

            <div className="mt-[var(--space-8)] grid gap-[var(--space-5)] lg:grid-cols-2">
              <InteractiveCard
                description="Ce qui identifie l’unité dans le portefeuille."
                icon="door_front"
                title="Carte d’identité"
              >
                <div className="grid gap-[var(--space-4)]">
                  <FormFieldMuted
                    defaultValue={unit.label}
                    label="Numéro d’unité"
                    name="unit_number"
                    required
                  />
                  <FormFieldMuted
                    defaultValue={unit.type}
                    label="Type d’unité"
                    name="unit_type"
                    options={unitTypeOptions}
                    required
                    type="select"
                  />
                  <div className="grid gap-[var(--space-3)] sm:grid-cols-2">
                    <FormField
                      defaultChecked={details.isActive}
                      label="Activée dans le portefeuille"
                      name="is_active"
                      type="checkbox"
                      value="true"
                    />
                    <FormField
                      defaultChecked={details.isFurnished}
                      label="Unité meublée"
                      name="is_furnished"
                      type="checkbox"
                      value="true"
                    />
                  </div>
                </div>
              </InteractiveCard>

              <InteractiveCard
                description="Le backend s’appuie sur ces valeurs pour les baux et les paiements."
                icon="payments"
                title="Tarification"
              >
                <div className="grid gap-[var(--space-4)]">
                  <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
                    <FormFieldMuted
                      defaultValue={details.rent ?? unit.price}
                      label="Loyer"
                      name="rent"
                      required
                      step="0.01"
                      type="number"
                    />
                    <FormFieldMuted
                      defaultValue={details.currency ?? unit.currency ?? "CDF"}
                      helperText="Doit rester alignée sur le bien."
                      label="Devise"
                      name="currency"
                      options={currencyOptions}
                      required
                      type="select"
                    />
                  </div>
                  <FormField
                    activeOptionClassName="border-primary bg-primary-4 text-foreground shadow-[var(--shadow-xs)]"
                    defaultValue={details.rentalPeriodicity ?? "mensuel"}
                    helperText="Le loyer correspond à cette cadence."
                    inactiveOptionClassName="border-secondary-1 bg-background text-foreground"
                    label="Périodicité"
                    name="rental_periodicity"
                    options={periodicityOptions.map((option) => ({
                      ...option,
                      description:
                        option.value === "mensuel"
                          ? "Standard pour les baux résidentiels"
                          : option.value === "hebdo"
                            ? "Pour location flexible"
                            : option.value === "journ"
                              ? "Pour usage courte durée"
                              : "Cadence métier spécifique",
                    }))}
                    type="radio-group"
                  />
                </div>
              </InteractiveCard>

              <InteractiveCard
                className="lg:col-span-2"
                description="Choisissez l’état réel de l’unité sans quitter la page."
                icon="published_with_changes"
                title="Cycle de vie"
              >
                <FormField
                  activeOptionClassName="border-primary bg-primary-4 text-foreground shadow-[var(--shadow-xs)]"
                  defaultValue={unit.status}
                  inactiveOptionClassName="border-secondary-1 bg-background text-foreground"
                  name="status"
                  options={unitStatusOptions.map((option) => ({
                    ...option,
                    description:
                      option.value === "vacant"
                        ? "Disponible à la location"
                        : option.value === "reserved"
                          ? "Réservée sans occupation"
                          : option.value === "occupied"
                            ? "Occupée par un locataire"
                            : "Indisponible temporairement",
                  }))}
                  type="radio-group"
                />
              </InteractiveCard>

              <InteractiveCard
                description="Caractéristiques physiques et lecture rapide des espaces."
                icon="straighten"
                title="Caractéristiques"
              >
                <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
                  <FormFieldMuted
                    defaultValue={details.bedrooms ?? ""}
                    label="Chambres"
                    min={0}
                    name="bedrooms"
                    type="number"
                  />
                  <FormFieldMuted
                    defaultValue={details.bathrooms ?? ""}
                    label="Salles d’eau"
                    min={0}
                    name="bathrooms"
                    type="number"
                  />
                  <FormFieldMuted
                    defaultValue={details.squareFootage ?? ""}
                    label="Surface"
                    min={0}
                    name="square_footage"
                    type="number"
                  />
                  <FormFieldMuted
                    defaultValue={details.floorNumber ?? ""}
                    label="Étage"
                    name="floor_number"
                    type="number"
                  />
                </div>
              </InteractiveCard>

              <InteractiveCard
                description="Définissez les montants de protection et d’engagement."
                icon="wallet"
                title="Garanties et acomptes"
              >
                <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
                  <FormFieldMuted
                    defaultValue={details.securityDeposit ?? ""}
                    label="Dépôt de garantie"
                    min={0}
                    name="security_deposit"
                    step="0.01"
                    type="number"
                  />
                  <FormFieldMuted
                    defaultValue={details.bookingDeposit ?? ""}
                    label="Acompte de réservation"
                    min={0}
                    name="booking_deposit"
                    step="0.01"
                    type="number"
                  />
                  <FormFieldMuted
                    defaultValue={details.securityDepositMonthsRequired ?? ""}
                    helperText="0 si aucune exigence par défaut."
                    label="Mois de garantie requis"
                    min={0}
                    name="security_deposit_months_required"
                    type="number"
                  />
                </div>
              </InteractiveCard>

              <InteractiveCard
                className="lg:col-span-2"
                description="Ces options apparaissent dans les parcours de paiement et de réservation."
                icon="credit_card"
                title="Encaissement"
              >
                <div className="grid gap-[var(--space-4)] lg:grid-cols-[1.1fr_1fr]">
                  <div className="grid gap-[var(--space-4)] md:grid-cols-3">
                    <FormField
                      className="h-full"
                      defaultChecked={allowedMethods.has("cash")}
                      label="Espèces"
                      name="payment_method_cash"
                      type="checkbox"
                      value="true"
                    />
                    <FormField
                      className="h-full"
                      defaultChecked={
                        allowedMethods.has("easypay") ||
                        allowedMethods.has("mobile_money")
                      }
                      label="EasyPay"
                      name="payment_method_easypay"
                      type="checkbox"
                      value="true"
                    />
                    <FormField
                      className="h-full"
                      defaultChecked={allowedMethods.has("bank_transfer")}
                      label="Virement bancaire"
                      name="payment_method_bank_transfer"
                      type="checkbox"
                      value="true"
                    />
                  </div>
                  <FormFieldMuted
                    defaultValue={details.advancePaymentPolicyText ?? ""}
                    helperText="Affiché dans les demandes de réservation et les instructions de paiement."
                    label="Politique de paiement d’avance"
                    name="advance_payment_policy_text"
                    rows={5}
                    type="textarea"
                  />
                </div>
              </InteractiveCard>

              <InteractiveCard
                className="lg:col-span-2"
                description="Informations issues du backend pour comprendre l’état actuel de l’unité."
                icon="person"
                title="Contexte d’occupation"
              >
                <div className="grid gap-[var(--space-4)] md:grid-cols-3">
                  <MetricCard
                    label="Bien"
                    value={details.propertyName ?? "Non rattaché"}
                  />
                  <MetricCard
                    label="Locataire"
                    value={
                      detail.unit.tenantName ??
                      details.currentTenantName ??
                      "Aucun locataire actif"
                    }
                  />
                  <MetricCard
                    label="Bail actif"
                    value={details.currentLeaseNumber ?? "Aucun bail actif"}
                  />
                </div>
                <div className="mt-[var(--space-4)]">
                  <FormFieldMuted
                    defaultValue={details.description ?? ""}
                    label="Description opérationnelle"
                    name="description"
                    rows={4}
                    type="textarea"
                  />
                </div>
              </InteractiveCard>
            </div>
          </SurfaceCard>
        </div>

        <div className="space-y-[var(--space-8)] xl:col-span-4">
          <SurfaceCard className="p-[var(--space-8)]">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-3">
              Vue rapide
            </p>
            <div className="mt-[var(--space-5)] space-y-[var(--space-4)]">
              <div className="rounded-[var(--radius-lg)] bg-primary-4 p-[var(--space-4)]">
                <p className="text-sm font-semibold text-primary">Loyer actuel</p>
                <p className="mt-[var(--space-2)] text-3xl font-black text-foreground">
                  {formatMoney(details.rent ?? unit.price, currentCurrency)}
                </p>
                <p className="mt-[var(--space-2)] text-sm text-secondary-2">
                  {formatCadence(unit.pricingCadence)}
                </p>
              </div>
              <div className="grid gap-[var(--space-3)] sm:grid-cols-2 xl:grid-cols-1">
                <MetricCard
                  label="Bien"
                  value={details.propertyName ?? "Non rattaché"}
                />
                <MetricCard
                  label="Locataire"
                  value={
                    details.currentTenantName ??
                    unit.tenantName ??
                    "Aucun locataire actif"
                  }
                />
                <MetricCard
                  label="Bail"
                  value={details.currentLeaseNumber ?? "Aucun bail actif"}
                />
                <MetricCard
                  label="Paiements liés"
                  value={`${payments.length} mouvement${payments.length > 1 ? "s" : ""}`}
                />
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-[var(--space-8)]">
            <div className="flex items-center gap-[var(--space-3)]">
              <div className="rounded-[var(--radius-md)] bg-secondary p-[var(--space-3)] text-primary">
                <MaterialIcon name="history" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Activité récente</h2>
                <p className="text-sm text-secondary-2">
                  Les derniers paiements liés à cette unité.
                </p>
              </div>
            </div>

            <div className="mt-[var(--space-6)] space-y-[var(--space-3)]">
              {payments.slice(0, 3).map((payment) => (
                <div
                  key={payment.id}
                  className="rounded-[var(--radius-lg)] border border-secondary-1 bg-secondary-4 px-[var(--space-4)] py-[var(--space-4)]"
                >
                  <div className="flex items-start justify-between gap-[var(--space-3)]">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {payment.paymentLabel ?? "Paiement"}
                      </p>
                      <p className="mt-1 text-xs text-secondary-2">
                        {formatPaymentMethod(payment.method)}
                      </p>
                    </div>
                    <StatusBadge
                      label={paymentStatusLabel(payment.status)}
                      status={payment.status}
                    />
                  </div>
                  <p className="mt-[var(--space-3)] text-sm font-semibold text-primary">
                    {formatMoney(payment.amount, payment.currency ?? currentCurrency)}
                  </p>
                </div>
              ))}

              {payments.length === 0 ? (
                <div className="rounded-[var(--radius-lg)] border border-dashed border-secondary-1 px-[var(--space-4)] py-[var(--space-5)] text-sm text-secondary-2">
                  Aucun paiement n’est encore rattaché à cette unité.
                </div>
              ) : null}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-[var(--space-8)]">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-secondary-3">
              Contrôle qualité
            </p>
            <div className="mt-[var(--space-5)] space-y-[var(--space-4)]">
              <MetricCard
                label="Paiements en attente"
                value={`${pendingPayments.length}`}
              />
              <MetricCard
                label="Moyens actifs"
                value={`${allowedMethods.size || 1}`}
              />
              <MetricCard
                label="Devise métier"
                value={currentCurrency}
              />
            </div>

            <div className="mt-[var(--space-6)] space-y-[var(--space-3)]">
              <FormInlineSuccess message={state.success} />
              <FormInlineError message={state.error} />
              {state.errorDetails?.length ? (
                <div className="rounded-[var(--radius-lg)] border border-danger/30 bg-background px-[var(--space-4)] py-[var(--space-4)]">
                  <p className="text-sm font-bold text-danger">
                    Vérifiez les éléments suivants :
                  </p>
                  <ul className="mt-[var(--space-3)] list-disc space-y-[var(--space-2)] pl-[var(--space-5)] text-sm text-danger">
                    {state.errorDetails.map((detailItem) => (
                      <li key={detailItem}>{detailItem}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </SurfaceCard>
        </div>
      </div>
    </AppForm>
  );
}

function MetricCard({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border border-secondary-1 bg-background px-[var(--space-4)] py-[var(--space-4)]",
        className,
      )}
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary-3">
        {label}
      </p>
      <p className="mt-[var(--space-2)] text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function InteractiveCard({
  title,
  description,
  icon,
  children,
  className,
}: {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[var(--radius-xl)] border border-secondary-1 bg-secondary-4 p-[var(--space-6)]",
        className,
      )}
    >
      <div className="flex items-start gap-[var(--space-4)]">
        <div className="rounded-[var(--radius-lg)] bg-background p-[var(--space-3)] text-primary shadow-[var(--shadow-xs)]">
          <MaterialIcon name={icon} size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <p className="mt-1 text-sm leading-6 text-secondary-2">{description}</p>
        </div>
      </div>
      <div className="mt-[var(--space-6)]">{children}</div>
    </section>
  );
}
