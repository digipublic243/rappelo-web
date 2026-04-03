"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AppForm, FormInlineError, FormSubmitButton } from "@/components/forms/AppForm";
import { FormField, FormFieldMuted } from "@/components/forms/FormField";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { ApiUnitStatus } from "@/types/api";
import type { UnitEditorActionState } from "@/features/landlord/unit-editor-state";
import { useSyncGlobalApiError } from "@/components/providers/ApiErrorProvider";

interface UnitEditorDefaults {
  propertyId: string;
  unitNumber: string;
  unitType: string;
  rent: string;
  currency: string;
  rentalPeriodicity: "journ" | "hebdo" | "mensuel" | "autre";
  description: string;
  isFurnished: boolean;
}

interface PropertyOption {
  label: string;
  value: string;
  currency?: string;
}

interface UnitEditorFormProps {
  action: (state: UnitEditorActionState, formData: FormData) => Promise<UnitEditorActionState>;
  defaults: UnitEditorDefaults;
  initialState: UnitEditorActionState;
  propertyOptions: PropertyOption[];
}

const unitStatusLabels: Record<ApiUnitStatus, string> = {
  vacant: "Vacante",
  reserved: "Réservée",
  occupied: "Occupée",
  maintenance: "Maintenance",
};

const unitTypeOptions = [
  { value: "studio", label: "Studio" },
  { value: "1br", label: "1 chambre" },
  { value: "2br", label: "2 chambres" },
  { value: "3br", label: "3 chambres" },
  { value: "4br", label: "4 chambres" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Autre" },
];

export function UnitEditorForm({ action, defaults, initialState, propertyOptions }: UnitEditorFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [selectedStatus] = useState<ApiUnitStatus>("vacant");
  const [selectedPropertyId, setSelectedPropertyId] = useState(defaults.propertyId);

  const selectedProperty =
    propertyOptions.find((property) => property.value === selectedPropertyId) ??
    propertyOptions[0];
  const inheritedCurrency = selectedProperty?.currency ?? "";

  useSyncGlobalApiError(state.error, {
    title: "Échec de création de l’unité",
    scope: "unit-editor",
  });

  return (
    <AppForm action={formAction} className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-8 lg:col-span-8">
        <section className="rounded-[28px] bg-background p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary p-3 text-primary">
              <MaterialIcon name="apartment" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Identité de l’unité</h2>
              <p className="text-sm text-secondary-2">Rattachez l’unité à un bien et définissez son identité opérationnelle pour les baux et paiements.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <FormFieldMuted
              defaultValue={defaults.propertyId}
              label="Bien"
              name="property"
              onChange={setSelectedPropertyId}
              options={propertyOptions}
              required
              type="select"
            />
            <FormFieldMuted defaultValue={defaults.unitNumber} label="Numéro d’unité" name="unit_number" required />
            <FormFieldMuted
              defaultValue={defaults.unitType}
              label="Type d’unité"
              name="unit_type"
              options={unitTypeOptions}
              required
              type="select"
            />
            <FormFieldMuted defaultValue={defaults.description} className="md:col-span-2" label="Description" name="description" rows={5} type="textarea" />
          </div>
        </section>

        <section className="rounded-[28px] bg-background p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-secondary p-3 text-primary">
              <MaterialIcon name="payments" className="text-[22px]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Tarification et caractéristiques</h2>
              <p className="text-sm text-secondary-2">Définissez le loyer et la périodicité pris en charge par le contrat backend de création simple.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <FormFieldMuted defaultValue={defaults.rent} label="Loyer" name="rent" required step="0.01" type="number" />
            <FormFieldMuted
              defaultValue={defaults.currency}
              helperText={
                inheritedCurrency
                  ? `Devise du bien sélectionné : ${inheritedCurrency}. Le backend rejettera une devise différente.`
                  : "Laissez la devise alignée sur le bien sélectionné."
              }
              label="Devise"
              name="currency"
              options={[
                { label: "CDF", value: "CDF" },
                { label: "USD", value: "USD" },
                { label: "EUR", value: "EUR" },
              ]}
              type="select"
            />
            <FormFieldMuted
              defaultValue={defaults.rentalPeriodicity}
              label="Périodicité locative"
              name="rental_periodicity"
              options={[
                { label: "Journalier", value: "journ" },
                { label: "Hebdomadaire", value: "hebdo" },
                { label: "Mensuel", value: "mensuel" },
                { label: "Autre", value: "autre" },
              ]}
              required
              type="select"
            />
            <div className="space-y-3 self-end md:col-span-2">
              <FormField className="!text-sm" defaultChecked={defaults.isFurnished} label="Unité meublée" name="is_furnished" type="checkbox" value="true" />
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-8 lg:col-span-4">
        <section className="rounded-[28px] bg-[var(--primary-2)] p-8 text-white shadow-[var(--shadow-lg)]">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Statut initial</h2>
            <span className="rounded-full bg-background/14 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">
              Relié à l’API
            </span>
          </div>
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-white/20 bg-background/10 px-4 py-4">
              <p className="text-sm font-semibold text-white">{unitStatusLabels[selectedStatus]}</p>
              <p className="mt-2 text-sm text-white/75">
                L’API crée l’unité dans un état simple. Les changements de statut passent ensuite par les actions dédiées `activate`, `deactivate` et `update_status`.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] bg-background p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--secondary-3)]">Résumé de configuration</p>
          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-2">Cadence tarifaire</span>
              <span className="font-bold text-foreground">
                {defaults.rentalPeriodicity === "journ"
                  ? "Journalier"
                  : defaults.rentalPeriodicity === "hebdo"
                    ? "Hebdomadaire"
                    : defaults.rentalPeriodicity === "autre"
                      ? "Autre"
                      : "Mensuel"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-2">Devise appliquée</span>
              <span className="font-bold text-foreground">
                {inheritedCurrency || defaults.currency || "Devise du bien"}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-2">Statut initial</span>
              <span className="font-bold capitalize text-foreground">{selectedStatus}</span>
            </div>
            <div className="rounded-xl bg-[var(--secondary-4)] px-4 py-3 text-sm text-secondary-2">
              Les champs avancés comme `security_deposit`, `booking_deposit`, `allowed_payment_methods` et `advance_payment_policy_text` sont documentés au niveau détail ou mise à jour, pas dans la création simple.
            </div>
          </div>
        </section>

        <div className="space-y-3">
          <FormInlineError className="rounded-2xl" message={state.error} />
          {state.errorDetails?.length ? (
            <div className="rounded-2xl border border-[color-mix(in_srgb,var(--danger) 30%,var(--background))] bg-background px-5 py-4">
              <p className="text-sm font-bold text-[var(--danger)]">Veuillez vérifier ces champs :</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[color-mix(in_srgb,var(--danger) 72%,var(--background))]">
                {state.errorDetails.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="lg:col-span-12">
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Link className="inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold text-secondary-2" href="/landlord/units">
            Annuler
          </Link>
          <FormSubmitButton className="rounded-lg px-6 text-sm shadow-sm" disabled={pending}>
            {pending ? "Enregistrement..." : "Créer l’unité"}
          </FormSubmitButton>
        </div>
      </div>
    </AppForm>
  );
}
